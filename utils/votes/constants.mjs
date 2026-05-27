export const CHUNK_SIZE = 999n; // Max RPC getLogs window (drpc public mainnet caps at 1000)
export const CONCURRENT_LIMIT = 3;
export const BUILD_FETCH_CONCURRENCY = 10;
export const VOTES_PER_CHUNK = 10;
export const APPROX_BLOCK_TIME_SECONDS = 12n;
export const VOTE_END_BLOCK_BUFFER = 100n;
// CHAINS values: Mainnet = 1, Holesky = 17000, Hoodi = 560048
// Each chain maps to an array of voting contract addresses.
// Multiple addresses per chain are needed when there are separate deployments
// (e.g., Hoodi has "actual" and "test" Aragon Voting contracts).
export const VOTING_ADDRESSES = {
  1: ['0x2e59A20f205bB85a89C53f1936454680651E618e'],
  560048: [
    '0x49B3512c44891bef83F8967d075121Bd1b07a01B',
    '0x15379d72Ec5Ff5635F5148d6e0F4a4Dcf8756636',
  ],
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
