
import React, { useState } from 'react';
import { Participant, GroupResult } from '../types';
import { shuffleArray, downloadCSV } from '../utils';

interface Props {
  participants: Participant[];
  groups: GroupResult[];
  setGroups: React.Dispatch<React.SetStateAction<GroupResult[]>>;
}

const GroupingModule: React.FC<Props> = ({ participants, groups, setGroups }) => {
  const [mode, setMode] = useState<'count' | 'size'>('count');
  const [value, setValue] = useState(2);

  const handleGroup = () => {
    if (participants.length === 0) return alert('請先輸入名單！');
    // Fix: Explicitly specify the generic type and result type to ensure 'shuffled' is inferred as string[]
    const shuffled: string[] = shuffleArray<string>(participants.map(p => p.name));
    let numGroups = mode === 'count' ? Math.max(1, value) : Math.max(1, Math.ceil(shuffled.length / value));
    const results: GroupResult[] = Array.from({ length: numGroups }, (_, i) => ({ groupName: `第 ${i + 1} 組`, members: [] }));
    
    // Fix: Added explicit type for 'name' parameter to ensure it is treated as a string during the push operation
    shuffled.forEach((name: string, index: number) => {
      const targetGroup = results[index % numGroups];
      if (targetGroup) {
        targetGroup.members.push(name);
      }
    });
    setGroups(results);
  };

  const handleDownload = () => {
    const csvData = [['分組', '成員'], ...groups.flatMap(g => g.members.map(m => [g.groupName, m]))];
    downloadCSV(csvData, `分組結果_${new Date().toLocaleDateString()}.csv`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-50 pb-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">自動分組</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              <button onClick={() => setMode('count')} className={`px-4 py-2 text-sm font-bold ${mode === 'count' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>分組數</button>
              <button onClick={() => setMode('size')} className={`px-4 py-2 text-sm font-bold ${mode === 'size' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>每組人數</button>
            </div>
            <div className="flex items-center space-x-2">
              <input type="number" min="1" value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-16 p-2 border border-slate-200 rounded text-center" />
              <span className="text-sm text-slate-600">{mode === 'count' ? '組' : '人'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleGroup} disabled={participants.length === 0} className={`px-6 py-2.5 rounded-lg font-bold shadow transition-all active:scale-95 ${participants.length === 0 ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>執行分組</button>
          {groups.length > 0 && (
            <div className="flex gap-2">
              <button onClick={handleDownload} className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold flex items-center space-x-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg><span>下載</span></button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[200px]">
        {groups.length > 0 ? groups.map((group, idx) => (
          <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-2"><span className="font-bold text-indigo-800">{group.groupName}</span><span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{group.members.length} 人</span></div>
            <ul className="space-y-1.5">{group.members.map((m, i) => <li key={i} className="text-slate-600 text-sm py-1 px-2 rounded bg-white shadow-sm border border-slate-100">{m}</li>)}</ul>
          </div>
        )) : <div className="col-span-full py-20 text-center text-slate-400 italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">尚未分組</div>}
      </div>
    </div>
  );
};

export default GroupingModule;
