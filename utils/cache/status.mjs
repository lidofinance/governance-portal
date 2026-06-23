// Proposals
export const FINAL_STATUSES = new Set([3 /* Executed */, 4 /* Cancelled */]);
export const EXECUTED_STATUS = 3;

export const isCachedProposalFinal = (cached) => {
  const status = cached?.details?.status;
  return (
    status !== undefined &&
    FINAL_STATUSES.has(status) &&
    !!cached.proposalSubmittedEvent &&
    (status !== EXECUTED_STATUS || !!cached.proposalExecutedEvent)
  );
};

export const isCachedProposalComplete = (cached, proposal) =>
  isCachedProposalFinal(cached) &&
  cached.details.status === proposal.status;

// Votes
export const isVoteClosed = (voteData) => !voteData.open;

export const isCachedVoteComplete = (cached) => {
  if (!cached?.voteDetails || !cached.startVoteEvent) {
    return false;
  }
  if (cached.voteDetails.executed) {
    return Boolean(cached.executeVoteEvent);
  }
  return (
    cached.voteDetails.open === false && cached.voteDetails.canExecute === false
  );
};
