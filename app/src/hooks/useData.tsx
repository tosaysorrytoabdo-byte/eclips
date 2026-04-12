import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { doc, onSnapshot, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Member {
  id: string;
  rblx: string;
  disc: string;
  rank: string;
  img: string;
}

export interface Top10Entry { name: string; prize: string; }

export interface StoreData {
  clanName: string;
  top10: Top10Entry[];
  members: Member[];
}

interface DataCtx {
  data: StoreData;
  updateClanName: (name: string) => Promise<void>;
  updateTop10: (top10: Top10Entry[]) => Promise<void>;
  addMember: (m: Omit<Member,'id'>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  loading: boolean;
}

const Ctx = createContext<DataCtx | undefined>(undefined);

const defaultTop10: Top10Entry[] = Array.from({length:10}, () => ({ name: '—', prize: '—' }));

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>({
    clanName: 'Eclipse Jujutsu Academy',
    top10: defaultTop10,
    members: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'clan'), snap => {
      if (snap.exists()) {
        const d = snap.data();
        setData(prev => ({
          ...prev,
          clanName: d.clanName || prev.clanName,
          top10: d.top10 || prev.top10,
        }));
      } else {
        setDoc(doc(db, 'settings', 'clan'), { clanName: 'Eclipse Jujutsu Academy', top10: defaultTop10 });
      }
      setLoading(false);
    });

    // Listen to members
    const unsubMembers = onSnapshot(collection(db, 'members'), snap => {
      const members = snap.docs.map(d => ({ id: d.id, ...d.data() } as Member));
      setData(prev => ({ ...prev, members }));
    });

    return () => { unsubSettings(); unsubMembers(); };
  }, []);

  const updateClanName = useCallback(async (name: string) => {
    await setDoc(doc(db, 'settings', 'clan'), { clanName: name, top10: data.top10 }, { merge: true });
  }, [data.top10]);

  const updateTop10 = useCallback(async (top10: Top10Entry[]) => {
    await setDoc(doc(db, 'settings', 'clan'), { top10, clanName: data.clanName }, { merge: true });
  }, [data.clanName]);

  const addMember = useCallback(async (m: Omit<Member,'id'>) => {
    const id = `member-${Date.now()}`;
    await setDoc(doc(db, 'members', id), m);
  }, []);

  const deleteMember = useCallback(async (id: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'members', id));
    await batch.commit();
  }, []);

  return (
    <Ctx.Provider value={{ data, updateClanName, updateTop10, addMember, deleteMember, loading }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useData must be used within DataProvider');
  return c;
}
