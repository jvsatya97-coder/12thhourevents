'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { LEADS_URL, CITIES, SERVICES } from '@/lib/config';

const ADMIN_PIN = '12he2024';

const TEAM = ['Satya', 'Priya', 'Rahul', 'Anjali', 'Unassigned'];

const STATUS_OPTIONS = [
  { value: 'new',       label: 'New',        color: '#3b82f6', bg: '#eff6ff' },
  { value: 'contacted', label: 'Contacted',  color: '#8b5cf6', bg: '#f5f3ff' },
  { value: 'quoted',    label: 'Quoted',     color: '#f59e0b', bg: '#fffbeb' },
  { value: 'confirmed', label: 'Confirmed',  color: '#10b981', bg: '#ecfdf5' },
  { value: 'done',      label: 'Done ✓',     color: '#059669', bg: '#d1fae5' },
  { value: 'lost',      label: 'Lost ✗',     color: '#ef4444', bg: '#fef2f2' },
];

type Lead = {
  row: number;
  timestamp: string;
  name: string;
  phone: string;
  product: string;   // Product/Service
  date: string;      // Event Date
  timeslot: string;  // Time Slot
  venue: string;     // Venue/Area
  city: string;
  notes: string;     // Special Requests
  source: string;
  status: string;
  assignee: string;  // CRM: Assignee (col 12)
  crmNotes: string;  // CRM: internal notes (col 13)
  followup: string;  // CRM: follow-up date (col 14)
};

function statusMeta(s: string) {
  return STATUS_OPTIONS.find(x => x.value === s.toLowerCase()) || STATUS_OPTIONS[0];
}

