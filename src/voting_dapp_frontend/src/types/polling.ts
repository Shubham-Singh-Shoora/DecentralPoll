export interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
  creator?: string;
  created_at?: bigint;
  is_active?: boolean;
}

export interface VoteResult { success: boolean; error?: string; usingMockData?: boolean; }

export interface CreatePollResult {
  success: boolean;
  pollId?: number;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}