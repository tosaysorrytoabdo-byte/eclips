import { useData } from '@/hooks/useData';

export default function Top10() {
  const { data } = useData();

  return (
    <section id="top10" className="relative z-10 max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-12">
        <span className="section-num">02</span>
        <h2 className="font-rajdhani font-bold uppercase tracking-wide" style={{fontSize:'clamp(1.6rem,4vw,2.8rem)'}}>
          Top <span style={{color:'#c084fc'}}>10</span> الأقوياء
        </h2>
        <div className="flex-1 h-px" style={{background:'linear-gradient(to left,transparent,rgba(147,51,234,.3))'}} />
      </div>

      <div className="flex flex-col gap-1">
        {data.top10.map((p,i) => (
          <div key={i} className="card grid items-center gap-4 px-5 py-4 hover:border-purple-500/30"
            style={{gridTemplateColumns:'52px 1fr auto',
              borderColor: i===0 ? 'rgba(196,181,253,.3)' : undefined
            }}>
            <div className={`font-orbitron font-black text-2xl text-center ${
              i===0?'text-purple-300':i===1?'text-purple-500':i===2?'text-purple-800':''
            }`}
              style={{textShadow:i<3?`0 0 15px rgba(147,51,234,${.8-i*.2})`:undefined,color:i>=3?'#1e1433':undefined}}>
              {i+1}
            </div>
            <div className="font-bold">{p.name}</div>
            <div className="font-orbitron text-xs px-3 py-1 rounded whitespace-nowrap" style={{color:'#c084fc',background:'rgba(147,51,234,.08)',border:'1px solid rgba(147,51,234,.25)'}}>
              {p.prize}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