function getLeadsFromSheet(url: string): Promise<Lead[]> {
  return fetch(`${url}?action=getLeads&callback=_`, { mode: 'no-cors' })
    .then(() => { throw new Error('no-cors'); })
    .catch(() => {
      // Apps Script no-cors — use JSONP approach via script tag
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

export default function LeadsWrapper() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');

  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-xl font-bold mb-2 text-gray-800">Leads CRM</h1>
        <p className="text-sm text-gray-500 mb-6">12th Hour Events Admin</p>
        <input
          type="password" placeholder="Enter PIN"
          value={pin} onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && pin === ADMIN_PIN && setAuthed(true)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest mb-4 focus:outline-none focus:border-orange-400"
        />
        <button onClick={() => pin === ADMIN_PIN && setAuthed(true)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
          Enter →
        </button>
        {pin && pin !== ADMIN_PIN && <p className="text-red-500 text-sm mt-3">Wrong PIN</p>}
      </div>
    </div>
  );

  return <LeadsCRM />;
}

function LeadsCRM() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'followup'>('newest');
  const [savingRow, setSavingRow] = useState<number | null>(null);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [showBooking, setShowBooking] = useState(false);
  const [bookingLead, setBookingLead] = useState<Lead | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getLeadsFromSheet(LEADS_URL);
      setLeads(data);
    } catch {
      setError('Could not load leads. Check Apps Script is deployed with getLeads action.');
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  const updateLead = useCallback(async (lead: Lead, field: keyof Lead, value: string) => {
    setSavingRow(lead.row);
    const updated = leads.map(l => l.row === lead.row ? { ...l, [field]: value } : l);
    setLeads(updated);
    if (selected?.row === lead.row) setSelected({ ...selected, [field]: value });
    await updateLeadInSheet(LEADS_URL, lead.row, field, value);
    setSavingRow(null);
  }, [leads, selected]);

  const filtered = useMemo(() => {
    let list = [...leads];
    if (filterStatus !== 'all') list = list.filter(l => (l.status || 'new') === filterStatus);
    if (filterCity !== 'all') list = list.filter(l => l.city?.toLowerCase() === filterCity);
    if (filterAssignee !== 'all') list = list.filter(l => (l.assignee || 'Unassigned') === filterAssignee);
    if (filterCat !== 'all') list = list.filter(l => {
      const svc = SERVICES.find(s => l.product?.toLowerCase().includes(s.name.toLowerCase().split(' ')[0].toLowerCase()));
      return svc?.cat === filterCat;
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l => l.name?.toLowerCase().includes(q) || l.phone?.includes(q) || l.product?.toLowerCase().includes(q));
    }
    if (sortBy === 'newest') list.sort((a, b) => (b.row || 0) - (a.row || 0));
    if (sortBy === 'oldest') list.sort((a, b) => (a.row || 0) - (b.row || 0));
    if (sortBy === 'followup') list.sort((a, b) => {
      if (!a.followup) return 1;
      if (!b.followup) return -1;
      return a.followup.localeCompare(b.followup);
    });
    return list;
  }, [leads, filterStatus, filterCity, filterAssignee, filterCat, search, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = leads.length;
    const byStatus: Record<string, number> = {};
    STATUS_OPTIONS.forEach(s => { byStatus[s.value] = leads.filter(l => (l.status || 'new') === s.value).length; });
    const confirmed = byStatus['confirmed'] || 0;
    const done = byStatus['done'] || 0;
    const conversion = total ? Math.round((confirmed + done) / total * 100) : 0;
    const followupToday = leads.filter(l => l.followup === new Date().toISOString().slice(0, 10)).length;
    return { total, byStatus, conversion, followupToday };
  }, [leads]);

  const isFollowupDue = (l: Lead) => l.followup && l.followup <= new Date().toISOString().slice(0, 10);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">📊</div>
        <p className="text-gray-500 font-medium">Loading leads...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-orange-500 font-bold text-sm hover:underline">← Products</a>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-extrabold text-gray-800">📊 Leads CRM</h1>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{leads.length} total</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView(v => v === 'table' ? 'kanban' : 'table')}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              {view === 'table' ? '📋 Kanban' : '📃 Table'}
            </button>
            <button onClick={loadLeads}
              className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              🔄 Refresh
            </button>
            <a href="/admin" className="text-sm font-medium px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
              + New Lead
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
            ⚠️ {error}
            <button onClick={loadLeads} className="ml-3 underline font-medium">Retry</button>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 col-span-2 md:col-span-1">
            <p className="text-xs text-gray-500 font-medium">Total Leads</p>
            <p className="text-3xl font-extrabold text-gray-800 mt-0.5">{stats.total}</p>
          </div>
          {STATUS_OPTIONS.slice(0, 4).map(s => (
            <div key={s.value} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 cursor-pointer hover:border-orange-200 transition-colors"
              onClick={() => setFilterStatus(filterStatus === s.value ? 'all' : s.value)}>
              <p className="text-xs font-medium" style={{ color: s.color }}>{s.label}</p>
              <p className="text-2xl font-extrabold text-gray-800 mt-0.5">{stats.byStatus[s.value] || 0}</p>
            </div>
          ))}
        </div>

        {/* Conversion + Follow-up banners */}
        <div className="grid md:grid-cols-2 gap-3 mb-5">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 font-medium">Conversion Rate</p>
              <p className="text-3xl font-extrabold">{stats.conversion}%</p>
              <p className="text-xs opacity-70 mt-0.5">Confirmed + Done ÷ Total</p>
            </div>
            <div className="text-5xl opacity-30">📈</div>
          </div>
          <div className={`rounded-xl p-4 flex items-center justify-between ${stats.followupToday > 0 ? 'bg-red-50 border-2 border-red-200' : 'bg-white border border-gray-100'}`}>
            <div>
              <p className="text-xs text-gray-500 font-medium">Follow-ups Due Today</p>
              <p className={`text-3xl font-extrabold ${stats.followupToday > 0 ? 'text-red-600' : 'text-gray-800'}`}>{stats.followupToday}</p>
              <button onClick={() => setSortBy('followup')} className="text-xs text-orange-600 font-medium mt-0.5 underline">Sort by follow-up →</button>
            </div>
            <div className="text-5xl opacity-20">🔔</div>
          </div>
        </div>

        {/* Filters row */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-2 items-center">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search name, phone, product..."
            className="flex-1 min-w-48 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400" />

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-orange-400 bg-white">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-orange-400 bg-white">
            <option value="all">All Cities</option>
            {CITIES.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>

          <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-orange-400 bg-white">
            <option value="all">All Team</option>
            {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:border-orange-400 bg-white">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="followup">Follow-up Date</option>
          </select>

          <span className="text-xs text-gray-400 ml-auto">{filtered.length} leads</span>
        </div>

        {/* Table / Kanban */}
        {view === 'kanban' ? (
          <KanbanView leads={filtered} onUpdate={updateLead} onSelect={setSelected} savingRow={savingRow} />
        ) : (
          <LeadsTable leads={filtered} onUpdate={updateLead} onSelect={setSelected} savingRow={savingRow} isFollowupDue={isFollowupDue} />
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <LeadDrawer lead={selected} onClose={() => setSelected(null)}
          onUpdate={(field, value) => updateLead(selected, field, value)}
          onBook={() => { setBookingLead(selected); setShowBooking(true); }}
          savingRow={savingRow} />
      )}

      {/* Booking modal from lead */}
      {showBooking && bookingLead && (
        <AdminBookingModal lead={bookingLead} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}

function LeadsTable({ leads, onUpdate, onSelect, savingRow, isFollowupDue }: {
  leads: Lead[];
  onUpdate: (l: Lead, field: keyof Lead, value: string) => void;
  onSelect: (l: Lead) => void;
  savingRow: number | null;
  isFollowupDue: (l: Lead) => boolean | string;
}) {
  if (!leads.length) return (
    <div className="bg-white rounded-xl p-10 text-center text-gray-400 border border-gray-100">
      <div className="text-4xl mb-3">📭</div>
      <p className="font-medium">No leads match your filters</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">#</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Customer</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Package</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">City</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Event Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Assigned To</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Follow-up</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => {
              const sm = statusMeta(lead.status || 'new');
              const due = isFollowupDue(lead);
              return (
                <tr key={lead.row} className={`border-b border-gray-50 hover:bg-orange-50/40 transition-colors cursor-pointer ${due ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 text-gray-400 text-xs" onClick={() => onSelect(lead)}>{leads.length - i}</td>
                  <td className="px-4 py-3" onClick={() => onSelect(lead)}>
                    <p className="font-semibold text-gray-800">{lead.name || '—'}</p>
                    <p className="text-xs text-gray-500">{lead.phone}</p>
                    <p className="text-xs text-gray-400">{lead.timestamp}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[180px]" onClick={() => onSelect(lead)}>
                    <p className="font-medium text-gray-800 text-xs line-clamp-2">{lead.product || '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{lead.city}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 capitalize" onClick={() => onSelect(lead)}>{lead.city || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap" onClick={() => onSelect(lead)}>{lead.date || '—'}</td>
                  <td className="px-4 py-3">
                    <select value={lead.status || 'new'}
                      onChange={e => { e.stopPropagation(); onUpdate(lead, 'status', e.target.value); }}
                      disabled={savingRow === lead.row}
                      className="text-xs font-semibold rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none"
                      style={{ color: sm.color, background: sm.bg }}>
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={lead.assignee || 'Unassigned'}
                      onChange={e => { e.stopPropagation(); onUpdate(lead, 'assignee', e.target.value); }}
                      disabled={savingRow === lead.row}
                      className="text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400">
                      {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="date" value={lead.followup || ''}
                      onChange={e => { e.stopPropagation(); onUpdate(lead, 'followup', e.target.value); }}
                      className={`text-xs border rounded-lg px-2 py-1 focus:outline-none focus:border-orange-400 ${due ? 'border-red-300 bg-red-50 text-red-700 font-semibold' : 'border-gray-200'}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-nowrap">
                      <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors" title="Call">📞</a>
                      <a href={`https://wa.me/91${lead.phone?.replace(/\D/g,'')}?text=Hi ${lead.name}, following up on your ${lead.product} enquiry.`}
                        target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors" title="WhatsApp">💬</a>
                      <button onClick={e => { e.stopPropagation(); onSelect(lead); }}
                        className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors" title="View details">👁</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanView({ leads, onUpdate, onSelect, savingRow }: {
  leads: Lead[];
  onUpdate: (l: Lead, field: keyof Lead, value: string) => void;
  onSelect: (l: Lead) => void;
  savingRow: number | null;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4" style={{ scrollSnapType: 'x mandatory' }}>
      {STATUS_OPTIONS.map(col => {
        const colLeads = leads.filter(l => (l.status || 'new') === col.value);
        return (
          <div key={col.value} className="flex-shrink-0 w-64 md:w-72" style={{ scrollSnapAlign: 'start' }}>
            <div className="rounded-t-xl px-3 py-2.5 font-bold text-sm flex items-center justify-between"
              style={{ background: col.bg, color: col.color }}>
              <span>{col.label}</span>
              <span className="font-black text-lg">{colLeads.length}</span>
            </div>
            <div className="bg-gray-100 rounded-b-xl min-h-32 p-2 space-y-2 max-h-[70vh] overflow-y-auto">
              {colLeads.map(lead => (
                <div key={lead.row} onClick={() => onSelect(lead)}
                  className="bg-white rounded-xl p-3 shadow-sm cursor-pointer hover:shadow-md hover:border-orange-200 border border-transparent transition-all">
                  <p className="font-semibold text-gray-800 text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.phone}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{lead.product}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400 capitalize">{lead.city}</span>
                    <select value={lead.assignee || 'Unassigned'}
                      onChange={e => { e.stopPropagation(); onUpdate(lead, 'assignee', e.target.value); }}
                      onClick={e => e.stopPropagation()}
                      className="text-xs text-gray-500 bg-gray-50 border-0 rounded focus:outline-none">
                      {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {lead.followup && (
                    <div className={`mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-block ${lead.followup <= new Date().toISOString().slice(0,10) ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      🔔 {lead.followup}
                    </div>
                  )}
                  <div className="flex gap-1.5 mt-2">
                    <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()}
                      className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100">📞 Call</a>
                    <a href={`https://wa.me/91${lead.phone?.replace(/\D/g,'')}?text=Hi ${lead.name}, following up on your ${lead.product} enquiry.`}
                      target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                      className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 font-medium hover:bg-green-100">💬 WA</a>
                  </div>
                </div>
              ))}
              {!colLeads.length && <p className="text-xs text-gray-400 text-center py-6">Empty</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LeadDrawer({ lead, onClose, onUpdate, onBook, savingRow }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (field: keyof Lead, value: string) => void;
  onBook: () => void;
  savingRow: number | null;
}) {
  const [crmNotes, setCrmNotes] = useState(lead.crmNotes || '');
  const sm = statusMeta(lead.status || 'New');
  const saving = savingRow === lead.row;

  const saveCrmNotes = () => { if (crmNotes !== lead.crmNotes) onUpdate('crmNotes', crmNotes); };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-extrabold text-gray-800 text-lg">Lead Detail</h2>
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-orange-500 animate-pulse font-medium">Saving…</span>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Customer info */}
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">{lead.name || '—'}</h3>
                <a href={`tel:${lead.phone}`} className="text-orange-600 font-bold text-lg hover:underline">{lead.phone}</a>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${lead.phone}`}
                  className="p-2.5 rounded-xl bg-blue-500 text-white text-lg hover:bg-blue-600 transition-colors shadow-sm" title="Call">📞</a>
                <a href={`https://wa.me/91${lead.phone?.replace(/\D/g,'')}?text=Hi ${lead.name}, this is 12th Hour Events. Following up on your enquiry for "${lead.product}". When would be a good time to discuss?`}
                  target="_blank" rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-white text-lg hover:opacity-90 transition-colors shadow-sm" style={{ background: '#25d366' }} title="WhatsApp">💬</a>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Lead received: {lead.timestamp}</p>
          </div>

          {/* Package */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
            <p className="text-xs text-gray-500 font-medium mb-1">Package Enquiry</p>
            <p className="font-bold text-gray-800">{lead.product || '—'}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
              {lead.city && <span className="capitalize">📍 {lead.city}</span>}
              {lead.date && <span>📅 {lead.date}</span>}
              {lead.timeslot && <span>🕐 {lead.timeslot}</span>}
            </div>
            {lead.venue && <p className="text-sm text-gray-500">🏠 {lead.venue}</p>}
            {lead.notes && (
              <div className="mt-2 bg-yellow-50 rounded-lg p-2.5 border border-yellow-200">
                <p className="text-xs text-yellow-700 font-semibold mb-0.5">Special Requests</p>
                <p className="text-sm text-gray-700">{lead.notes}</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Status</p>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(s => (
                <button key={s.value} onClick={() => onUpdate('status', s.value)}
                  className="text-xs font-bold py-2 px-3 rounded-xl border-2 transition-all"
                  style={{
                    color: (lead.status || 'new') === s.value ? 'white' : s.color,
                    background: (lead.status || 'new') === s.value ? s.color : s.bg,
                    borderColor: s.color,
                  }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assign + Follow-up */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Assign To</p>
              <select value={lead.assignee || 'Unassigned'} onChange={e => onUpdate('assignee', e.target.value)}
                className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400 bg-white font-semibold text-gray-700">
                {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1.5">Follow-up Date</p>
              <input type="date" value={lead.followup || ''} onChange={e => onUpdate('followup', e.target.value)}
                className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400" />
            </div>
          </div>

          {/* CRM Notes */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1.5">Internal CRM Notes</p>
            <textarea value={crmNotes} onChange={e => setCrmNotes(e.target.value)} onBlur={saveCrmNotes} rows={4}
              placeholder="Add internal notes (not visible to customer)..."
              className="w-full text-sm border-2 border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400 resize-none" />
            <button onClick={saveCrmNotes} className="mt-1.5 text-xs text-orange-600 font-semibold hover:underline">Save notes</button>
          </div>

          {/* Quick WhatsApp templates */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Quick WhatsApp Messages</p>
            <div className="space-y-2">
              {[
                { label: '👋 Follow-up',    msg: `Hi ${lead.name}! This is 12th Hour Events. We got your enquiry for "${lead.product}". Would love to help plan your event! When's a good time to talk?` },
                { label: '💰 Send Quote',   msg: `Hi ${lead.name}! Your quote for "${lead.product}" in ${lead.city} is ready. This includes professional setup & decor. Book now to confirm your date! 🎉` },
                { label: '✅ Confirm Booking', msg: `Hi ${lead.name}! Great news — your booking for "${lead.product}" on ${lead.date || 'your selected date'} is confirmed! 🎊 We'll be in touch with setup details soon.` },
                { label: '🔔 Reminder',     msg: `Hi ${lead.name}! Reminder: your event is coming up on ${lead.date || 'soon'}. We're all set for "${lead.product}" — excited to make it special! 🎈` },
              ].map(t => (
                <a key={t.label}
                  href={`https://wa.me/91${lead.phone?.replace(/\D/g,'')}?text=${encodeURIComponent(t.msg)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2.5 rounded-xl transition-colors border border-green-200">
                  {t.label}
                </a>
              ))}
            </div>
          </div>

          {/* Book from admin */}
          <button onClick={onBook}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm">
            📋 Create Booking for this Lead
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminBookingModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [form, setForm] = useState({
    name: lead.name || '',
    phone: lead.phone || '',
    date: lead.date || '',
    city: lead.city || '',
    product: lead.product || '',
    timeslot: lead.timeslot || '',
    venue: lead.venue || '',
    notes: lead.notes || '',
    assignee: lead.assignee || 'Unassigned',
    advancePaid: '',
    totalAmount: '',
  });
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Submit as confirmed booking
    const params = new URLSearchParams({
      action: 'addBooking',
      ...form,
      status: 'confirmed',
      leadRow: String(lead.row),
    });
    // Send to sheet
    try {
      await fetch(`${LEADS_URL}?${params}&callback=_`, { mode: 'no-cors' });
    } catch {}
    // Also send WhatsApp confirmation
    const msg = `✅ BOOKING CONFIRMED\n\n*Customer:* ${form.name}\n*Phone:* ${form.phone}\n*Package:* ${form.product}\n*City:* ${form.city}\n*Date:* ${form.date || 'TBD'}\n*Time Slot:* ${form.timeslot || '—'}\n*Venue:* ${form.venue || '—'}\n*Total Amount:* ₹${form.totalAmount}\n*Advance Paid:* ₹${form.advancePaid || '0'}\n*Balance:* ₹${balance}\n*Assigned To:* ${form.assignee}\n*Special Requests:* ${form.notes || '—'}`;
    window.open(`https://wa.me/91${form.phone?.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
    setDone(true);
  };

  if (done) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-5">WhatsApp confirmation sent to customer.</p>
        <button onClick={onClose} className="btn-pink w-full justify-center">Done</button>
      </div>
    </div>
  );

  const f = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const balance = (Number(form.totalAmount) - Number(form.advancePaid || 0)) || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">📋 Create Booking</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Customer Name *</label>
              <input required value={form.name} onChange={e => f('name', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Phone *</label>
              <input required value={form.phone} onChange={e => f('phone', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Package</label>
            <input value={form.product} onChange={e => f('product', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Event Date</label>
              <input type="date" value={form.date} onChange={e => f('date', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">City</label>
              <input value={form.city} onChange={e => f('city', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Total (₹)</label>
              <input type="number" value={form.totalAmount} onChange={e => f('totalAmount', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Advance Paid (₹)</label>
              <input type="number" value={form.advancePaid} onChange={e => f('advancePaid', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Balance</label>
              <div className="border-2 border-gray-100 bg-gray-50 rounded-xl px-3 py-2.5 text-sm font-bold text-orange-600">
                ₹{balance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Assign To</label>
            <select value={form.assignee} onChange={e => f('assignee', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
              {TEAM.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Internal Notes</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={3}
              placeholder="Special requests, venue details, customer notes..."
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          </div>
          <button type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all">
            🎉 Confirm Booking + Send WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
