import React, { useState } from 'react';
import { Vote, Globe } from 'lucide-react';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import Notification from './components/Notification';
import { NotificationState, CreatePollResult } from './types/polling';

function App() {
  const [activeTab, setActiveTab] = useState<'polls' | 'create'>('polls');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: '',
    type: 'info'
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  const handlePollCreated = (result: CreatePollResult) => {
    if (result.success) {
      showNotification(`Poll #${result.pollId} created successfully!`, 'success');
      setRefreshTrigger(prev => prev + 1);
      setActiveTab('polls');
    } else {
      showNotification(result.error || 'Failed to create poll', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/10 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">DecentralPoll</h1>
                  <p className="text-xs text-white/70">Powered by Internet Computer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white/70">
                <Globe size={16} />
                <span className="text-sm">Decentralized</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 w-fit">
            <button
              onClick={() => setActiveTab('polls')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'polls'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              View Polls
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'create'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Create Poll
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'polls' ? (
                <PollList 
                  refreshTrigger={refreshTrigger}
                  onNotification={showNotification}
                />
              ) : (
                <PollForm onPollCreated={handlePollCreated} />
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4">How it Works</h3>
                <div className="space-y-3 text-white/80 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold mt-0.5">1</div>
                    <div>
                      <p className="font-medium">Create Polls</p>
                      <p className="text-white/60">Ask questions with multiple choice options</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold mt-0.5">2</div>
                    <div>
                      <p className="font-medium">Vote Securely</p>
                      <p className="text-white/60">Cast your vote on the blockchain</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs font-bold mt-0.5">3</div>
                    <div>
                      <p className="font-medium">View Results</p>
                      <p className="text-white/60">See real-time voting results</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-2">Built on Internet Computer</h3>
                <p className="text-white/70 text-sm mb-4">
                  This dApp runs entirely on-chain with decentralized governance and transparent voting.
                </p>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Fully Decentralized</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification */}
      <Notification 
        notification={notification}
        onClose={hideNotification}
      />
    </div>
  );
}

export default App;