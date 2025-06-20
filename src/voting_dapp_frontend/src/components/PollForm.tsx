import React, { useState } from 'react';
import { Plus, Minus, Vote } from 'lucide-react';
import { createPoll } from '../api/icp_polling';

// Define the result type to match what we expect
interface CreatePollResult {
  success: boolean;
  pollId?: bigint;
  error?: string;
}

interface PollFormProps {
  onPollCreated: (result: CreatePollResult) => void;
}

const PollForm: React.FC<PollFormProps> = ({ onPollCreated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous debug info
    setDebugInfo('');

    console.log('🚀 Form submission started');
    console.log('📝 Question:', question);
    console.log('📋 Options:', options);

    // Validate question
    if (!question.trim()) {
      const error = 'Question is required';
      console.error('❌ Validation error:', error);
      setDebugInfo(`Validation Error: ${error}`);
      onPollCreated({ success: false, error });
      return;
    }

    // Validate options
    const validOptions = options.filter(opt => opt.trim());
    console.log('✅ Valid options:', validOptions);

    if (validOptions.length < 2) {
      const error = 'At least 2 options are required';
      console.error('❌ Validation error:', error);
      setDebugInfo(`Validation Error: ${error}`);
      onPollCreated({ success: false, error });
      return;
    }

    setIsSubmitting(true);
    setDebugInfo('Submitting to backend...');

    try {
      console.log('🔄 Calling createPoll function with:', {
        question: question.trim(),
        options: validOptions,
        questionType: typeof question.trim(),
        optionsType: typeof validOptions,
        optionsLength: validOptions.length
      });

      // Call the createPoll function - it returns a bigint (poll ID)
      const pollId = await createPoll(question.trim(), validOptions);

      console.log('✅ Poll created successfully!');
      console.log('🆔 Poll ID:', pollId);
      console.log('📊 Poll ID type:', typeof pollId);

      // Create success result
      const successResult: CreatePollResult = {
        success: true,
        pollId: pollId
      };

      setDebugInfo(`Success! Poll created with ID: ${pollId}`);
      onPollCreated(successResult);

      // Reset form on success
      setQuestion('');
      setOptions(['', '']);

    } catch (error) {
      console.error('💥 Exception caught:', error);
      console.error('🔍 Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        errorType: typeof error,
        errorConstructor: error?.constructor?.name
      });

      const errorMessage = error instanceof Error ? error.message : 'Failed to create poll';
      setDebugInfo(`Exception: ${errorMessage}`);

      onPollCreated({
        success: false,
        error: errorMessage
      });
    } finally {
      setIsSubmitting(false);
      console.log('🏁 Form submission completed');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Vote className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Create New Poll</h2>
      </div>



      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-white/90 mb-2">
            Poll Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask?"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Poll Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  disabled={isSubmitting}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    <Minus size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {options.length < 6 && (
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
              disabled={isSubmitting}
            >
              <Plus size={16} />
              Add Option
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !question.trim() || options.filter(opt => opt.trim()).length < 2}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Poll...
            </div>
          ) : (
            'Create Poll'
          )}
        </button>
      </form>

    </div>
  );
};

export default PollForm;