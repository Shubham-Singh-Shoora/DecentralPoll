use ic_cdk::api::caller;
use ic_cdk_macros::*;
use candid::{CandidType, Deserialize};
use std::collections::HashMap;

type PollId = u64;

#[derive(Clone, Debug, CandidType, Deserialize, serde::Serialize)]
pub struct Poll {
    pub id: PollId,
    pub question: String,
    pub options: Vec<String>,
    pub votes: Vec<u64>, // votes[i] = number of votes for options[i]
    pub voters: Vec<(String, usize)>, // (principal id, option index)
}

thread_local! {
    static POLLS: std::cell::RefCell<HashMap<PollId, Poll>> = std::cell::RefCell::new(HashMap::new());
}

#[init]
fn init() {}

#[update]
fn create_poll(question: String, options: Vec<String>) -> PollId {
    POLLS.with(|polls| {
        let mut polls = polls.borrow_mut();
        let id = (polls.len() as u64) + 1;
        let poll = Poll {
            id,
            question,
            options: options.clone(),
            votes: vec![0; options.len()],
            voters: vec![],
        };
        polls.insert(id, poll);
        id
    })
}

#[update]
fn vote(poll_id: PollId, option_index: usize) -> Result<(), String> {
    let principal = caller().to_string();
    POLLS.with(|polls| {
        let mut polls = polls.borrow_mut();
        if let Some(poll) = polls.get_mut(&poll_id) {
            if poll.voters.iter().any(|(pid, _)| *pid == principal) {
                return Err("Already voted".to_string());
            }
            if option_index >= poll.options.len() {
                return Err("Invalid option".to_string());
            }
            poll.votes[option_index] += 1;
            poll.voters.push((principal, option_index));
            Ok(())
        } else {
            Err("Poll not found".to_string())
        }
    })
}

#[query]
fn get_polls() -> Vec<Poll> {
    POLLS.with(|polls| polls.borrow().values().cloned().collect())
}

#[query]
fn get_poll(poll_id: PollId) -> Option<Poll> {
    POLLS.with(|polls| polls.borrow().get(&poll_id).cloned())
}