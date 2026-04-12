import { useEffect, useRef, useState } from 'react';
import { useData } from '@/hooks/useData';

export default function Hero() {
  const { data } = useData();
  const ptsRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    setTimeout(() => setVis(true), 100);
    if (!ptsRef.current) return;
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      const sz = Math.random() > .6 ? 3 : 2;
      p.style.cssText = `position:absolute;border-radius:50%;background:#a855f7;left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation:ptup ${9+Math.random()*11}s linear ${Math.random()*12}s infinite;opacity:0;`;
      ptsRef.current.appendChild(p);
    }
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden z-10" style={{paddingTop:'80px'}}>
      {/* BG */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute pointer-events-none" style={{width:'800px',height:'400px',background:'radial-gradient(ellipse,rgba(147,51,234,.2),transparent 70%)',top:'-80px',left:'50%',transform:'translateX(-50%)',animation:'glowPulse 6s ease-in-out infinite'}} />
      <div ref={ptsRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 mb-10 rounded-full border text-xs tracking-widest uppercase transition-all duration-700 ${vis?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}
          style={{borderColor:'rgba(147,51,234,.35)',background:'rgba(147,51,234,.12)',color:'#c084fc',letterSpacing:'4px'}}>
          <span className="animate-blink" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#c084fc',display:'inline-block'}} />
          Jujutsu Shenanigans · Roblox · Clan
        </div>

        {/* Title */}
        <div className={`transition-all duration-700 delay-100 ${vis?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}>
          <h1 className="font-orbitron font-black text-gradient-p glow-p" style={{fontSize:'clamp(4rem,15vw,10rem)',lineHeight:.95,letterSpacing:'-3px',display:'block'}}>
            ECLIPSE
          </h1>
          <p className="font-orbitron font-bold" style={{fontSize:'clamp(.8rem,4vw,2.2rem)',letterSpacing:'10px',color:'#c084fc',marginTop:'.3em',filter:'drop-shadow(0 0 10px rgba(168,85,247,.5))'}}>
            JUJUTSU
          </p>
          <p className="font-rajdhani" style={{fontSize:'clamp(.65rem,2.5vw,1.1rem)',letterSpacing:'12px',color:'#7c6f9a',marginTop:'.4em'}}>
            ACADEMY
          </p>
        </div>

        <div className={`my-8 mx-auto transition-all duration-700 delay-200 ${vis?'opacity-100':'opacity-0'}`}
          style={{width:'80px',height:'1px',background:'linear-gradient(90deg,transparent,rgba(147,51,234,.6),transparent)'}} />

        {/* Buttons */}
        <div className={`flex gap-3 justify-center flex-wrap transition-all duration-700 delay-300 ${vis?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}>
          <a href="#join" className="btn-primary">قدّم للكلان</a>
          <a href="https://discord.gg/9D5dY7r4s" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.04.031.05a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Discord
          </a>
        </div>

        {/* Stats */}
        <div className={`inline-flex mt-12 border rounded-xl overflow-hidden transition-all duration-700 delay-500 ${vis?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}
          style={{borderColor:'rgba(147,51,234,.18)',background:'rgba(3,1,10,.7)',backdropFilter:'blur(10px)'}}>
          {[
            {v:'ACTIVE',l:'الحالة'},
            {v:data.members.length.toString(),l:'عضو'},
            {v:'PVP',l:'التخصص'},
          ].map((s,i) => (
            <div key={i} className="px-8 py-4 text-center" style={{borderLeft:i>0?'1px solid rgba(147,51,234,.18)':'none'}}>
              <div className="font-orbitron font-black text-xl" style={{color:'#c084fc',textShadow:'0 0 15px rgba(147,51,234,.5)'}}>{s.v}</div>
              <div className="text-xs mt-1 tracking-widest uppercase" style={{color:'#7c6f9a'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
