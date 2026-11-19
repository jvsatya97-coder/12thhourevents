'use client';
import { useState, useEffect, useMemo } from 'react';
import { LEADS_URL } from '@/lib/config';

const ADMIN_PIN = '12he2024';

// Strip timezone suffix
function cleanTs(ts: string) {
  if (!ts) return ts;
  return ts.replace(/\s*GMT[+-]\d{4}\s*\([^)]*\)/g, '').trim();
}

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

type DayStats = {
  date: string;             // YYYY-MM-DD
  display: string;          // "19 Nov"
  leads: number;
  completed: number;
  cancelled: number;
  whatsapp: number;
  google: number;
  direct: number;
  social: number;
  noService: number;
  duplicate: number;
  priceIssue: number;
};

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

function categorizeSource(source: string): keyof Omit<DayStats, 'date' | 'display' | 'leads' | 'completed' | 'cancelled'> {
  const s = (source || '').toLowerCase();
  if (s.includes('whatsapp') || s === 'enquiry') return 'whatsapp';
  if (s.includes('google') || s.includes('search') || s.includes('cpc')) return 'google';
  if (s.includes('social') || s.includes('instagram') || s.includes('facebook') || s.includes('meta')) return 'social';
  if (s.includes('direct') || s === 'website') return 'direct';
  return 'direct';
}

function categorizeStatus(status: string): 'completed' | 'cancelled' | 'noService' | 'duplicate' | 'priceIssue' | 'other' {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'done') return 'completed';
  if (s === 'lost' || s === 'cancelled') return 'cancelled';
  if (s.includes('no service') || s.includes('no_service')) return 'noService';
  if (s.includes('dup')) return 'duplicate';
  if (s.includes('price')) return 'priceIssue';
  return 'other';
}

function fmt(n: number) {
  return n.toLocaleString('en-IN');
}

export default function AnalyticsWrapper() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  if (!authed) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <div className="text-5xl mb-4">📊</div>
        <h1 className="text-xl font-bold mb-1 text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-500 mb-6">12th Hour Events Admin</p>
        <input
          type="password" placeholder="Enter PIN"
          value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }}
          onKeyDown={e => { if (e.key === 'Enter') { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); } }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-widest mb-4 focus:outline-none focus:border-orange-400"
        />
        {pinError && <p className="text-red-500 text-sm mb-3">Wrong PIN</p>}
        <button onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition">
          Enter →
        </button>
      </div>
    </div>
  );

  return <AnalyticsDashboard />;
}

function AnalyticsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const YEARS = [2025, 2026, 2027];

  useEffect(() => {
    setLoading(true);
    getLeadsFromSheet(LEADS_URL)
      .then(data => { setLeads(data); setLoading(false); })
      .catch(() => { setError('Failed to load leads.'); setLoading(false); });
  }, []);

  // Build daily stats for selected month/year
  const dailyStats = useMemo<DayStats[]>(() => {
    const filtered = leads.filter(l => {
      const ts = cleanTs(l.timestamp || '');
      if (!ts) return false;
      const d = new Date(ts);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    // Group by date
    const byDate: Record<string, Lead[]> = {};
    filtered.forEach(l => {
      const ts = cleanTs(l.timestamp || '');
      if (!ts) return;
      const d = new Date(ts);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(l);
    });

    return Object.entries(byDate)
      .sort((a, b) => b[0].localeCompare(a[0])) // newest first
      .map(([date, dayLeads]) => {
        const d = new Date(date);
        const display = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const stats: DayStats = {
          date, display,
          leads: dayLeads.length,
          completed: 0, cancelled: 0,
          whatsapp: 0, google: 0, direct: 0, social: 0,
          noService: 0, duplicate: 0, priceIssue: 0,
        };
        dayLeads.forEach(l => {
          const sc = categorizeStatus(l.status);
          if (sc === 'completed') stats.completed++;
          else if (sc === 'cancelled') stats.cancelled++;
          else if (sc === 'noService') stats.noService++;
          else if (sc === 'duplicate') stats.duplicate++;
          else if (sc === 'priceIssue') stats.priceIssue++;

          const src = categorizeSource(l.source);
          stats[src]++;
        });
        return stats;
      });
  }, [leads, year, month]);

  // Filter rows by search
  const filtered = useMemo(() => {
    if (!search.trim()) return dailyStats;
    const q = search.toLowerCase();
    return dailyStats.filter(r => r.date.includes(q) || r.display.toLowerCase().includes(q));
  }, [dailyStats, search]);

  const paged = filtered.slice(0, pageSize);

  // Totals row
  const totals = useMemo(() => filtered.reduce((acc, r) => ({
    leads: acc.leads + r.leads,
    completed: acc.completed + r.completed,
    cancelled: acc.cancelled + r.cancelled,
    whatsapp: acc.whatsapp + r.whatsapp,
    google: acc.google + r.google,
    direct: acc.direct + r.direct,
    social: acc.social + r.social,
    noService: acc.noService + r.noService,
    duplicate: acc.duplicate + r.duplicate,
    priceIssue: acc.priceIssue + r.priceIssue,
  }), { leads: 0, completed: 0, cancelled: 0, whatsapp: 0, google: 0, direct: 0, social: 0, noService: 0, duplicate: 0, priceIssue: 0 }), [filtered]);

  // Top-line KPIs
  const convRate = totals.leads > 0 ? ((totals.completed / totals.leads) * 100).toFixed(1) : '0.0';
  const cancelRate = totals.leads > 0 ? ((totals.cancelled / totals.leads) * 100).toFixed(1) : '0.0';
  const googleShare = totals.leads > 0 ? ((totals.google / totals.leads) * 100).toFixed(0) : '0';
  const topDay = dailyStats.length > 0 ? dailyStats.reduce((a, b) => a.leads > b.leads ? a : b) : null;

  const cols = [
    { key: 'date', label: 'Date' },
    { key: 'leads', label: 'Leads', color: 'text-gray-800' },
    { key: 'completed', label: 'Completed', color: 'text-green-600' },
    { key: 'cancelled', label: 'Cancelled', color: 'text-red-500' },
    { key: 'whatsapp', label: 'WhatsApp Lead', color: 'text-emerald-600' },
    { key: 'google', label: 'Google Lead', color: 'text-blue-600' },
    { key: 'direct', label: 'Direct Lead', color: 'text-orange-500' },
    { key: 'social', label: 'Social Lead', color: 'text-pink-500' },
    { key: 'noService', label: 'No Service', color: 'text-gray-400' },
    { key: 'duplicate', label: 'Duplicate', color: 'text-gray-400' },
    { key: 'priceIssue', label: 'Price Issue', color: 'text-amber-600' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin/leads" className="text-gray-400 hover:text-gray-600 text-lg font-bold">‹</a>
          <div>
            <h1 className="font-bold text-gray-800">📊 Analytics</h1>
            <p className="text-xs text-gray-400">Daily Sales Report</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/leads" className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">📋 Leads CRM</a>
          <a href="/admin" className="text-xs font-bold px-3 py-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">⚙️ Admin</a>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-5 space-y-5">

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500">Year</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400 bg-white">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500">Month</label>
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-400 bg-white">
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-400">Show</span>
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
              className="border border-gray-200 rounded-xl px-2 py-2 text-sm outline-none focus:border-orange-400 bg-white">
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-xs text-gray-400">entries</span>
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search date…"
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 w-32"
          />
        </div>

        {/* KPI tiles */}
        {!loading && dailyStats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Total Leads</p>
              <p className="text-3xl font-extrabold text-gray-800">{fmt(totals.leads)}</p>
              <p className="text-xs text-gray-400 mt-1">{MONTHS[month-1]} {year}</p>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 shadow-sm border border-green-100">
              <p className="text-xs text-gray-500 mb-1">Conversion Rate</p>
              <p className="text-3xl font-extrabold text-green-600">{convRate}%</p>
              <p className="text-xs text-green-500 mt-1">{fmt(totals.completed)} completed</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-4 shadow-sm border border-red-100">
              <p className="text-xs text-gray-500 mb-1">Cancellation Rate</p>
              <p className="text-3xl font-extrabold text-red-500">{cancelRate}%</p>
              <p className="text-xs text-red-400 mt-1">{fmt(totals.cancelled)} cancelled</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100">
              <p className="text-xs text-gray-500 mb-1">Google Lead Share</p>
              <p className="text-3xl font-extrabold text-blue-600">{googleShare}%</p>
              <p className="text-xs text-blue-400 mt-1">{fmt(totals.google)} from Google</p>
            </div>
            {topDay && (
              <div className="bg-orange-50 rounded-2xl p-4 shadow-sm border border-orange-100 col-span-2 md:col-span-1">
                <p className="text-xs text-gray-500 mb-1">🏆 Best Day</p>
                <p className="text-2xl font-extrabold text-orange-600">{topDay.display}</p>
                <p className="text-xs text-orange-400 mt-1">{fmt(topDay.leads)} leads</p>
              </div>
            )}
            {/* Source breakdown summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm col-span-2 md:col-span-3">
              <p className="text-xs text-gray-500 mb-2 font-semibold">Lead Sources</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '💬 WhatsApp', val: totals.whatsapp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: '🔍 Google',   val: totals.google,   color: 'text-blue-600',   bg: 'bg-blue-50' },
                  { label: '🌐 Direct',   val: totals.direct,   color: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: '📱 Social',   val: totals.social,   color: 'text-pink-500',   bg: 'bg-pink-50' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl px-3 py-2 flex items-center gap-2`}>
                    <span className={`text-sm font-bold ${s.color}`}>{s.val}</span>
                    <span className="text-xs text-gray-500">{s.label}</span>
                    <span className={`text-xs font-semibold ${s.color}`}>
                      {totals.leads > 0 ? `${Math.round(s.val / totals.leads * 100)}%` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700">Daily Sales — {MONTHS[month-1]} {year}</h2>
            {!loading && <span className="text-xs text-gray-400">Showing {paged.length} of {filtered.length} entries</span>}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Loading leads data…</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p className="text-4xl mb-3">⚠️</p>
              <p className="font-semibold">{error}</p>
            </div>
          ) : dailyStats.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-semibold">No leads found for {MONTHS[month-1]} {year}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {cols.map(c => (
                      <th key={c.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paged.map((row, i) => (
                    <tr key={row.date} className={i % 2 === 0 ? 'bg-white hover:bg-orange-50/40' : 'bg-gray-50/50 hover:bg-orange-50/40'}>
                      <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 font-bold text-gray-800">{row.leads}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">{row.completed}</td>
                      <td className="px-4 py-3 font-semibold text-red-500">{row.cancelled}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">{row.whatsapp}</td>
                      <td className="px-4 py-3 font-semibold text-blue-600">{row.google}</td>
                      <td className="px-4 py-3 font-semibold text-orange-500">{row.direct}</td>
                      <td className="px-4 py-3 font-semibold text-pink-500">{row.social}</td>
                      <td className="px-4 py-3 text-gray-400">{row.noService}</td>
                      <td className="px-4 py-3 text-gray-400">{row.duplicate}</td>
                      <td className="px-4 py-3 font-semibold text-amber-600">{row.priceIssue}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals row */}
                <tfoot>
                  <tr className="bg-gray-800 text-white">
                    <td className="px-4 py-3 font-bold text-sm">Total</td>
                    <td className="px-4 py-3 font-bold">{fmt(totals.leads)}</td>
                    <td className="px-4 py-3 font-bold text-green-300">{fmt(totals.completed)}</td>
                    <td className="px-4 py-3 font-bold text-red-300">{fmt(totals.cancelled)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-300">{fmt(totals.whatsapp)}</td>
                    <td className="px-4 py-3 font-bold text-blue-300">{fmt(totals.google)}</td>
                    <td className="px-4 py-3 font-bold text-orange-300">{fmt(totals.direct)}</td>
                    <td className="px-4 py-3 font-bold text-pink-300">{fmt(totals.social)}</td>
                    <td className="px-4 py-3 font-bold text-gray-300">{fmt(totals.noService)}</td>
                    <td className="px-4 py-3 font-bold text-gray-300">{fmt(totals.duplicate)}</td>
                    <td className="px-4 py-3 font-bold text-amber-300">{fmt(totals.priceIssue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {!loading && filtered.length > pageSize && (
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">Showing {pageSize} of {filtered.length} days</p>
              <button onClick={() => setPageSize(p => p + 25)}
                className="mt-2 text-xs font-semibold text-orange-500 hover:text-orange-600 border border-orange-200 px-4 py-1.5 rounded-full hover:bg-orange-50 transition">
                Load more ↓
              </button>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 text-center">
              Showing {Math.min(paged.length, filtered.length)} to {Math.min(pageSize, filtered.length)} of {filtered.length} entries
            </div>
          )}
        </div>

        {/* UTM Tracking notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm font-bold text-blue-700 mb-1">📡 Google Ads Tracking</p>
          <p className="text-xs text-blue-600 mb-2">
            To track which leads come from Google Ads, add UTM parameters to your ad landing page URLs:
          </p>
          <code className="block bg-white border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-800 font-mono break-all">
            https://12thhourevents.in/birthday-decoration?utm_source=google&utm_medium=cpc&utm_campaign=bangalore
          </code>
          <p className="text-xs text-blue-500 mt-2">
            Currently leads are categorized by their <strong>source field</strong> from the booking form. For exact Google Ads attribution, UTM capture needs to be added to the form.
          </p>
        </div>
      </div>
    </div>
  );
}
