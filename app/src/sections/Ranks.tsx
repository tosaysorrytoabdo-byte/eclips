import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const BOT_URL = 'https://bot-production-a81c.up.railway.app';

const RANK_ORDER = [
  { key: '👑 𝗢𝘄𝗻𝗲𝗿',              icon: '👑', color: '#ffbd00' },
  { key: '👑 𝗖𝗼_𝗢𝘄𝗻𝗲𝗿',           icon: '🔱', color: '#fff500' },
  { key: '👑 نائب صاحب السيرفر',    icon: '🌟', color: '#fff500' },
  { key: '💠 مسؤول الادمنية',       icon: '💠', color: '#fff500' },
  { key: 'Head of Testers👥♤',      icon: '🧪', color: '#790000' },
  { key: '☠ sᏢeᏟᎥᎪᏞ ᎶᏒᎪᎠᎬ ☠',   icon: '☠',  color: '#ff0000' },
  { key: '⫸  𝐓𝐄𝐒𝐓𝐄𝐑 🤼🏻',         icon: '🤼', color: '#8fa3ff' },
  { key: 'مبرمج💻',                 icon: '💻', color: '#00ff9c' },
  { key: '⫸  𝙂𝙍𝘼𝘿𝙀 3',            icon: '🟢', color: '#00ff3e' },
  { key: '⫸  𝙂𝙍𝘼𝘿𝙀 2',            icon: '🔵', color: '#00ddff' },
  { key: '⫸  𝙂𝙍𝘼𝘿𝙀 1',            icon: '🔴', color: '#5000d2' },
  { key: '🎮 عضو',                  icon: '🎮', color: '#1f8b4c' },
];

interface DiscordMember {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  highestRole: string;
  roles: { id: string; name: string; color: string }[];
}

function MemberCard({ m }: { m: DiscordMember }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="card flex items-center gap-3 p-3">
      <div
        className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border flex items-center justify-center font-orbitron font-black text-white"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderColor: 'rgba(147,51,234,.4)' }}
      >
        {!imgError ? (
          <img src={m.avatar} className="w-full h-full object-cover" alt={m.displayName} onError={() => setImgError(true)} />
        ) : (
          <span>{m.displayName[0]?.toUpperCase()}</span>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm truncate">{m.displayName}</div>
        <div className="text-xs mt-0.5" style={{ color: '#7c6f9a' }}>@{m.username}</div>
      </div>
    </div>
  );
}

export default function Ranks() {
  const [members, setMembers] = useState<DiscordMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BOT_URL}/members`)
      .then(r => r.json())
      .then(data => { setMembers(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const grouped: Record<string, DiscordMember[]> = {};
  members.forEach(m => {
    const key = m.highestRole;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(m);
  });

  const ranksToShow = RANK_ORDER.filter(r => grouped[r.key]?.length > 0);
  const unknownRoles = Object.keys(grouped).filter(k => !RANK_ORDER.find(r => r.key === k));

  return (
    <section id="info" className="relative z-10 max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-12">
        <span className="section-num">01</span>
        <h2 className="font-rajdhani font-bold uppercase tracking-wide" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)' }}>
          الرتب و<span style={{ color: '#c084fc' }}>الأعضاء</span>
        </h2>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left,transparent,rgba(147,51,234,.3))' }} />
      </div>

      {loading && (
        <div className="text-center py-16" style={{ color: '#7c6f9a' }}>
          <div className="font-orbitron text-sm tracking-widest animate-pulse">جاري تحميل الأعضاء...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-16" style={{ color: '#ef4444' }}>
          <div className="font-orbitron text-sm tracking-widest">تعذر تحميل الأعضاء</div>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm mb-6" style={{ color: '#7c6f9a' }}>
            {members.length} عضو · اضغط على أي رتبة لعرض أعضائها ↓
          </p>
          <div className="flex flex-col gap-1">
            {[...ranksToShow, ...unknownRoles.map(k => ({ key: k, icon: '👤', color: '#7c6f9a' }))].map(r => {
              const list = grouped[r.key] || [];
              const isOpen = open === r.key;
              return (
                <div key={r.key}>
                  <div
                    className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200"
                    style={{
                      background: isOpen ? '#0a0618' : 'rgba(6,3,15,.5)',
                      borderColor: isOpen ? 'rgba(147,51,234,.4)' : 'rgba(147,51,234,.15)',
                      boxShadow: isOpen ? '0 0 20px rgba(147,51,234,.08)' : 'none',
                      borderRight: `3px solid ${isOpen ? r.color : 'transparent'}`,
                    }}
                    onClick={() => setOpen(isOpen ? null : r.key)}
                  >
                    <span className="text-2xl w-9 text-center">{r.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold">{r.key}</div>
                    </div>
                    <span className="font-orbitron text-xs px-2 py-1 rounded" style={{ color: '#c084fc', background: 'rgba(147,51,234,.1)', border: '1px solid rgba(147,51,234,.25)' }}>
                      {list.length}
                    </span>
                    <ChevronDown size={16} style={{ color: '#7c6f9a', transition: 'transform .25s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </div>
                  {isOpen && (
                    <div className="rounded-lg border mt-0.5 mb-0.5 overflow-hidden" style={{ background: '#0a0618', borderColor: 'rgba(147,51,234,.3)' }}>
                      <div className="flex justify-between items-center px-5 py-3 border-b" style={{ borderColor: 'rgba(147,51,234,.15)' }}>
                        <span className="text-xs tracking-widest uppercase" style={{ color: '#c084fc' }}>أعضاء {r.key}</span>
                        <span className="font-orbitron text-xs" style={{ color: '#7c6f9a' }}>{list.length} عضو</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
                        {list.map(m => <MemberCard key={m.id} m={m} />)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
