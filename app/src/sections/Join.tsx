import { useState } from 'react';
import { Send } from 'lucide-react';

const WEBHOOK = 'https://discord.com/api/webhooks/1492198999220818114/lhivzM5C1F-J0amN4djCjRIFk05GCmQVPG0PUhdr-upmk5dUh7YqK4tmiGICdGx5wsvz';

export default function Join() {
  const [form, setForm] = useState({rblx:'',disc:'',main:'',vid:'',why:''});
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  const send = async () => {
    if (!form.rblx || !form.disc || !form.vid) { alert('يرجى ملء Roblox والديسكورد ورابط الفيديو'); return; }
    setStatus('loading');
    try {
      const res = await fetch(WEBHOOK, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          username:'Eclipse — Join Request',
          embeds:[{
            title:'📩 طلب انضمام جديد',
            description:'> لاعب جديد يريد الانضمام لـ **Eclipse Jujutsu Academy**',
            color:0x9333ea,
            fields:[
              {name:'🎮 Roblox',value:`\`${form.rblx}\``,inline:true},
              {name:'💬 Discord',value:`\`${form.disc}\``,inline:true},
              {name:'⚔️ الميان',value:`\`${form.main||'—'}\``,inline:true},
              {name:'🎥 الفيديو',value:`[اضغط هنا](${form.vid})`},
              {name:'❓ سبب الانضمام',value:form.why||'—'},
            ],
            footer:{text:'Eclipse Jujutsu Academy • Join System'},
            timestamp:new Date().toISOString(),
          }]
        })
      });
      setStatus(res.ok||res.status===204?'ok':'err');
    } catch { setStatus('err'); }
  };

  const rules = [
    {n:'01',t:'فيديو كامل',d:'سجّل من أول ما تدخل اللعبة لحد ما تخلص بدون قطع'},
    {n:'02',t:'الميان',d:'أرسل اسم شخصيتك الرئيسية في اللعبة'},
    {n:'03',t:'الاختبار',d:'بعد مراجعة طلبك بنختبرك مباشرة'},
    {n:'04',t:'القبول',d:'لو عجبنا مستواك بنضيفك فوراً'},
  ];

  return (
    <section id="join" className="relative z-10 max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-12">
        <span className="section-num">04</span>
        <h2 className="font-rajdhani font-bold uppercase tracking-wide" style={{fontSize:'clamp(1.6rem,4vw,2.8rem)'}}>
          طلب <span style={{color:'#c084fc'}}>الانضمام</span>
        </h2>
        <div className="flex-1 h-px" style={{background:'linear-gradient(to left,transparent,rgba(147,51,234,.3))'}} />
      </div>

      {/* Rules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mb-8 rounded-lg overflow-hidden border" style={{borderColor:'rgba(147,51,234,.2)'}}>
        {rules.map(r => (
          <div key={r.n} className="flex gap-3 p-4 items-start" style={{background:'rgba(6,3,15,.8)'}}>
            <span className="font-orbitron text-xs mt-0.5 flex-shrink-0" style={{color:'#c084fc'}}>{r.n}</span>
            <div><div className="font-bold text-sm mb-1">{r.t}</div><div className="text-xs leading-relaxed" style={{color:'#7c6f9a'}}>{r.d}</div></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>اسم Roblox *</label>
            <input className="input-field" value={form.rblx} onChange={e=>setForm({...form,rblx:e.target.value})} placeholder="Roblox username" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>Discord Username *</label>
            <input className="input-field" value={form.disc} onChange={e=>setForm({...form,disc:e.target.value})} placeholder="username" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>الميان (Main Character)</label>
          <input className="input-field" value={form.main} onChange={e=>setForm({...form,main:e.target.value})} placeholder="اسم شخصيتك الرئيسية" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>رابط الفيديو 🎥 *</label>
          <input className="input-field" value={form.vid} onChange={e=>setForm({...form,vid:e.target.value})} placeholder="YouTube / Google Drive ..." />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>لماذا تريد الانضمام؟</label>
          <textarea className="input-field" rows={3} value={form.why} onChange={e=>setForm({...form,why:e.target.value})} placeholder="اشرح لنا..." />
        </div>
        <p className="text-xs leading-relaxed" style={{color:'#4a4060',borderRight:'2px solid rgba(147,51,234,.3)',paddingRight:'.75rem'}}>يلزم تكون في سيرفر Discord عشان نتواصل معك بعد مراجعة الطلب.</p>
        <button className="btn-primary self-start" onClick={send} disabled={status==='loading'}>
          <Send size={14} />
          {status==='loading'?'جاري الإرسال...':'إرسال الطلب 📩'}
        </button>
        {status==='ok' && <div className="p-3 rounded-lg text-sm" style={{background:'rgba(147,51,234,.12)',border:'1px solid rgba(147,51,234,.4)',color:'#c084fc'}}>✦ تم الإرسال! وصل طلبك على Discord — بنراجعه ونتواصل معك</div>}
        {status==='err' && <div className="p-3 rounded-lg text-sm" style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.3)',color:'#f87171'}}>⚠️ حصل خطأ. تحقق من الاتصال وحاول مرة ثانية.</div>}
      </div>
    </section>
  );
}
