import React, { useState } from 'react';
import { BarChart3, Users, CheckCircle } from 'lucide-react';
import { Poll, VoteResult } from '../types/polling';
import { vote as voteApi } from '../api/icp_polling';

interface PollCardProps {
  poll: Poll;
  onVote: (result: VoteResult) => void;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onVote }) => {
  const [isVoting, setIsVoting] = useState(false);
  const [votedOption, setVotedOption] = useState<number | null>(null);



  // Defensive: Ensure poll.options & poll.votes are arrays
  const options = Array.isArray(poll.options) ? poll.options : [];
  const votesArr = Array.isArray(poll.votes) ? poll.votes : [];

  // Calculate total votes
  const totalVotes = votesArr.reduce((sum, count) => sum + count, 0);

  const handleVote = async (optionIndex: number) => {
    if (isVoting || votedOption !== null) return;

    console.log('🗳️ PollCard: Starting vote process');
    console.log('📊 Poll ID:', poll.id, 'Option Index:', optionIndex);

    setIsVoting(true);

    try {
      // Call the vote API with the poll ID and option index (convert to bigint)
      const result = await voteApi(BigInt(poll.id), BigInt(optionIndex));
      console.log('📊 Vote API result:', result);

      if (result.success) {
        console.log('✅ Vote successful!');
        setVotedOption(optionIndex);
        onVote({ success: true });
      } else {
        console.error('❌ Vote failed:', result.error);
        onVote({
          success: false,
          error: typeof result.error === 'string' ? result.error : String(result.error)
        });
      }
    } catch (error) {
      console.error('💥 Vote error:', error);
      onVote({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to vote'
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getBarColor = (index: number) => {
    const colors = [
      'bg-blue-400', 'bg-green-400', 'bg-purple-400',
      'bg-yellow-400', 'bg-red-400', 'bg-indigo-400'
    ];
    return colors[index % colors.length];
  };

  const getButtonStyle = (index: number) => {
    const isSelected = votedOption === index;
    const hasVoted = votedOption !== null;

    if (isSelected) {
      return 'bg-green-500/20 border-green-400 text-green-100 ring-2 ring-green-400/50';
    }
    if (hasVoted) {
      return 'bg-white/5 border-white/10 text-white/70 cursor-not-allowed';
    }
    return 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:shadow-lg';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-xl font-bold text-white leading-tight flex-1 mr-4">
          {poll.question}
        </h3>
        <div className="flex items-center gap-2 text-white/70 text-sm bg-white/10 px-3 py-1 rounded-full">
          <Users size={16} />
          <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-6">
        {options.length > 0 ? options.map((option, index) => {
          const votes = votesArr[index] || 0;
          const percentage = getVotePercentage(votes);
          const isSelected = votedOption === index;

          // Option-level logging
          console.log(`➡️ Option ${index}:`, {
            option,
            votes,
            percentage,
            isSelected,
          });

          return (
            <div key={index} className="relative">
              <button
                onClick={() => handleVote(index)}
                disabled={isVoting || votedOption !== null}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${getButtonStyle(index)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {isSelected && (
                      <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                    )}
                    <span className="font-medium text-lg">{option}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {votes} vote{votes !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs opacity-75">
                      {percentage}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {totalVotes > 0 && (
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${isSelected ? 'bg-green-400' : getBarColor(index)
                        }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </button>
            </div>
          );
        }) : (
          <div className="text-yellow-400 text-center py-4">
            No options available for this poll.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-white/60 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} />
          <span>Poll #{poll.id}</span>
        </div>

        <div className="flex items-center gap-4">
          {votedOption !== null && (
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Voted</span>
            </div>
          )}
          {isVoting && (
            <div className="flex items-center gap-2 text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
              <span>Voting...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollCard;