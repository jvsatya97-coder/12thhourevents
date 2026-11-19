'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { LEADS_URL } from '@/lib/config';

const ADMIN_PIN = '12he2024';

// Strip timezone suffix like "GMT+0530 (India Standard Time)"
function cleanTs(ts: string) {
  if (!ts) return ts;
  return ts.replace(/\s*GMT[+-]\d{4}\s*\([^)]*\)/g, '').trim();
}

// Default agents — stored in localStorage so admin can edit them
const DEFAULT_AGENTS = ['Satya', 'Mahesh', 'Chaitanya'];

function getAgents(): string[] {
  try {
    const raw = localStorage.getItem('12he_agents');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_AGENTS;
}
function saveAgents(agents: string[]) {
  try { localStorage.setItem('12he_agents', JSON.stringify(agents)); } catch { /* ignore */ }
}

const STATUS_OPTIONS = [
  { value: 'initiations',  label: 'Initiations',          color: '#6366f1', bg: '#eef2ff' },
  { value: 'contacted',    label: 'Contacted',             color: '#8b5cf6', bg: '#f5f3ff' },
  { value: 'quoted',       label: 'Quotation in process',  color: '#f59e0b', bg: '#fffbeb' },
  { value: 'confirmed',    label: 'Confirmed',             color: '#10b981', bg: '#ecfdf5' },
  { value: 'done',         label: 'Done ✓',                color: '#059669', bg: '#d1fae5' },
  { value: 'lost',         label: 'Lost ✗',                color: '#ef4444', bg: '#fef2f2' },
];

type Lead = {
  row: number;
  timestamp: string;
  name: string;
  phone: string;
  product: string;
  date: string;
  timeslot: string;
  venue: string;
  city: string;
  notes: string;
  source: string;
  status: string;
  assignee: string;
  crmNotes: string;
  followup: string;
};

function statusMeta(s: string) {
  return STATUS_OPTIONS.find(x => x.value === (s || '').toLowerCase()) || STATUS_OPTIONS[0];
}

function fmtDate(ts: string) {
  if (!ts) return '—';
  const d = new Date(cleanTs(ts));
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() +
    ' ' + d.toLocaleDateString('en-IN', { weekday: 'short' });
}

function fmtPartyDate(ts: string) {
  if (!ts) return '—';
  const d = new Date(cleanTs(ts));
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() +
    ' ' + d.toLocaleDateString('en-IN', { weekday: 'short' });
}

// Generate a stable 6-digit lead ID from row number
function leadId(row: number): string {
  return String(100000 + row);
}

// Extract Google Maps URL from venue string if it contains coordinates
function mapsUrl(venue: string, city: string): string | null {
  if (!venue) return null;
  if (venue.startsWith('http')) return venue;
  const q = encodeURIComponent([venue, city].filter(Boolean).join(', '));
  return `https://maps.google.com/?q=${q}`;
}

function getLeadsFromSheet(url: string): Promise<Lead[]> {
  return new Promise<Lead[]>((resolve) => {
    const cbName = '_leadsCallback_' + Date.now();
    (window as any)[cbName] = (data: { leads: Lead[] }) => {
      delete (window as any)[cbName];
      document.head.removeChild(script);
      resolve(data?.leads || []);
    };
    const script = document.createElement('script');
    script.src = `${url}?action=getLeads&callback=${cbName}`;
    script.onerror = () => { delete (window as any)[cbName]; resolve([]); };
    document.head.appendChild(script);
  });
}

function updateLeadInSheet(url: string, row: number, field: string, value: string) {
  return new Promise<void>((resolve) => {
    const cbName = '_leadUpdate_' + Date.now();
    (window as any)[cbName] = () => { delete (window as any)[cbName]; document.head.removeChild(script); resolve(); };
    const script = document.createElement('script');
    script.src = `${url}?action=updateLead&row=${row}&field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}&callback=${cbName}`;
    script.onerror = () => { delete (window as any)[cbName]; resolve(); };
    document.head.appendChild(script);
  });
}

// ── PIN gate ─────────────────────────────────────────────────────────────────
export default function LeadsWrapper() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinErr, setPinErr] = useState(false);

  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-xl font-bold mb-2 text-gray-800">Leads CRM</h1>
        <p className="text-sm text-gray-500 mb-6">12th Hour Events</p>
        <input type="password" placeholder="Enter PIN"
          value={pin}
          onChange={e => { setPin(e.target.value); setPinErr(false); }}
          onKeyDown={e => { if (e.key === 'Enter') { if (pin === ADMIN_PIN) setAuthed(true); else setPinErr(true); } }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest mb-4 focus:outline-none focus:border-orange-400"
        />
        {pinErr && <p className="text-red-500 text-sm mb-3">Wrong PIN</p>}
        <button onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setPinErr(true); }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition">
          Enter →
        </button>
      </div>
    </div>
  );

  return <LeadsCRM />;
}

