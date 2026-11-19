'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { LEADS_URL } from '@/lib/config';

const ADMIN_PIN = '12he2024';

function cleanTs(ts: string) {
  if (!ts) return ts;
  return ts.replace(/\s*GMT[+-]\d{4}\s*\([^)]*\)/g, '').trim();
}

const DEFAULT_AGENTS = ['Satya', 'Mahesh', 'Chaitanya'];

function getAgents(): string[] {
  try { const r = localStorage.getItem('12he_agents'); if (r) return JSON.parse(r); } catch { /**/ }
  return DEFAULT_AGENTS;
}
function saveAgents(a: string[]) {
  try { localStorage.setItem('12he_agents', JSON.stringify(a)); } catch { /**/ }
}

// ── Status config ─────────────────────────────────────────────────────────────
// Row background (solid, fully visible) + badge text colour
const STATUS_META: Record<string, { label: string; rowBg: string; rowText: string; badge: string; badgeText: string }> = {
  initiations: { label: 'Initiations',          rowBg: '#fff9db', rowText: '#7a5c00', badge: '#f59e0b', badgeText: '#fff' },
  followups:   { label: 'Follow Ups',            rowBg: '#e0f0ff', rowText: '#004080', badge: '#2563eb', badgeText: '#fff' },
  cancelled:   { label: 'Cancelled',             rowBg: '#ffe4e4', rowText: '#7f0000', badge: '#dc2626', badgeText: '#fff' },
};

const CANCEL_REASONS = [
  'Price Issue',
  'Duplicate',
  'Not Responding',
  'Fake Lead',
  'Service Not Available',
  'Immediate Enquiry',
];

function sMeta(s: string) {
  return STATUS_META[(s || 'initiations').toLowerCase().replace(/[^a-z]/g, '')] || STATUS_META['initiations'];
}

// ── Lead type ─────────────────────────────────────────────────────────────────
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
  // extra CRM fields stored in crmNotes as JSON prefix
  passTo?: string;
  cancelReason?: string;
};

function leadId(row: number) { return String(100000 + row); }

function fmtDate(ts: string) {
  if (!ts) return '—';
  const d = new Date(cleanTs(ts));
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase() + ' ' +
    d.toLocaleDateString('en-IN', { weekday: 'short' });
}

function mapsUrl(venue: string, city: string) {
  if (!venue && !city) return null;
  return `https://maps.google.com/?q=${encodeURIComponent([venue, city].filter(Boolean).join(', '))}`;
}

// ── JSONP helpers ─────────────────────────────────────────────────────────────
function getLeadsFromSheet(url: string): Promise<Lead[]> {
  return new Promise<Lead[]>((resolve) => {
    const cb = '_leadsCallback_' + Date.now();
    (window as any)[cb] = (data: { leads: Lead[] }) => {
      delete (window as any)[cb]; document.head.removeChild(script); resolve(data?.leads || []);
    };
    const script = document.createElement('script');
    script.src = `${url}?action=getLeads&callback=${cb}`;
    script.onerror = () => { delete (window as any)[cb]; resolve([]); };
    document.head.appendChild(script);
  });
}

function updateLeadInSheet(url: string, row: number, field: string, value: string) {
  return new Promise<void>((resolve) => {
    const cb = '_leadUpdate_' + Date.now();
    (window as any)[cb] = () => { delete (window as any)[cb]; document.head.removeChild(script); resolve(); };
    const script = document.createElement('script');
    script.src = `${url}?action=updateLead&row=${row}&field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}&callback=${cb}`;
    script.onerror = () => { delete (window as any)[cb]; resolve(); };
    document.head.appendChild(script);
  });
}

// ── PIN gate ──────────────────────────────────────────────────────────────────
export default function LeadsWrapper() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState(false);

  if (!authed) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="text-xl font-bold mb-1 text-gray-800">Leads CRM</h1>
        <p className="text-sm text-gray-400 mb-6">12th Hour Events</p>
        <input type="password" placeholder="Enter PIN" value={pin}
          onChange={e => { setPin(e.target.value); setErr(false); }}
          onKeyDown={e => { if (e.key === 'Enter') { if (pin === ADMIN_PIN) setAuthed(true); else setErr(true); } }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest mb-3 focus:outline-none focus:border-orange-400" />
        {err && <p className="text-red-500 text-sm mb-2">Wrong PIN</p>}
        <button onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setErr(true); }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition">Enter →</button>
      </div>
    </div>
  );
  return <LeadsCRM />;
}

