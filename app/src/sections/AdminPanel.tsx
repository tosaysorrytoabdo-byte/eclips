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
    <div style={{ position: 'relative' }}>
      <div
        className="input-field flex items-center gap-2 cursor-pointer select-none"
        onMouseDown={e => { e.preventDefault(); setOpen(o => !o); }}
      >
        {selected ? (
          <>
            <img src={selected.avatar} className="w-5 h-5 rounded-full flex-shrink-0" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
            <span className="flex-1 text-sm truncate">{selected.displayName}</span>
          </>
        ) : (
          <span className="flex-1 text-sm" style={{ color: '#4a4060' }}>{value || 'اختر عضو...'}</span>
        )}
        <ChevronDown size={12} style={{ color: '#7c6f9a', flexShrink: 0 }} />
      </div>

      {open && (
        <>
          {/* overlay to close */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 998 }} onMouseDown={() => { setOpen(false); setSearch(''); }} />
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 999,
            background: '#06030f',
            border: '1px solid rgba(147,51,234,.4)',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,.9)',
            marginTop: '4px',
          }}>
            <input
              className="w-full px-3 py-2 text-xs outline-none"
              style={{ background: '#0a0618', borderBottom: '1px solid rgba(147,51,234,.2)', color: '#f0ebff', display: 'block' }}
              placeholder="ابحث..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              <div
                className="px-3 py-2 text-xs cursor-pointer"
                style={{ color: '#7c6f9a' }}
                onMouseDown={() => { onChange('—'); setOpen(false); setSearch(''); }}
              >— فارغ</div>
              {filtered.map(m => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  style={{ borderTop: '1px solid rgba(147,51,234,.08)' }}
                  onMouseDown={() => { onChange(m.displayName); setOpen(false); setSearch(''); }}
                >
                  <img src={m.avatar} className="w-5 h-5 rounded-full flex-shrink-0" alt="" onError={e => (e.currentTarget.style.display = 'none')} />
                  <span className="text-xs truncate">{m.displayName}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-3 text-xs text-center" style={{ color: '#4a4060' }}>لا نتائج</div>
              )}
            </div>
          </div>
        </>
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
      .then(d => { setDiscordMembers(d); setLoadingMembers(false); })
      .catch(() => setLoadingMembers(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await updateClanName(cname);
      await updateTop10(top10);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(3,1,10,.97)', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '768px', margin: 'auto', borderRadius: '16px', border: '1px solid rgba(147,51,234,.35)', background: '#06030f' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(147,51,234,.2)', background: '#0a0618', borderRadius: '16px 16px 0 0' }}>
          <div className="font-orbitron font-black tracking-widest" style={{ color: '#c084fc' }}>ADMIN PANEL</div>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(239,68,68,.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,.25)', cursor: 'pointer' }}>
            <X size={12} /> إغلاق
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(147,51,234,.15)', background: '#03010a' }}>
          {['⚙ الإعدادات', '🏆 Top 10'].map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              flex: 1, padding: '12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase',
              color: tab === i ? '#c084fc' : '#7c6f9a',
              borderBottom: tab === i ? '2px solid #9333ea' : '2px solid transparent',
              background: 'none', border: 'none', borderBottom: tab === i ? '2px solid #9333ea' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'Cairo,sans-serif'
            }}>{t}</button>
          ))}
        </div>

        <div style={{ padding: '24px' }}>
          {tab === 0 && (
            <div>
              <div className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c084fc' }}>اسم الكلان</div>
              <input className="input-field" value={cname} onChange={e => setCname(e.target.value)} placeholder="Eclipse Jujutsu Academy" />
            </div>
          )}

          {tab === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="text-xs tracking-widest uppercase" style={{ color: '#c084fc' }}>Top 10 — اختر العضو والجائزة</div>
                {loadingMembers && <span className="text-xs animate-pulse" style={{ color: '#7c6f9a' }}>جاري التحميل...</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {top10.map((p, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr', gap: '8px', alignItems: 'center' }}>
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

          <button onClick={save} disabled={saving} className="btn-primary w-full justify-center mt-6">
            <Save size={14} />
            {saving ? 'جاري الحفظ...' : saved ? '✦ تم الحفظ!' : '💾 حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  );
}
