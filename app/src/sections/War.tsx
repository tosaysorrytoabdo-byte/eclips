import { useState } from 'react';
import { Send } from 'lucide-react';

const WEBHOOK = 'https://discord.com/api/webhooks/1492198999220818114/lhivzM5C1F-J0amN4djCjRIFk05GCmQVPG0PUhdr-upmk5dUh7YqK4tmiGICdGx5wsvz';

export default function War() {
  const [form, setForm] = useState({clan:'',disc:'',num:'',type:'',note:''});
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'err'>('idle');

  const send = async () => {
    if (!form.clan || !form.disc) { alert('يرجى ملء اسم الكلان والديسكورد'); return; }
    setStatus('loading');
    try {
      const res = await fetch(WEBHOOK, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          username:'Eclipse — War Request',
          embeds:[{
            title:'⚔️ طلب تحدي جديد',
            description:'> كلان جديد يريد تحدي **Eclipse Jujutsu Academy**',
            color:0x9333ea,
            fields:[
              {name:'🏴 اسم الكلان',value:`\`${form.clan}\``,inline:true},
              {name:'💬 Discord',value:`\`${form.disc}\``,inline:true},
              {name:'👥 الأعضاء',value:`\`${form.num||'؟'}\``,inline:true},
              {name:'⚔️ النوع',value:`\`${form.type||'غير محدد'}\``,inline:true},
              {name:'📝 ملاحظات',value:form.note||'—'},
            ],
            footer:{text:'Eclipse Jujutsu Academy • War System'},
            timestamp:new Date().toISOString(),
          }]
        })
      });
      setStatus(res.ok||res.status===204?'ok':'err');
    } catch { setStatus('err'); }
  };

  return (
    <section id="war" className="relative z-10 max-w-5xl mx-auto px-4 py-24">
      <div className="flex items-center gap-4 mb-12">
        <span className="section-num">03</span>
        <h2 className="font-rajdhani font-bold uppercase tracking-wide" style={{fontSize:'clamp(1.6rem,4vw,2.8rem)'}}>
          تحدّى <span style={{color:'#c084fc'}}>الكلان</span>
        </h2>
        <div className="flex-1 h-px" style={{background:'linear-gradient(to left,transparent,rgba(147,51,234,.3))'}} />
      </div>

      <div className="p-5 rounded-lg border mb-6 text-sm leading-relaxed" style={{background:'rgba(6,3,15,.7)',borderColor:'rgba(147,51,234,.2)',borderRight:'3px solid #7c3aed',color:'#7c6f9a'}}>
        تبي تحارب Eclipse Jujutsu Academy؟ حط معلوماتك وسيصلنا طلبك على Discord مباشرة. تأكد إنك في سيرفرنا قبل الإرسال.
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>اسم الكلان</label>
            <input className="input-field" value={form.clan} onChange={e=>setForm({...form,clan:e.target.value})} placeholder="اسم كلانك" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>Discord Username</label>
            <input className="input-field" value={form.disc} onChange={e=>setForm({...form,disc:e.target.value})} placeholder="username" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>عدد الأعضاء</label>
            <input className="input-field" type="number" value={form.num} onChange={e=>setForm({...form,num:e.target.value})} placeholder="5" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>نوع المعركة</label>
            <select className="input-field" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="">اختر</option>
              <option>1v1</option><option>3v3</option><option>5v5</option><option>حرب كلانات كاملة</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest uppercase" style={{color:'#7c6f9a'}}>ملاحظات</label>
          <textarea className="input-field" rows={3} value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="أي معلومات إضافية..." />
        </div>

        <button className="btn-primary self-start" onClick={send} disabled={status==='loading'}>
          <Send size={14} />
          {status==='loading'?'جاري الإرسال...':'إرسال التحدي ⚔️'}
        </button>

        {status==='ok' && <div className="p-3 rounded-lg text-sm" style={{background:'rgba(147,51,234,.12)',border:'1px solid rgba(147,51,234,.4)',color:'#c084fc'}}>✦ تم الإرسال! وصل التحدي على Discord — بنتواصل معك قريباً</div>}
        {status==='err' && <div className="p-3 rounded-lg text-sm" style={{background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.3)',color:'#f87171'}}>⚠️ حصل خطأ. تحقق من الاتصال وحاول مرة ثانية.</div>}
      </div>
    </section>
  );
}
