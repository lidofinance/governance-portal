export const CHUNK_SIZE = 4999n; // Max RPC getLogs window
export const CONCURRENT_LIMIT = 3;
export const GET_LOGS_BLOCK_RANGE = 2499n; // Half of CHUNK_SIZE

// CHAINS values: Mainnet = 1, Hoodi = 560048
export const VOTING_ADDRESSES = {
  1: '0x2e59A20f205bB85a89C53f1936454680651E618e',
  560048: '0x49B3512c44891bef83F8967d075121Bd1b07a01B',
};

export const startVoteEventAbi = {
  anonymous: false,
  inputs: [
    { indexed: true, internalType: 'uint256', name: 'voteId', type: 'uint256' },
    { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
    {
      indexed: false,
      internalType: 'string',
      name: 'metadata',
      type: 'string',
    },
  ],
  name: 'StartVote',
  type: 'event',
};

export const executeVoteEventAbi = {
  anonymous: false,
  inputs: [
    { indexed: true, internalType: 'uint256', name: 'voteId', type: 'uint256' },
  ],
  name: 'ExecuteVote',
  type: 'event',
};

export const castVoteEventAbi = {
  anonymous: false,
  inputs: [
    { indexed: true, internalType: 'uint256', name: 'voteId', type: 'uint256' },
    { indexed: true, internalType: 'address', name: 'voter', type: 'address' },
    { indexed: false, internalType: 'bool', name: 'supports', type: 'bool' },
    {
      indexed: false,
      internalType: 'uint256',
      name: 'stake',
      type: 'uint256',
    },
  ],
  name: 'CastVote',
  type: 'event',
};

export const attemptCastVoteAsDelegateEventAbi = {
  anonymous: false,
  inputs: [
    { indexed: true, internalType: 'uint256', name: 'voteId', type: 'uint256' },
    {
      indexed: true,
      internalType: 'address',
      name: 'delegate',
      type: 'address',
    },
    {
      indexed: false,
      internalType: 'address[]',
      name: 'voters',
      type: 'address[]',
    },
  ],
  name: 'AttemptCastVoteAsDelegate',
  type: 'event',
};