// ── Main CRM ──────────────────────────────────────────────────────────────────
function LeadsCRM() {
  const [leads, setLeads]           = useState<Lead[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [savingRow, setSavingRow]   = useState<number | null>(null);
  const [selected, setSelected]     = useState<Lead | null>(null);
  const [agents, setAgents]         = useState<string[]>(DEFAULT_AGENTS);
  const [page, setPage]             = useState<'crm' | 'team'>('crm');

  // Filters
  const [filterStatus,   setFilterStatus]   = useState('all');
  const [filterAgent,    setFilterAgent]    = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [searchMobile,   setSearchMobile]   = useState('');
  const [pageSize,       setPageSize]       = useState(25);
  const [tableSearch,    setTableSearch]    = useState('');

  // New-lead highlight tracking
  const knownRowsRef = useRef<Set<number> | null>(null);
  const [newRowIds, setNewRowIds] = useState<Set<number>>(new Set());

  // Load agents from localStorage
  useEffect(() => { setAgents(getAgents()); }, []);

  const loadLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const data = await getLeadsFromSheet(LEADS_URL);
      if (knownRowsRef.current === null) {
        knownRowsRef.current = new Set(data.map(l => l.row));
        setNewRowIds(new Set());
      } else {
        const fresh = new Set<number>();
        data.forEach(l => { if (!knownRowsRef.current!.has(l.row)) fresh.add(l.row); });
        knownRowsRef.current = new Set(data.map(l => l.row));
        if (fresh.size > 0) setNewRowIds(fresh);
      }
      setLeads(data);
    } catch {
      if (!silent) setError('Could not load leads.');
    }
    if (!silent) setLoading(false);
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);
  useEffect(() => {
    const id = setInterval(() => loadLeads(true), 5000);
    return () => clearInterval(id);
  }, [loadLeads]);

  const updateLead = useCallback(async (lead: Lead, field: keyof Lead, value: string) => {
    setSavingRow(lead.row);
    setLeads(prev => prev.map(l => l.row === lead.row ? { ...l, [field]: value } : l));
    if (selected?.row === lead.row) setSelected(prev => prev ? { ...prev, [field]: value } : prev);
    await updateLeadInSheet(LEADS_URL, lead.row, field, value);
    setSavingRow(null);
  }, [selected]);

  // Apply filters
  const filtered = leads.filter(l => {
    if (filterStatus !== 'all' && (l.status || 'initiations').toLowerCase() !== filterStatus) return false;
    if (filterAgent !== 'all' && (l.assignee || '') !== filterAgent) return false;
    if (searchMobile && !l.phone.replace(/\D/g, '').includes(searchMobile.replace(/\D/g, ''))) return false;
    if (filterDateFrom) {
      const ts = new Date(cleanTs(l.timestamp || '')).getTime();
      if (isNaN(ts) || ts < new Date(filterDateFrom).getTime()) return false;
    }
    if (filterDateTo) {
      const ts = new Date(cleanTs(l.timestamp || '')).getTime();
      if (isNaN(ts) || ts > new Date(filterDateTo + 'T23:59:59').getTime()) return false;
    }
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return l.name?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        l.product?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    const ta = new Date(cleanTs(a.timestamp || '')).getTime() || 0;
    const tb = new Date(cleanTs(b.timestamp || '')).getTime() || 0;
    return tb - ta;
  });

  const paged = filtered.slice(0, pageSize);
  const newCount = newRowIds.size;

  if (page === 'team') return (
    <TeamSettings
      agents={agents}
      onSave={a => { saveAgents(a); setAgents(a); setPage('crm'); }}
      onBack={() => setPage('crm')}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-gray-800 text-lg leading-tight">Leads CRM</h1>
              <p className="text-xs text-gray-400">12th Hour Events</p>
            </div>
            {newCount > 0 && (
              <span className="animate-pulse bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                🔔 {newCount} new!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => loadLeads(false)}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              🔄 Refresh
            </button>
            <button onClick={() => setPage('team')}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
              👥 Team
            </button>
            <a href="/admin/analytics"
              className="text-sm font-bold px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
              📊 Analytics
            </a>
            <a href="/admin"
              className="text-sm font-bold px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition">
              ⚙️ Admin
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-4">

        {/* Filter bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-400 bg-white min-w-[160px]">
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Agent */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Agent</label>
              <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-orange-400 bg-white min-w-[150px]">
                <option value="all">— Select Agent —</option>
                {agents.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Date range */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Start Date</label>
              <input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">End Date</label>
              <input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>

            {/* Search by mobile */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500">Search By Mobile</label>
              <input type="tel" placeholder="Enter mobile number…" value={searchMobile}
                onChange={e => setSearchMobile(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 w-44" />
            </div>

            {/* Clear filters */}
            {(filterStatus !== 'all' || filterAgent !== 'all' || filterDateFrom || filterDateTo || searchMobile) && (
              <button onClick={() => { setFilterStatus('all'); setFilterAgent('all'); setFilterDateFrom(''); setFilterDateTo(''); setSearchMobile(''); }}
                className="text-xs text-red-500 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition mt-auto">
                ✕ Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">
                {filtered.length} lead{filtered.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Show</span>
                <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
                  className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-orange-400 bg-white">
                  {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <span className="text-xs text-gray-400">entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Search:</span>
              <input value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                placeholder="Name, product, city…"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-orange-400 w-40" />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading leads…</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">⚠️</p>
              <p className="text-red-500 font-semibold">{error}</p>
              <button onClick={() => loadLeads(false)} className="mt-3 text-sm text-orange-500 underline">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-semibold">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 text-left whitespace-nowrap">ID</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Customer Details</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Creation Date</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Party Date</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Location</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">C Message</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Insights</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Comments</th>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.map((lead, i) => {
                    const isNew = newRowIds.has(lead.row);
                    const sm = statusMeta(lead.status);
                    const mapLink = mapsUrl(lead.venue, lead.city);
                    const saving = savingRow === lead.row;

                    return (
                      <tr key={lead.row}
                        className={`transition-colors ${isNew ? 'bg-orange-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-orange-50/60`}>

                        {/* ID */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                            {leadId(lead.row)}
                          </span>
                          {isNew && <span className="ml-1 text-[9px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded-full">NEW</span>}
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          {lead.product ? (
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg whitespace-nowrap">
                              {lead.product.length > 20 ? lead.product.slice(0, 18) + '…' : lead.product}
                            </span>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>

                        {/* Customer Details */}
                        <td className="px-4 py-3 min-w-[140px]">
                          <p className="font-semibold text-gray-800">{lead.name || '—'}</p>
                          <a href={`tel:${lead.phone}`} className="text-xs text-blue-600 hover:underline font-mono">
                            {lead.phone}
                          </a>
                        </td>

                        {/* Creation Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-xs text-gray-600">{fmtDate(lead.timestamp)}</p>
                        </td>

                        {/* Party Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-xs text-gray-600">{lead.date ? fmtPartyDate(lead.date) : '—'}</p>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 min-w-[120px]">
                          {mapLink ? (
                            <a href={mapLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                              <span>📍</span>
                              <span className="max-w-[100px] truncate">{lead.city || lead.venue || 'View Map'}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">{lead.city || '—'}</span>
                          )}
                          {lead.venue && lead.city && (
                            <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{lead.venue}</p>
                          )}
                        </td>

                        {/* C Message */}
                        <td className="px-4 py-3 max-w-[180px]">
                          {lead.notes ? (
                            <p className="text-xs text-gray-600 line-clamp-3 whitespace-pre-wrap">{lead.notes}</p>
                          ) : <span className="text-gray-300 text-xs">—</span>}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 min-w-[160px]">
                          <select
                            value={(lead.status || 'initiations').toLowerCase()}
                            onChange={e => updateLead(lead, 'status', e.target.value)}
                            disabled={saving}
                            style={{ background: sm.bg, color: sm.color, borderColor: sm.color + '40' }}
                            className="text-xs font-bold px-2 py-1.5 rounded-lg border outline-none cursor-pointer w-full"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-gray-400 mt-1">
                            Assigned To : <span className="font-semibold text-gray-600">{lead.assignee || '—'}</span>
                          </p>
                        </td>

                        {/* Insights */}
                        <td className="px-4 py-3 min-w-[120px]">
                          <div className="space-y-1 text-[10px] text-gray-500">
                            {lead.source && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">Source:</span>
                                <span className="font-semibold text-gray-700">{lead.source}</span>
                              </div>
                            )}
                            {lead.timeslot && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">Time:</span>
                                <span className="font-semibold text-gray-700">{lead.timeslot}</span>
                              </div>
                            )}
                            {lead.followup && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">Follow-up:</span>
                                <span className="font-semibold text-orange-600">{lead.followup}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Comments */}
                        <td className="px-4 py-3 min-w-[160px]">
                          <textarea
                            value={lead.crmNotes || ''}
                            onChange={e => {
                              setLeads(prev => prev.map(l => l.row === lead.row ? { ...l, crmNotes: e.target.value } : l));
                            }}
                            onBlur={e => updateLead(lead, 'crmNotes', e.target.value)}
                            placeholder="Add comment…"
                            rows={2}
                            className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 resize-none bg-white"
                          />
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 min-w-[140px]">
                          <div className="space-y-1.5">
                            {/* Assign agent */}
                            <select
                              value={lead.assignee || ''}
                              onChange={e => updateLead(lead, 'assignee', e.target.value)}
                              disabled={saving}
                              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 bg-white"
                            >
                              <option value="">Assign agent…</option>
                              {agents.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            {/* WhatsApp */}
                            <a
                              href={`https://wa.me/91${lead.phone.replace(/\D/g, '').slice(-10)}?text=Hi ${lead.name}, this is regarding your decoration enquiry.`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 w-full text-xs font-semibold bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg transition">
                              💬 WhatsApp
                            </a>
                            {/* View details */}
                            <button onClick={() => setSelected(lead)}
                              className="w-full text-xs font-semibold border border-gray-200 hover:bg-gray-50 text-gray-600 py-1.5 rounded-lg transition">
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing 1 to {Math.min(pageSize, filtered.length)} of {filtered.length} entries
              </p>
              {filtered.length > pageSize && (
                <button onClick={() => setPageSize(p => p + 25)}
                  className="text-xs font-semibold text-orange-500 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-50 transition">
                  Load more ↓
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <LeadDetail
          lead={selected}
          agents={agents}
          saving={savingRow === selected.row}
          onUpdate={(field, val) => updateLead(selected, field, val)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ── Lead Detail Drawer ────────────────────────────────────────────────────────
function LeadDetail({ lead, agents, saving, onUpdate, onClose }: {
  lead: Lead;
  agents: string[];
  saving: boolean;
  onUpdate: (field: keyof Lead, val: string) => void;
  onClose: () => void;
}) {
  const sm = statusMeta(lead.status);
  const mapLink = mapsUrl(lead.venue, lead.city);

  return (
    <div className="fixed inset-0 z-[9999] flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative ml-auto w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-gray-800">Lead #{leadId(lead.row)}</h2>
            <p className="text-xs text-gray-400">{fmtDate(lead.timestamp)}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-lg">✕</button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Customer */}
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Customer</p>
            <p className="font-bold text-gray-800 text-lg">{lead.name}</p>
            <a href={`tel:${lead.phone}`} className="text-blue-600 font-mono text-sm hover:underline">{lead.phone}</a>
            {lead.city && <p className="text-xs text-gray-500 mt-1">📍 {lead.city}</p>}
          </div>

          {/* Event info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Package</p>
              <p className="text-sm font-semibold text-gray-800">{lead.product || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Event Date</p>
              <p className="text-sm font-semibold text-gray-800">{lead.date || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Time Slot</p>
              <p className="text-sm font-semibold text-gray-800">{lead.timeslot || '—'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Source</p>
              <p className="text-sm font-semibold text-gray-800">{lead.source || '—'}</p>
            </div>
          </div>

          {/* Venue */}
          {(lead.venue || lead.city) && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Venue</p>
              <p className="text-sm text-gray-700">{lead.venue || lead.city}</p>
              {mapLink && (
                <a href={mapLink} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
                  📍 Open in Google Maps
                </a>
              )}
            </div>
          )}

          {/* Customer message */}
          {lead.notes && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Customer Message</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
            <select value={(lead.status || 'initiations').toLowerCase()}
              onChange={e => onUpdate('status', e.target.value)}
              disabled={saving}
              style={{ background: sm.bg, color: sm.color, borderColor: sm.color + '40' }}
              className="w-full text-sm font-bold px-4 py-2.5 rounded-xl border outline-none cursor-pointer">
              {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* Assign agent */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assigned To</p>
            <select value={lead.assignee || ''}
              onChange={e => onUpdate('assignee', e.target.value)}
              disabled={saving}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 bg-white">
              <option value="">— Assign agent —</option>
              {agents.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Follow-up date */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Follow-up Date</p>
            <input type="date" value={lead.followup || ''}
              onChange={e => onUpdate('followup', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
          </div>

          {/* Internal notes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Internal Notes</p>
            <textarea value={lead.crmNotes || ''}
              onChange={e => onUpdate('crmNotes', e.target.value)}
              placeholder="Add internal comments…"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 resize-none" />
          </div>

          {/* WhatsApp */}
          <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '').slice(-10)}?text=Hi ${lead.name}, this is regarding your decoration enquiry.`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-2xl transition text-sm">
            💬 Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Team Settings Page ────────────────────────────────────────────────────────
function TeamSettings({ agents, onSave, onBack }: {
  agents: string[];
  onSave: (a: string[]) => void;
  onBack: () => void;
}) {
  const [list, setList] = useState<string[]>([...agents]);
  const [newName, setNewName] = useState('');

  const add = () => {
    const n = newName.trim();
    if (!n || list.includes(n)) return;
    setList(l => [...l, n]);
    setNewName('');
  };

  const remove = (name: string) => setList(l => l.filter(x => x !== name));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-orange-500 font-bold text-xl">‹</button>
        <div>
          <h1 className="font-bold text-gray-800">👥 Team Settings</h1>
          <p className="text-xs text-gray-400">Manage agent names</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Current agents */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Current Agents</p>
          {list.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No agents added yet</p>}
          {list.map(name => (
            <div key={name} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                  {name[0].toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{name}</span>
              </div>
              <button onClick={() => remove(name)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 w-7 h-7 rounded-full flex items-center justify-center transition text-sm font-bold">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Add New Agent</p>
          <div className="flex gap-2">
            <input
              value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              placeholder="Agent name…"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400"
            />
            <button onClick={add}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">
              Add
            </button>
          </div>
        </div>

        {/* Save */}
        <button onClick={() => onSave(list)}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3.5 rounded-2xl transition text-sm">
          ✅ Save & Back to CRM
        </button>
        <button onClick={onBack} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
          Cancel
        </button>
      </div>
    </div>
  );
}
