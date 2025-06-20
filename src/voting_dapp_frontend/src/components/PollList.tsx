import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Poll, VoteResult } from '../types/polling';
import { getPolls } from '../api/icp_polling';
import PollCard from './PollCard';

interface PollListProps {
  refreshTrigger: number;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PollList: React.FC<PollListProps> = ({ refreshTrigger, onNotification }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const fetchPolls = async () => {
    console.log('🔄 PollList: Fetching polls...');
    setIsLoading(true);

    try {
      // getPolls() returns Poll[] directly based on your working code
      const result = await getPolls();
      console.log('✅ PollList: Raw polls result:', result);
      console.log('🔍 PollList: Result type:', typeof result);
      console.log('🔍 PollList: Is array:', Array.isArray(result));
      console.log('🔍 PollList: Array length:', Array.isArray(result) ? result.length : 'N/A');

      // Detailed logging of first poll if available
      if (Array.isArray(result) && result.length > 0) {
        console.log('🔍 PollList: First poll structure:');
        console.log('📊 Poll keys:', Object.keys(result[0]));
        console.log('📊 Poll values:', result[0]);
        console.log('📊 ID type:', typeof result[0].id);
        console.log('📊 Question type:', typeof result[0].question);
        console.log('📊 Options type:', typeof result[0].options);
        console.log('📊 Votes type:', typeof result[0].votes);
        console.log('📊 Votes value:', result[0].votes);
      }

      // Convert the result to proper Poll format
      const formattedPolls: Poll[] = (result as any[]).map((poll: any, index: number) => {
        console.log(`🔧 PollList: Processing poll ${index}:`, poll);

        // Handle different vote formats
        let votesArray: number[] = [];
        if (poll.votes) {
          if (Array.isArray(poll.votes)) {
            votesArray = poll.votes.map((v: any) => Number(v));
          } else if (poll.votes.constructor && poll.votes.constructor.name === 'BigUint64Array') {
            votesArray = Array.from(poll.votes).map((v: any) => Number(v));
          } else {
            console.warn('🔍 Unknown votes format:', poll.votes);
            votesArray = [];
          }
        }

        const formatted = {
          id: Number(poll.id), // Convert bigint to number for UI
          question: poll.question || 'No question',
          options: poll.options || [],
          votes: votesArray,
          voters: poll.voters || []
        };

        console.log(`✅ PollList: Formatted poll ${index}:`, formatted);
        return formatted;
      });

      console.log('🔄 PollList: All formatted polls:', formattedPolls);

      // Extra log: show types of votes arrays
      formattedPolls.forEach((poll, idx) => {
        console.log(
          `Poll ${idx} votes:`, poll.votes,
          'Array.isArray:', Array.isArray(poll.votes),
          'Typeof first element:', poll.votes.length > 0 ? typeof poll.votes[0] : 'n/a'
        );
      });

      setPolls(formattedPolls);
      setIsConnected(true);

      if (formattedPolls.length > 0) {
        onNotification(`Loaded ${formattedPolls.length} polls successfully`, 'success');
      } else {
        onNotification('No polls found', 'info');
      }
    } catch (err) {
      console.error('❌ PollList: Error fetching polls:', err);
      setPolls([]);
      setIsConnected(false);
      onNotification('Failed to load polls - check your connection', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 PollList: useEffect triggered, refreshTrigger:', refreshTrigger);
    fetchPolls();
  }, [refreshTrigger]);

  const handleVote = (result: VoteResult) => {
    console.log('🗳️ PollList: Vote result received:', result);

    if (result.success) {
      onNotification('Vote submitted successfully!', 'success');
      // Refresh polls to show updated vote counts
      fetchPolls();
    } else {
      onNotification(result.error || 'Failed to vote', 'error');
    }
  };

  const handleRefresh = () => {
    console.log('🔄 PollList: Manual refresh triggered');
    fetchPolls();
    onNotification('Refreshing polls...', 'info');
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading polls...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Active Polls</h2>
          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
            {polls.length}
          </span>
          {isConnected ? (
            <div className="flex items-center gap-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
              <Wifi size={14} />
              Connected
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
              <WifiOff size={14} />
              Offline
            </div>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>



      {!isConnected && (
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="text-red-300">
            <p className="font-medium">Connection Issues</p>
            <p className="text-sm text-red-300/80">
              Make sure your local DFX network is running with <code className="bg-red-400/20 px-1 rounded">dfx start</code>
            </p>
          </div>
        </div>
      )}

      {polls.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 shadow-xl text-center">
          <BarChart3 className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Polls Yet</h3>
          <p className="text-white/70">
            {isConnected
              ? "Be the first to create a poll and start gathering opinions!"
              : "Connect to your DFX network to see polls"
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {polls.map((poll) => {
            // Defensive: check votes is number[]
            const isVotesArray = Array.isArray(poll.votes) && (poll.votes.length === 0 || typeof poll.votes[0] === 'number');
            if (!isVotesArray) {
              console.error('🚨 PollCard received a poll with malformed votes:', poll);
              return (
                <div key={poll.id} className="text-red-400">
                  Error: Malformed poll data for poll #{poll.id}.
                </div>
              );
            }
            return (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollList;