import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useData, type Member } from '@/hooks/useData';

const RANKS = [
  {key:'درجة خاصة',    icon:'⚡',badge:'top', desc:'أعلى رتبة يمكن التقديم لها'},
  {key:'الدرجة الأولى', icon:'🔴',badge:'',   desc:'نخبة الكلان'},
  {key:'الدرجة الثانية',icon:'🔵',badge:'',   desc:'أعضاء متقدمون'},
  {key:'الدرجة الثالثة',icon:'🟢',badge:'',   desc:'أعضاء منتظمون'},
  {key:'الدرجة الرابعة',icon:'🟠',badge:'',   desc:'أعضاء جدد'},
  {key:'الدرجة الخامسة',icon:'⚪',badge:'',   desc:'مرحلة الاختبار'},
];

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="card flex items-center gap-3 p-3">
      <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-orbitron font-black text-white overflow-hidden border"
        style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)',borderColor:'rgba(147,51,234,.4)'}}>
        {m.img ? <img src={m.img} className="w-full h-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).style.display='none';}} alt={m.rblx} /> : m.rblx[0]?.toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm truncate">{m.rblx}</div>
        {m.disc && <div className="text-xs mt-0.5" style={{color:'#7c6f9a'}}>@{m.disc}</div>}
      </div>
    </div>
  );
}

export default function Ranks() {
  const { data } = useData();
  const [open, setOpen] = useState<string|null>(null);

  return (
    <section id="info" className="relative z-10 max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-12">
        <span className="section-num">01</span>
        <h2 className="font-rajdhani font-bold uppercase tracking-wide" style={{fontSize:'clamp(1.6rem,4vw,2.8rem)'}}>
          الرتب و<span style={{color:'#c084fc'}}>الأعضاء</span>
        </h2>
        <div className="flex-1 h-px" style={{background:'linear-gradient(to left,transparent,rgba(147,51,234,.3))'}} />
      </div>
      <p className="text-sm mb-6" style={{color:'#7c6f9a'}}>اضغط على أي رتبة لعرض أعضائها ↓</p>

      {/* Owner rows */}
      {[{icon:'👑',k:'Owner',d:'مالك الكلان'},{icon:'🔱',k:'Co-Owner',d:'مساعد المالك'}].map(r=>(
        <div key={r.k} className="flex items-center gap-4 p-4 mb-1 rounded-lg border" style={{background:'rgba(6,3,15,.5)',borderColor:'rgba(147,51,234,.12)',opacity:.7}}>
          <span className="text-2xl w-9 text-center">{r.icon}</span>
          <div className="flex-1"><div className="font-bold">{r.k}</div><div className="text-xs mt-0.5" style={{color:'#7c6f9a'}}>{r.d}</div></div>
          <span className="text-xs px-2 py-1 rounded" style={{background:'rgba(251,191,36,.1)',color:'#fbbf24',border:'1px solid rgba(251,191,36,.3)'}}>مالك</span>
        </div>
      ))}

      {/* Clickable ranks */}
      <div className="flex flex-col gap-1 mt-1">
        {RANKS.map(r => {
          const members = data.members.filter(m => m.rank === r.key);
          const isOpen = open === r.key;
          return (
            <div key={r.key}>
              <div
                className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200"
                style={{
                  background: isOpen ? '#0a0618' : 'rgba(6,3,15,.5)',
                  borderColor: isOpen ? 'rgba(147,51,234,.4)' : 'rgba(147,51,234,.15)',
                  boxShadow: isOpen ? '0 0 20px rgba(147,51,234,.08)' : 'none',
                  borderRight: isOpen ? '3px solid #a855f7' : '3px solid transparent',
                }}
                onClick={() => setOpen(isOpen ? null : r.key)}
              >
                <span className="text-2xl w-9 text-center">{r.icon}</span>
                <div className="flex-1">
                  <div className="font-bold">{r.key}</div>
                  <div className="text-xs mt-0.5" style={{color:'#7c6f9a'}}>{r.desc}</div>
                </div>
                {r.badge === 'top' && (
                  <span className="text-xs px-2 py-1 rounded" style={{background:'rgba(147,51,234,.15)',color:'#c084fc',border:'1px solid rgba(147,51,234,.3)'}}>أعلى رتبة</span>
                )}
                <span className="font-orbitron text-xs px-2 py-1 rounded" style={{color:'#c084fc',background:'rgba(147,51,234,.1)',border:'1px solid rgba(147,51,234,.25)'}}>{members.length}</span>
                <ChevronDown size={16} style={{color:'#7c6f9a',transition:'transform .25s',transform:isOpen?'rotate(180deg)':'rotate(0)'}} />
              </div>

              {isOpen && (
                <div className="animate-panelIn rounded-lg border mt-0.5 mb-0.5 overflow-hidden" style={{background:'#0a0618',borderColor:'rgba(147,51,234,.3)'}}>
                  <div className="flex justify-between items-center px-5 py-3 border-b" style={{borderColor:'rgba(147,51,234,.15)'}}>
                    <span className="text-xs tracking-widest uppercase" style={{color:'#c084fc'}}>أعضاء {r.key}</span>
                    <span className="font-orbitron text-xs" style={{color:'#7c6f9a'}}>{members.length} عضو</span>
                  </div>
                  {members.length === 0 ? (
                    <div className="text-center py-8 text-sm" style={{color:'#4a4060'}}>لا يوجد أعضاء في هذه الرتبة حتى الآن</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-3">
                      {members.map(m => <MemberCard key={m.id} m={m} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