// ── Cancel reason modal ───────────────────────────────────────────────────────
function CancelModal({ onSelect, onClose }: { onSelect: (r: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <h2 className="font-bold text-gray-800 text-lg mb-1">Reason for Cancellation</h2>
        <p className="text-sm text-gray-400 mb-4">Select the reason this lead is cancelled</p>
        <div className="space-y-2">
          {CANCEL_REASONS.map(r => (
            <button key={r} onClick={() => onSelect(r)}
              className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-red-300 hover:bg-red-50 font-semibold text-gray-700 transition">
              {r}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600 py-2">Cancel</button>
      </div>
    </div>
  );
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

  // Cancel modal state
  const [cancelTarget, setCancelTarget] = useState<Lead | null>(null);

  // Filters
  const [filterStatus,     setFilterStatus]     = useState('all');
  const [filterAgent,      setFilterAgent]       = useState('all');
  const [filterFollowFrom, setFilterFollowFrom] = useState('');
  const [filterFollowTo,   setFilterFollowTo]   = useState('');
  const [searchMobile,     setSearchMobile]     = useState('');
  const [pageSize,         setPageSize]         = useState(25);
  const [tableSearch,      setTableSearch]      = useState('');

  const knownRowsRef = useRef<Set<number> | null>(null);
  const [newRowIds, setNewRowIds] = useState<Set<number>>(new Set());

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
    } catch { if (!silent) setError('Could not load leads.'); }
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

  // Status change — intercept cancelled to show reason modal
  const handleStatusChange = useCallback((lead: Lead, newStatus: string) => {
    if (newStatus === 'cancelled') {
      setCancelTarget(lead);
    } else {
      updateLead(lead, 'status', newStatus);
    }
  }, [updateLead]);

  const handleCancelConfirm = useCallback((reason: string) => {
    if (!cancelTarget) return;
    updateLead(cancelTarget, 'status', 'cancelled');
    updateLead(cancelTarget, 'cancelReason' as keyof Lead, reason);
    setCancelTarget(null);
  }, [cancelTarget, updateLead]);

  // Normalise status key for comparison
  const normStatus = (s: string) => (s || 'initiations').toLowerCase().replace(/[^a-z]/g, '');

  // Filtered + sorted leads
  const filtered = leads.filter(l => {
    const st = normStatus(l.status);
    if (filterStatus !== 'all' && st !== filterStatus) return false;
    if (filterAgent !== 'all' && (l.assignee || '') !== filterAgent) return false;
    if (searchMobile && !l.phone.replace(/\D/g, '').includes(searchMobile.replace(/\D/g, ''))) return false;
    // Follow-up date filter
    if (filterFollowFrom || filterFollowTo) {
      if (!l.followup) return false;
      const fd = new Date(l.followup).getTime();
      if (filterFollowFrom && fd < new Date(filterFollowFrom).getTime()) return false;
      if (filterFollowTo && fd > new Date(filterFollowTo + 'T23:59:59').getTime()) return false;
    }
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return l.name?.toLowerCase().includes(q) || l.phone?.includes(q) ||
        l.product?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q);
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
    <TeamSettings agents={agents}
      onSave={a => { saveAgents(a); setAgents(a); setPage('crm'); }}
      onBack={() => setPage('crm')} />
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navbar */}
      <div className="bg-gray-900 text-white px-4 py-3 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-bold text-orange-400 text-lg">12HE</span>
            <span className="text-gray-400 text-sm">CRM</span>
            {newCount > 0 && (
              <span className="animate-pulse bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                🔔 {newCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <button onClick={() => loadLeads(false)}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition font-medium">
              🔄 Refresh
            </button>
            <button onClick={() => setPage('team')}
              className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition font-medium">
              👥 Team
            </button>
            <a href="/admin/analytics"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-bold">
              📊 Analytics
            </a>
            <a href="/admin"
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 transition font-bold">
              ⚙️ Admin
            </a>
          </div>
        </div>
      </div>

      {/* Page title bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="font-bold text-gray-700 text-sm uppercase tracking-wide">📋 Leads</h1>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-4 space-y-4">

        {/* Filter card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-3 items-end">

            {/* Status */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-orange-400 bg-white">
                <option value="all">— Select Status —</option>
                <option value="initiations">Initiations</option>
                <option value="followups">Follow Ups</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Follow-up date range */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Follow-Up Start Date</label>
              <input type="date" value={filterFollowFrom} onChange={e => setFilterFollowFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Follow-Up End Date</label>
              <input type="date" value={filterFollowTo} onChange={e => setFilterFollowTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            </div>

            {/* Agent */}
            <div className="flex flex-col gap-1 min-w-[180px]">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Agent</label>
              <select value={filterAgent} onChange={e => setFilterAgent(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-orange-400 bg-white">
                <option value="all">— Select Agent —</option>
                {agents.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Search by mobile */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search By Mobile</label>
              <input type="tel" placeholder="Enter mobile…" value={searchMobile}
                onChange={e => setSearchMobile(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400 w-44" />
            </div>

            {/* Clear */}
            {(filterStatus !== 'all' || filterAgent !== 'all' || filterFollowFrom || filterFollowTo || searchMobile) && (
              <button onClick={() => { setFilterStatus('all'); setFilterAgent('all'); setFilterFollowFrom(''); setFilterFollowTo(''); setSearchMobile(''); }}
                className="text-xs text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition mt-auto font-medium">
                ✕ Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table toolbar */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">
                Show
              </span>
              <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-orange-400 bg-white">
                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-sm text-gray-500">entries</span>
              <span className="text-xs text-gray-400 ml-2">({filtered.length} total)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Search:</span>
              <input value={tableSearch} onChange={e => setTableSearch(e.target.value)}
                placeholder="Name, city, product…"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-orange-400 w-44" />
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
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white text-xs font-semibold uppercase tracking-wide">
                    <th className="px-3 py-3 text-left whitespace-nowrap">ID</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Category</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Customer Details</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Creation Date</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Party Date</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Location</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">C Message</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Status</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Follow Up</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Comments</th>
                    <th className="px-3 py-3 text-left whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((lead) => {
                    const isNew = newRowIds.has(lead.row);
                    const st = normStatus(lead.status);
                    const meta = sMeta(st);
                    const mapLink = mapsUrl(lead.venue, lead.city);
                    const saving = savingRow === lead.row;

                    return (
                      <tr key={lead.row}
                        style={{ backgroundColor: isNew ? '#fff3cd' : meta.rowBg, color: meta.rowText }}
                        className="border-b border-white/60 hover:brightness-95 transition-all">

                        {/* ID */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold bg-white/70 px-2 py-0.5 rounded">
                              {leadId(lead.row)}
                            </span>
                            {isNew && <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-3 py-3">
                          {lead.product ? (
                            <span className="text-xs font-bold bg-white/70 px-2 py-1 rounded-lg border border-current/20 whitespace-nowrap">
                              {lead.product.length > 22 ? lead.product.slice(0, 20) + '…' : lead.product}
                            </span>
                          ) : <span className="opacity-40 text-xs">—</span>}
                        </td>

                        {/* Customer Details */}
                        <td className="px-3 py-3 min-w-[140px]">
                          <p className="font-bold text-sm">{lead.name || '—'}</p>
                          <a href={`tel:${lead.phone}`} className="text-xs font-mono opacity-80 hover:opacity-100 underline">{lead.phone}</a>
                        </td>

                        {/* Creation Date */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-xs font-medium opacity-80">{fmtDate(lead.timestamp)}</p>
                        </td>

                        {/* Party Date */}
                        <td className="px-3 py-3 whitespace-nowrap">
                          <p className="text-xs font-medium opacity-80">{lead.date || '—'}</p>
                        </td>

                        {/* Location */}
                        <td className="px-3 py-3">
                          {mapLink ? (
                            <a href={mapLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-semibold underline flex items-center gap-1">
                              📍 {lead.city || lead.venue || 'Map'}
                            </a>
                          ) : (
                            <span className="text-xs opacity-70">{lead.city || '—'}</span>
                          )}
                          {lead.venue && lead.city && (
                            <p className="text-[10px] opacity-60 truncate max-w-[110px] mt-0.5">{lead.venue}</p>
                          )}
                        </td>

                        {/* C Message */}
                        <td className="px-3 py-3 max-w-[180px]">
                          {lead.notes ? (
                            <p className="text-xs opacity-80 line-clamp-3 whitespace-pre-wrap">{lead.notes}</p>
                          ) : <span className="opacity-30 text-xs">—</span>}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3 min-w-[150px]">
                          <select
                            value={st}
                            onChange={e => handleStatusChange(lead, e.target.value)}
                            disabled={saving}
                            className="text-xs font-bold px-2 py-1.5 rounded-lg border-0 outline-none cursor-pointer w-full"
                            style={{ background: meta.badge, color: meta.badgeText }}
                          >
                            <option value="initiations">Initiations</option>
                            <option value="followups">Follow Ups</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {/* Cancel reason badge */}
                          {st === 'cancelled' && (lead as any).cancelReason && (
                            <span className="text-[10px] mt-1 inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                              {(lead as any).cancelReason}
                            </span>
                          )}

                          <div className="text-[10px] mt-1 opacity-70">
                            Assigned To : <span className="font-bold">{lead.assignee || '—'}</span>
                          </div>
                          {(lead as any).passTo && (
                            <div className="text-[10px] opacity-70">
                              Pass To : <span className="font-bold">{(lead as any).passTo}</span>
                            </div>
                          )}
                        </td>

                        {/* Follow Up */}
                        <td className="px-3 py-3 min-w-[130px]">
                          <input type="date" value={lead.followup || ''}
                            onChange={e => updateLead(lead, 'followup', e.target.value)}
                            className="text-xs border-0 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-orange-400 bg-white/70 w-full font-medium" />
                          {lead.source && (
                            <p className="text-[10px] mt-1 opacity-60">Source: <span className="font-semibold">{lead.source}</span></p>
                          )}
                        </td>

                        {/* Comments */}
                        <td className="px-3 py-3 min-w-[160px]">
                          <textarea
                            value={lead.crmNotes || ''}
                            onChange={e => setLeads(prev => prev.map(l => l.row === lead.row ? { ...l, crmNotes: e.target.value } : l))}
                            onBlur={e => updateLead(lead, 'crmNotes', e.target.value)}
                            placeholder="Add comment…"
                            rows={2}
                            className="w-full text-xs border border-black/10 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 resize-none bg-white/60"
                          />
                        </td>

                        {/* Action */}
                        <td className="px-3 py-3 min-w-[150px]">
                          <div className="space-y-1.5">
                            {/* Assign */}
                            <select value={lead.assignee || ''} onChange={e => updateLead(lead, 'assignee', e.target.value)}
                              disabled={saving}
                              className="w-full text-xs border border-black/10 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 bg-white/80 font-medium">
                              <option value="">Assign agent…</option>
                              {agents.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            {/* Pass To */}
                            <select value={(lead as any).passTo || ''} onChange={e => updateLead(lead, 'passTo' as keyof Lead, e.target.value)}
                              disabled={saving}
                              className="w-full text-xs border border-black/10 rounded-lg px-2 py-1.5 outline-none focus:border-orange-400 bg-white/80 font-medium">
                              <option value="">Pass to…</option>
                              {agents.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            {/* WhatsApp */}
                            <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '').slice(-10)}?text=Hi ${lead.name}, this is regarding your decoration enquiry.`}
                              target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 w-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg transition">
                              💬 WhatsApp
                            </a>
                            {/* View */}
                            <button onClick={() => setSelected(lead)}
                              className="w-full text-xs font-semibold border border-black/10 bg-white/70 hover:bg-white py-1.5 rounded-lg transition">
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
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <p className="text-xs text-gray-500">
                Showing 1 to {Math.min(pageSize, filtered.length)} of {filtered.length} entries
              </p>
              {filtered.length > pageSize && (
                <button onClick={() => setPageSize(p => p + 25)}
                  className="text-xs font-bold text-orange-500 border border-orange-200 px-4 py-1.5 rounded-full hover:bg-orange-50 transition">
                  Load more ↓
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <LeadDetail lead={selected} agents={agents}
          saving={savingRow === selected.row}
          onUpdate={(f, v) => updateLead(selected, f, v)}
          onStatusChange={handleStatusChange}
          onClose={() => setSelected(null)} />
      )}

      {/* Cancel reason modal */}
      {cancelTarget && (
        <CancelModal
          onSelect={handleCancelConfirm}
          onClose={() => setCancelTarget(null)} />
      )}
    </div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────
function LeadDetail({ lead, agents, saving, onUpdate, onStatusChange, onClose }: {
  lead: Lead; agents: string[]; saving: boolean;
  onUpdate: (f: keyof Lead, v: string) => void;
  onStatusChange: (lead: Lead, s: string) => void;
  onClose: () => void;
}) {
  const st = (lead.status || 'initiations').toLowerCase().replace(/[^a-z]/g, '');
  const meta = sMeta(st);
  const mapLink = mapsUrl(lead.venue, lead.city);

  return (
    <div className="fixed inset-0 z-[9999] flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative ml-auto w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10"
          style={{ borderColor: meta.badge + '40' }}>
          <div>
            <h2 className="font-bold text-gray-800">Lead #{leadId(lead.row)}</h2>
            <p className="text-xs text-gray-400">{fmtDate(lead.timestamp)}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: meta.badge }}>
            {meta.label}
          </span>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-lg ml-2">✕</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Customer */}
          <div className="rounded-xl p-4 border" style={{ background: meta.rowBg, borderColor: meta.badge + '30' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-60">Customer</p>
            <p className="font-bold text-gray-800 text-lg">{lead.name}</p>
            <a href={`tel:${lead.phone}`} className="font-mono text-sm text-blue-600 hover:underline">{lead.phone}</a>
          </div>

          {/* Event info grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Package', lead.product],
              ['Event Date', lead.date],
              ['Time Slot', lead.timeslot],
              ['Source', lead.source],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{val || '—'}</p>
              </div>
            ))}
          </div>

          {/* Venue */}
          {(lead.venue || lead.city) && (
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Venue</p>
              <p className="text-sm text-gray-700">{[lead.venue, lead.city].filter(Boolean).join(', ')}</p>
              {mapLink && (
                <a href={mapLink} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1">
                  📍 Open in Google Maps
                </a>
              )}
            </div>
          )}

          {/* Notes */}
          {lead.notes && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Customer Message</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
            <select value={st} onChange={e => onStatusChange(lead, e.target.value)} disabled={saving}
              className="w-full text-sm font-bold px-4 py-2.5 rounded-xl border-0 outline-none cursor-pointer text-white"
              style={{ background: meta.badge }}>
              <option value="initiations">Initiations</option>
              <option value="followups">Follow Ups</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {st === 'cancelled' && (lead as any).cancelReason && (
              <p className="text-xs mt-1 text-red-600 font-semibold">Reason: {(lead as any).cancelReason}</p>
            )}
          </div>

          {/* Assign + Pass */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Assigned To</p>
              <select value={lead.assignee || ''} onChange={e => onUpdate('assignee', e.target.value)} disabled={saving}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white">
                <option value="">— Agent —</option>
                {agents.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pass To</p>
              <select value={(lead as any).passTo || ''} onChange={e => onUpdate('passTo' as keyof Lead, e.target.value)} disabled={saving}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white">
                <option value="">— Agent —</option>
                {agents.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Follow-up */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Follow-up Date</p>
            <input type="date" value={lead.followup || ''} onChange={e => onUpdate('followup', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
          </div>

          {/* Internal notes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Internal Comments</p>
            <textarea value={lead.crmNotes || ''} onChange={e => onUpdate('crmNotes', e.target.value)}
              placeholder="Add internal comments…" rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 resize-none" />
          </div>

          {/* WhatsApp */}
          <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '').slice(-10)}?text=Hi ${lead.name}, this is regarding your decoration enquiry.`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-2xl transition text-sm">
            💬 Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Team Settings ─────────────────────────────────────────────────────────────
function TeamSettings({ agents, onSave, onBack }: {
  agents: string[]; onSave: (a: string[]) => void; onBack: () => void;
}) {
  const [list, setList] = useState([...agents]);
  const [newName, setNewName] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-orange-400 font-bold text-xl">‹</button>
        <div>
          <h1 className="font-bold">👥 Team Settings</h1>
          <p className="text-xs text-gray-400">Manage agent names</p>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Current Agents</p>
          {list.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No agents</p>}
          {list.map(name => (
            <div key={name} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
                  {name[0].toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800">{name}</span>
              </div>
              <button onClick={() => setList(l => l.filter(x => x !== name))}
                className="text-red-400 hover:text-red-600 w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 font-bold">✕</button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Add Agent</p>
          <div className="flex gap-2">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newName.trim() && !list.includes(newName.trim())) { setList(l => [...l, newName.trim()]); setNewName(''); } }}
              placeholder="Agent name…"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400" />
            <button onClick={() => { const n = newName.trim(); if (n && !list.includes(n)) { setList(l => [...l, n]); setNewName(''); } }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-sm">Add</button>
          </div>
        </div>
        <button onClick={() => onSave(list)}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3.5 rounded-xl transition text-sm">
          ✅ Save & Back to CRM
        </button>
        <button onClick={onBack} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">Cancel</button>
      </div>
    </div>
  );
}
