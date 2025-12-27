
import React, { useState, useRef } from 'react';
import { Participant } from '../types';
import { generateId, parseNames } from '../utils';

interface Props {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onResetAll: () => void;
}

const ParticipantManager: React.FC<Props> = ({ participants, setParticipants, onResetAll }) => {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateListWithNames = (names: string[]) => {
    const newParticipants: Participant[] = names.map(name => ({
      id: generateId(),
      name,
      isDuplicate: false
    }));

    const combined = [...participants, ...newParticipants];
    const nameCounts = new Map<string, number>();
    combined.forEach(p => nameCounts.set(p.name, (nameCounts.get(p.name) || 0) + 1));
    
    setParticipants(combined.map(p => ({
      ...p,
      isDuplicate: (nameCounts.get(p.name) || 0) > 1
    })));
  };

  const handleAddNames = () => {
    const names = parseNames(inputText);
    if (names.length === 0) return;
    updateListWithNames(names);
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = parseNames(text);
      updateListWithNames(names);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeParticipant = (id: string) => {
    const filtered = participants.filter(p => p.id !== id);
    const nameCounts = new Map<string, number>();
    filtered.forEach(p => nameCounts.set(p.name, (nameCounts.get(p.name) || 0) + 1));
    setParticipants(filtered.map(p => ({
      ...p,
      isDuplicate: (nameCounts.get(p.name) || 0) > 1
    })));
  };

  const removeAllDuplicates = () => {
    const seen = new Set<string>();
    const unique = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    }).map(p => ({ ...p, isDuplicate: false }));
    setParticipants(unique);
  };

  const loadDemo = () => {
    const demoNames = ['Alice', 'Bob', 'Charlie', 'Alice', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Bob'];
    updateListWithNames(demoNames);
  };

  const handleClearInput = () => {
    setInputText('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">名單輸入與管理</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="text-sm font-medium text-slate-600">貼上姓名 (以換行或逗號分隔)</label>
                <button 
                  onClick={handleClearInput}
                  className="text-[10px] text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wider font-bold"
                >
                  清除輸入框
                </button>
              </div>
              <textarea
                className="w-full h-32 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                placeholder="例如: 王小明, 李小華, 陳大文..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddNames}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm active:scale-95"
              >
                加入名單
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm active:scale-95"
              >
                上傳 CSV
              </button>
              <button
                onClick={loadDemo}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm active:scale-95"
              >
                模擬數據
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">預覽名單 ({participants.length} 人)</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={removeAllDuplicates}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors disabled:opacity-30"
                  disabled={!participants.some(p => p.isDuplicate)}
                >
                  去重複
                </button>
                <button
                  onClick={onResetAll}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold transition-colors"
                  disabled={participants.length === 0}
                >
                  清空全體
                </button>
              </div>
            </div>
            <div className="h-44 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50/50 p-2 space-y-1 custom-scrollbar">
              {participants.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic py-4">
                  <span className="text-2xl mb-1">📋</span>
                  <span>尚無名單，請由左側加入</span>
                </div>
              ) : (
                participants.map((p) => (
                  <div key={p.id} className={`flex justify-between items-center px-3 py-1.5 rounded-md transition-all ${p.isDuplicate ? 'bg-rose-50 border border-rose-100 ring-1 ring-rose-200/50' : 'bg-white shadow-sm border border-slate-100 hover:border-indigo-200'}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-700">{p.name}</span>
                      {p.isDuplicate && <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-black">重複</span>}
                    </div>
                    <button onClick={() => removeParticipant(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1" title="刪除此項">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default ParticipantManager;
