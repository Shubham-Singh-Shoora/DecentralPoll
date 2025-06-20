import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/voting_dapp_backend/voting_dapp_backend.did.js";
import type { _SERVICE } from "../../../declarations/voting_dapp_backend/voting_dapp_backend.did.d.ts";
import { Poll } from '../types/polling';

// Get canister ID from Vite env variable with fallback
const canisterId = import.meta.env.VITE_VOTING_DAPP_BACKEND_CANISTER_ID || "uxrrr-q7777-77774-qaaaq-cai";

// Validate that we have a canister ID
if (!canisterId) {
  throw new Error("Canister ID is required. Please set VITE_VOTING_DAPP_BACKEND_CANISTER_ID in your .env.local file");
}

// Detect local or mainnet using Vite's environment variables
const agent = new HttpAgent({
  host: import.meta.env.DEV ? "http://localhost:4943" : "https://ic0.app"
});

if (import.meta.env.DEV) {
  console.log("🔑 Fetching root key for local development...");
  agent.fetchRootKey().catch(err =>
    console.warn("⚠️ Unable to fetch root key. Check if dfx is running locally:", err)
  );
}

// Create actor with proper typing
export const pollingActor = Actor.createActor<_SERVICE>(idlFactory, {
  agent,
  canisterId
});


/**
 * Create a new poll
 * Returns the poll ID as bigint
 */
export const createPoll = async (question: string, options: string[]): Promise<bigint> => {
  try {
    console.log("🚀 createPoll called with:", { question, options });
    console.log("📊 Parameter types:", {
      questionType: typeof question,
      optionsType: typeof options,
      optionsLength: options.length,
    });

    // Validate inputs
    if (!question || typeof question !== 'string') {
      throw new Error('Question must be a non-empty string');
    }

    if (!Array.isArray(options)) {
      throw new Error('Options must be an array');
    }

    if (options.length < 2) {
      throw new Error('At least 2 options are required');
    }

    // Check if all options are strings
    const invalidOptions = options.filter(opt => typeof opt !== 'string' || !opt.trim());
    if (invalidOptions.length > 0) {
      throw new Error('All options must be non-empty strings');
    }



    // Call the backend method
    const result = await pollingActor.create_poll(question, options);

    // The backend returns a bigint directly
    if (typeof result === 'bigint') {
      console.log("✅ Poll created with ID:", result);
      return result;
    } else {
      // Handle unexpected result type
      console.error("❌ Unexpected result type:", typeof result, result);
      throw new Error(`Backend returned unexpected type: ${typeof result}`);
    }

  } catch (error) {
    console.error("💥 Error in createPoll:");
    console.error("🔍 Error details:", error);

    if (error instanceof Error) {
      console.error("📝 Error message:", error.message);
      console.error("📚 Error stack:", error.stack);
    }

    // Re-throw with context
    throw new Error(`Failed to create poll: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Fetch all polls
 */
export const getPolls = async (): Promise<Poll[]> => {
  try {
    console.log("📋 Getting all polls...");
    const result = await pollingActor.get_polls();
    console.log("✅ Retrieved polls:", result);

    // Convert each poll to UI-friendly format:
    const formatted = result.map((poll: any) => {
      // Defensive conversions
      let votes: number[] = [];
      if (poll.votes) {
        if (Array.isArray(poll.votes)) {
          votes = poll.votes.map((v: any) => Number(v));
        } else if (poll.votes.constructor && poll.votes.constructor.name === "BigUint64Array") {
          votes = Array.from(poll.votes).map((v: any) => Number(v));
        }
      }
      return {
        id: typeof poll.id === "bigint" ? Number(poll.id) : poll.id,
        question: poll.question ?? "",
        options: Array.isArray(poll.options) ? poll.options : [],
        votes,
        voters: Array.isArray(poll.voters) ? poll.voters : [],
      };
    });
    console.log("✅ Formatted polls for UI:", formatted);
    return formatted;
  } catch (error) {
    console.error("💥 Error fetching polls:", error);
    throw new Error(`Failed to fetch polls: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a specific poll by ID
 */
export const getPoll = async (pollId: bigint) => {
  try {
    console.log("🔍 Getting poll with ID:", pollId);
    const result = await pollingActor.get_poll(pollId);
    console.log("✅ Retrieved poll:", result);
    return result;
  } catch (error) {
    console.error("💥 Error getting poll:", error);
    throw new Error(`Failed to get poll: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Vote on a poll
 * @param pollId - The poll ID as bigint
 * @param optionIndex - The option index as bigint (0-based)
 */
export const vote = async (pollId: bigint, optionIndex: bigint) => {
  try {
    console.log("🗳️ Voting on poll:", { pollId, optionIndex });
    const result = await pollingActor.vote(pollId, optionIndex);
    console.log("✅ Vote result:", result);

    // Handle Result type from backend: { Ok: null } | { Err: string }
    if (result && typeof result === 'object') {
      if ('Ok' in result) {
        return { success: true };
      } else if ('Err' in result) {
        return { success: false, error: result.Err };
      }
    }

    // Fallback for unexpected result format
    return { success: true, result };
  } catch (error) {
    console.error("💥 Error voting:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Helper function to convert number to bigint for backwards compatibility
export const votePoll = async (pollId: number, optionIndex: number) => {
  return await vote(BigInt(pollId), BigInt(optionIndex));
};