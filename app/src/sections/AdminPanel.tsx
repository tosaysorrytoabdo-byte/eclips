import { useState, useEffect } from 'react';
import { X, Save, ChevronDown } from 'lucide-react';
import { useData, type Top10Entry } from '@/hooks/useData';

const BOT_URL = 'https://bot-production-a81c.up.railway.app';

interface DiscordMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface Props { onClose: () => void; }

function MemberSelect({ value, onChange, members }: {
  value: string;
  onChange: (v: string) => void;
  members: DiscordMember[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = members.filter(m =>
    m.displayName.toLowerCase().includes(search.toLowerCase()) ||
    m.username.toLowerCase().includes(search.toLowerCase())
  );

  const selected = members.find(m => m.displayName === value);

  return (
    <div className="relative">
      <div
        className="input-field flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <>
            <img src={selected.avatar} className="w-5 h-5 rounded-full" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
            <span className="flex-1 text-sm truncate">{selected.displayName}</span>
          </>
        ) : (
          <span className="flex-1 text-sm" style={{ color: '#4a4060' }}>{value || 'اختر عضو...'}</span>
        )}
        <ChevronDown size={12} style={{ color: '#7c6f9a', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }} />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border overflow-hidden" style={{ background: '#06030f', borderColor: 'rgba(147,51,234,.3)', maxHeight: '200px' }}>
          <input
            className="w-full px-3 py-2 text-xs border-b outline-none"
            style={{ background: '#0a0618', borderColor: 'rgba(147,51,234,.2)', color: '#f0ebff' }}
            placeholder="ابحث..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
            autoFocus
          />
          <div className="overflow-y-auto" style={{ maxHeight: '150px' }}>
            <div
              className="px-3 py-2 text-xs cursor-pointer hover:bg-purple-900/20"
              style={{ color: '#7c6f9a' }}
              onClick={() => { onChange('—'); setOpen(false); setSearch(''); }}
            >
              — فارغ
            </div>
            {filtered.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-purple-900/20"
                onClick={() => { onChange(m.displayName); setOpen(false); setSearch(''); }}
              >
                <img src={m.avatar} className="w-5 h-5 rounded-full flex-shrink-0" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
                <span className="text-xs truncate">{m.displayName}</span>
                <span className="text-xs ml-auto" style={{ color: '#4a4060' }}>@{m.username}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-xs" style={{ color: '#4a4060' }}>لا نتائج</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel({ onClose }: Props) {
  const { data, updateClanName, updateTop10 } = useData();
  const [tab, setTab] = useState(0);
  const [cname, setCname] = useState(data.clanName);
  const [top10, setTop10] = useState<Top10Entry[]>(data.top10.map(t => ({ ...t })));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [discordMembers, setDiscordMembers] = useState<DiscordMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    fetch(`${BOT_URL}/members`)
      .then(r => r.json())
      .then(data => { setDiscordMembers(data); setLoadingMembers(false); })
      .catch(() => setLoadingMembers(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await updateClanName(cname);
    await updateTop10(top10);
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: 'rgba(3,1,10,.97)' }}>
      <div className="w-full max-w-3xl my-auto rounded-2xl overflow-hidden border" style={{ background: '#06030f', borderColor: 'rgba(147,51,234,.35)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ background: '#0a0618', borderColor: 'rgba(147,51,234,.2)' }}>
          <div className="font-orbitron font-black tracking-widest" style={{ color: '#c084fc' }}>ADMIN PANEL</div>
          <button onClick={onClose} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all" style={{ background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,.25)' }}>
            <X size={12} /> إغلاق
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ background: '#03010a', borderColor: 'rgba(147,51,234,.15)' }}>
          {['⚙ الإعدادات', '🏆 Top 10'].map((t, i) => (
            <button key={i} onClick={() => setTab(i)}
              className="flex-1 py-3 text-xs tracking-widest uppercase transition-all font-bold"
              style={{
                color: tab === i ? '#c084fc' : '#7c6f9a',
                borderBottom: tab === i ? '2px solid #9333ea' : '2px solid transparent',
                fontFamily: 'Cairo,sans-serif'
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* TAB 0: Settings */}
          {tab === 0 && (
            <div>
              <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c084fc' }}>اسم الكلان</div>
              <input className="input-field" value={cname} onChange={e => setCname(e.target.value)} placeholder="Eclipse Jujutsu Academy" />
            </div>
          )}

          {/* TAB 1: Top 10 */}
          {tab === 1 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs tracking-widest uppercase" style={{ color: '#c084fc' }}>Top 10 — اختر العضو والجائزة</div>
                {loadingMembers && <span className="text-xs animate-pulse" style={{ color: '#7c6f9a' }}>جاري تحميل الأعضاء...</span>}
              </div>
              <div className="flex flex-col gap-2">
                {top10.map((p, i) => (
                  <div key={i} className="grid items-center gap-2" style={{ gridTemplateColumns: '28px 1fr 1fr' }}>
                    <span className="font-orbitron text-xs text-center" style={{ color: '#4a4060' }}>{i + 1}</span>
                    <MemberSelect
                      value={p.name}
                      onChange={v => { const t = [...top10]; t[i] = { ...t[i], name: v }; setTop10(t); }}
                      members={discordMembers}
                    />
                    <input
                      className="input-field text-sm py-2"
                      value={p.prize}
                      onChange={e => { const t = [...top10]; t[i] = { ...t[i], prize: e.target.value }; setTop10(t); }}
                      placeholder="الجائزة"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <button onClick={save} disabled={saving} className="btn-primary w-full justify-center mt-6">
            <Save size={14} />
            {saving ? 'جاري الحفظ...' : saved ? '✦ تم الحفظ!' : '💾 حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  );
}
