
import React, { useState } from 'react';
import { Participant, AppTab, DrawRound, GroupResult } from './types';
import ParticipantManager from './components/ParticipantManager';
import RaffleModule from './components/RaffleModule';
import GroupingModule from './components/GroupingModule';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.INPUT);
  
  // Persisted state across tab switches
  const [raffleRounds, setRaffleRounds] = useState<DrawRound[]>([]);
  const [groupingResults, setGroupingResults] = useState<GroupResult[]>([]);

  // Only clear the participants list
  const handleClearParticipants = () => {
    if (confirm('確定要清空目前的參與者名單嗎？')) {
      setParticipants([]);
      // We also clear grouping results because they depend directly on the current list
      setGroupingResults([]);
    }
  };

  // Global reset including history
  const handleResetAllData = () => {
    if (confirm('確定要執行全域重置嗎？這將清空所有名單、抽籤歷史與分組紀錄。')) {
      setParticipants([]);
      setRaffleRounds([]);
      setGroupingResults([]);
      setActiveTab(AppTab.INPUT);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Smart Planner Hub
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-6 mr-6">
              <button
                onClick={() => setActiveTab(AppTab.INPUT)}
                className={`text-sm font-medium transition-colors ${activeTab === AppTab.INPUT ? 'text-indigo-600 underline underline-offset-8' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                名單管理
              </button>
              <button
                onClick={() => setActiveTab(AppTab.RAFFLE)}
                className={`text-sm font-medium transition-colors ${activeTab === AppTab.RAFFLE ? 'text-indigo-600 underline underline-offset-8' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                抽籤功能
              </button>
              <button
                onClick={() => setActiveTab(AppTab.GROUPING)}
                className={`text-sm font-medium transition-colors ${activeTab === AppTab.GROUPING ? 'text-indigo-600 underline underline-offset-8' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                分組功能
              </button>
            </div>
            <button 
              onClick={handleResetAllData}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-full transition-all font-medium"
            >
              全域重置
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <ParticipantManager 
            participants={participants} 
            setParticipants={setParticipants} 
            onResetAll={handleClearParticipants}
        />
        
        <div className="space-y-4">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab(AppTab.RAFFLE)}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === AppTab.RAFFLE ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              🎡 自動抽籤
            </button>
            <button
              onClick={() => setActiveTab(AppTab.GROUPING)}
              className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
                activeTab === AppTab.GROUPING ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              👥 自動分組
            </button>
          </div>

          <div className="min-h-[500px]">
            {activeTab === AppTab.RAFFLE && (
              <RaffleModule 
                participants={participants} 
                raffleRounds={raffleRounds} 
                setRaffleRounds={setRaffleRounds}
              />
            )}
            {activeTab === AppTab.GROUPING && (
              <GroupingModule 
                participants={participants} 
                groups={groupingResults} 
                setGroups={setGroupingResults}
              />
            )}
            {activeTab === AppTab.INPUT && (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="text-4xl mb-4">☝️</div>
                <p>請使用上方分頁進行抽籤或分組</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom bar for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center h-16 px-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab(AppTab.INPUT)} className={`flex flex-col items-center space-y-1 ${activeTab === AppTab.INPUT ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          <span className="text-[10px]">管理</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.RAFFLE)} className={`flex flex-col items-center space-y-1 ${activeTab === AppTab.RAFFLE ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          <span className="text-[10px]">抽籤</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.GROUPING)} className={`flex flex-col items-center space-y-1 ${activeTab === AppTab.GROUPING ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-[10px]">分組</span>
        </button>
      </div>
    </div>
  );
};

export default App;
