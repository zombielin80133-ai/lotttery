
import React, { useState, useRef } from 'react';
import { Participant, DrawRound } from '../types';
import { generateId } from '../utils';

interface Props {
  participants: Participant[];
  raffleRounds: DrawRound[];
  setRaffleRounds: React.Dispatch<React.SetStateAction<DrawRound[]>>;
}

const RaffleModule: React.FC<Props> = ({ participants, raffleRounds, setRaffleRounds }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState<string>('');
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [drawCount, setDrawCount] = useState(1);
  const spinInterval = useRef<number | null>(null);

  const startDraw = () => {
    if (participants.length === 0) return alert('請先輸入名單！');
    const allWinners = raffleRounds.flatMap(r => r.names);
    let pool = participants.map(p => p.name);
    if (!allowRepeat) {
      pool = pool.filter(name => !allWinners.includes(name));
    }
    if (pool.length === 0) return alert('沒有可抽籤的人選了！');

    setIsSpinning(true);
    let counter = 0;
    const maxSpin = 25;

    spinInterval.current = window.setInterval(() => {
      const randomName = pool[Math.floor(Math.random() * pool.length)];
      setCurrentCandidate(randomName);
      counter++;
      if (counter >= maxSpin) {
        if (spinInterval.current) window.clearInterval(spinInterval.current);
        const tempPool = [...pool];
        const actualDrawCount = Math.min(drawCount, tempPool.length);
        const finalWinners: string[] = [];
        for (let i = 0; i < actualDrawCount; i++) {
          const idx = Math.floor(Math.random() * tempPool.length);
          finalWinners.push(tempPool.splice(idx, 1)[0]);
        }
        setRaffleRounds(prev => [{
          id: generateId(),
          roundNumber: prev.length + 1,
          names: finalWinners,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev]);
        setIsSpinning(false);
        setCurrentCandidate('');
      }
    }, 80);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end gap-6 border-b border-slate-50 pb-6">
        <div className="flex-1 space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">🎡 自動抽籤</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-slate-600">抽取人數:</label>
              <input type="number" min="1" max="50" value={drawCount} onChange={(e) => setDrawCount(Number(e.target.value))} className="w-16 p-1.5 border border-slate-200 rounded text-center" />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={allowRepeat} onChange={() => setAllowRepeat(!allowRepeat)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-600">允許重複中籤</span>
            </label>
          </div>
        </div>
        <button onClick={startDraw} disabled={isSpinning || participants.length === 0} className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all ${isSpinning ? 'bg-slate-100 text-slate-400' : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-105 active:scale-95'}`}>
          {isSpinning ? '抽籤中...' : '開始抽籤'}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
        {isSpinning ? <div className="text-6xl font-black text-indigo-600 animate-pulse">{currentCandidate}</div> : <div className="text-slate-400 text-center py-8"><div className="text-5xl opacity-20 mb-2">🎰</div><p>準備好就點擊按鈕</p></div>}
      </div>
      {raffleRounds.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-700">中籤歷史</h3>
          {raffleRounds.map((round, idx) => (
            <div key={round.id} className={`p-4 rounded-xl border ${idx === 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100'} animate-in fade-in slide-in-from-top-2`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black bg-indigo-600 text-white px-2 py-1 rounded">第 {raffleRounds.length - idx} 輪</span>
                <button onClick={() => setRaffleRounds(prev => prev.filter(r => r.id !== round.id))} className="text-slate-300 hover:text-rose-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
              <div className="flex flex-wrap gap-2">{round.names.map((name, i) => <div key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm">{name}</div>)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RaffleModule;
