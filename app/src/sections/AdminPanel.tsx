import { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { useData, type Top10Entry } from '@/hooks/useData';

const PASS = 'seoul334';
const RANKS_OPTIONS = ['درجة خاصة','الدرجة الأولى','الدرجة الثانية','الدرجة الثالثة','الدرجة الرابعة','الدرجة الخامسة'];

interface Props { onClose: () => void; }

export default function AdminPanel({ onClose }: Props) {
  const { data, updateClanName, updateTop10, addMember, deleteMember } = useData();
  const [tab, setTab] = useState(0);
  const [cname, setCname] = useState(data.clanName);
  const [top10, setTop10] = useState<Top10Entry[]>(data.top10.map(t=>({...t})));
  const [newMember, setNewMember] = useState({rblx:'',disc:'',rank:'درجة خاصة',img:''});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateClanName(cname);
    await updateTop10(top10);
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  const handleAddMember = async () => {
    if (!newMember.rblx) { alert('أدخل اسم Roblox'); return; }
    await addMember(newMember);
    setNewMember({rblx:'',disc:'',rank:'درجة خاصة',img:''});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{background:'rgba(3,1,10,.97)'}}>
      <div className="w-full max-w-3xl my-auto rounded-2xl overflow-hidden border" style={{background:'#06030f',borderColor:'rgba(147,51,234,.35)'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{background:'#0a0618',borderColor:'rgba(147,51,234,.2)'}}>
          <div className="font-orbitron font-black tracking-widest" style={{color:'#c084fc'}}>ADMIN PANEL</div>
          <button onClick={onClose} className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all" style={{background:'rgba(239,68,68,.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,.25)'}}>
            <X size={12} /> إغلاق
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{background:'#03010a',borderColor:'rgba(147,51,234,.15)'}}>
          {['⚙ الإعدادات','👥 الأعضاء','🏆 Top 10'].map((t,i) => (
            <button key={i} onClick={()=>setTab(i)}
              className="flex-1 py-3 text-xs tracking-widest uppercase transition-all font-bold"
              style={{
                color: tab===i?'#c084fc':'#7c6f9a',
                borderBottom: tab===i?'2px solid #9333ea':'2px solid transparent',
                fontFamily:'Cairo,sans-serif'
              }}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* TAB 0: Settings */}
          {tab===0 && (
            <div>
              <div className="text-xs tracking-widest uppercase mb-2" style={{color:'#c084fc'}}>اسم الكلان</div>
              <input className="input-field" value={cname} onChange={e=>setCname(e.target.value)} placeholder="Eclipse Jujutsu Academy" />
            </div>
          )}

          {/* TAB 1: Members */}
          {tab===1 && (
            <div>
              <div className="text-xs tracking-widest uppercase mb-3" style={{color:'#c084fc'}}>إضافة عضو جديد</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input className="input-field" value={newMember.rblx} onChange={e=>setNewMember({...newMember,rblx:e.target.value})} placeholder="اسم Roblox *" />
                <input className="input-field" value={newMember.disc} onChange={e=>setNewMember({...newMember,disc:e.target.value})} placeholder="Discord username" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <select className="input-field" value={newMember.rank} onChange={e=>setNewMember({...newMember,rank:e.target.value})}>
                  {RANKS_OPTIONS.map(r=><option key={r}>{r}</option>)}
                </select>
                <input className="input-field" value={newMember.img} onChange={e=>setNewMember({...newMember,img:e.target.value})} placeholder="رابط الصورة (اختياري)" />
              </div>
              <button onClick={handleAddMember} className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all" style={{background:'rgba(147,51,234,.15)',color:'#c084fc',border:'1px solid rgba(147,51,234,.3)'}}>
                <Plus size={14} /> إضافة العضو
              </button>

              <div className="text-xs tracking-widest uppercase mt-6 mb-3" style={{color:'#c084fc'}}>الأعضاء الحاليون ({data.members.length})</div>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {data.members.length===0 ? (
                  <p className="text-xs py-3" style={{color:'#4a4060'}}>لا يوجد أعضاء — أضف الأعضاء أعلاه</p>
                ) : data.members.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-3 rounded-lg border" style={{background:'#03010a',borderColor:'rgba(147,51,234,.15)'}}>
                    <div className="flex-1 font-bold text-sm">{m.rblx}</div>
                    <div className="text-xs px-2 py-0.5 rounded" style={{background:'rgba(147,51,234,.1)',color:'#c084fc',border:'1px solid rgba(147,51,234,.25)'}}>{m.rank}</div>
                    <button onClick={()=>deleteMember(m.id)} className="flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-all" style={{background:'rgba(239,68,68,.1)',color:'#ef4444',border:'1px solid rgba(239,68,68,.2)'}}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Top 10 */}
          {tab===2 && (
            <div>
              <div className="text-xs tracking-widest uppercase mb-3" style={{color:'#c084fc'}}>Top 10 — الاسم والجائزة</div>
              <div className="flex flex-col gap-2">
                {top10.map((p,i) => (
                  <div key={i} className="grid items-center gap-2" style={{gridTemplateColumns:'28px 1fr 1fr'}}>
                    <span className="font-orbitron text-xs text-center" style={{color:'#4a4060'}}>{i+1}</span>
                    <input className="input-field text-sm py-2" value={p.name} onChange={e=>{const t=[...top10];t[i]={...t[i],name:e.target.value};setTop10(t);}} placeholder={`اللاعب ${i+1}`} />
                    <input className="input-field text-sm py-2" value={p.prize} onChange={e=>{const t=[...top10];t[i]={...t[i],prize:e.target.value};setTop10(t);}} placeholder="الجائزة" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save */}
          <button onClick={save} disabled={saving} className="btn-primary w-full justify-center mt-6">
            <Save size={14} />
            {saving?'جاري الحفظ...':saved?'✦ تم الحفظ!':'💾 حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  );
}
