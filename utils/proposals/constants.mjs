export const CHUNK_SIZE = 4999n; // Max DPRC getLogs window
export const CONCURRENT_LIMIT = 3;
export const GET_LOGS_BLOCK_RANGE = 2499n; // Half of CHUNK_SIZE

export const proposalExecutedEventAbi = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'uint256',
      name: 'id',
      type: 'uint256',
    },
  ],
  name: 'ProposalExecuted',
  type: 'event',
};

export const proposalScheduledEventAbi = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'uint256',
      name: 'id',
      type: 'uint256',
    },
  ],
  name: 'ProposalScheduled',
  type: 'event',
};

export const proposalSubmittedEventAbi = {
  anonymous: false,
  inputs: [
    {
      indexed: true,
      internalType: 'address',
      name: 'proposerAccount',
      type: 'address',
    },
    {
      indexed: true,
      internalType: 'uint256',
      name: 'proposalId',
      type: 'uint256',
    },
    {
      indexed: false,
      internalType: 'string',
      name: 'metadata',
      type: 'string',
    },
  ],
  name: 'ProposalSubmitted',
  type: 'event',
};
