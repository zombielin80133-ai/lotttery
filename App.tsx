
import React, { useState } from 'react';
import { Participant, AppTab, DrawRound, GroupResult } from './types';
import ParticipantManager from './components/ParticipantManager';
import RaffleModule from './components/RaffleModule';
import GroupingModule from './components/GroupingModule';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);
  const [raffleRounds, setRaffleRounds] = useState<DrawRound[]>([]);
  const [groupingResults, setGroupingResults] = useState<GroupResult[]>([]);

  const handleClearParticipants = () => {
    if (confirm('確定要清空目前的參與者名單嗎？這將會同步清除分組結果。')) {
      setParticipants([]);
      setGroupingResults([]);
    }
  };

  const handleResetAllData = () => {
    if (confirm('確定要執行「全域重置」嗎？這將清除名單、抽籤歷史與分組紀錄。')) {
      setParticipants([]);
      setRaffleRounds([]);
      setGroupingResults([]);
      setActiveTab(AppTab.INPUT);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Smart Planner</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6 mr-4">
              <button onClick={() => setActiveTab(AppTab.INPUT)} className={`text-sm font-medium ${activeTab === AppTab.INPUT ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>名單管理</button>
              <button onClick={() => setActiveTab(AppTab.RAFFLE)} className={`text-sm font-medium ${activeTab === AppTab.RAFFLE ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>抽籤</button>
              <button onClick={() => setActiveTab(AppTab.GROUPING)} className={`text-sm font-medium ${activeTab === AppTab.GROUPING ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>分組</button>
            </nav>
            <button onClick={handleResetAllData} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-full transition-all font-medium">全域重置</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <ParticipantManager participants={participants} setParticipants={setParticipants} onResetAll={handleClearParticipants} />
        
        <div className="space-y-4">
          <div className="flex border-b border-slate-200">
            <button onClick={() => setActiveTab(AppTab.RAFFLE)} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === AppTab.RAFFLE ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>🎡 自動抽籤</button>
            <button onClick={() => setActiveTab(AppTab.GROUPING)} className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === AppTab.GROUPING ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}>👥 自動分組</button>
          </div>

          <div className="min-h-[400px]">
            {activeTab === AppTab.RAFFLE && <RaffleModule participants={participants} raffleRounds={raffleRounds} setRaffleRounds={setRaffleRounds} />}
            {activeTab === AppTab.GROUPING && <GroupingModule participants={participants} groups={groupingResults} setGroups={setGroupingResults} />}
            {activeTab === AppTab.INPUT && (
              <div className="bg-white border rounded-2xl flex flex-col items-center justify-center py-20 text-slate-400 shadow-sm">
                <p>請點擊上方標籤開始活動</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
