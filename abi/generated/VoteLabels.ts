//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VoteLabels
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const voteLabelsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'voting', internalType: 'address', type: 'address' },
      { name: 'admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FIRST_FILTERED_VOTE_ID',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VOTING',
    outputs: [{ name: '', internalType: 'contract IVoting', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'voteIds', internalType: 'uint256[]', type: 'uint256[]' }],
    name: 'getVoteLabels',
    outputs: [
      {
        name: 'labels',
        internalType: 'enum VoteLabels.Label[]',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'voteId', internalType: 'uint256', type: 'uint256' },
      { name: 'label', internalType: 'enum VoteLabels.Label', type: 'uint8' },
    ],
    name: 'setVoteLabel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'voteId', internalType: 'uint256', type: 'uint256' }],
    name: 'voteLabelOf',
    outputs: [
      { name: 'label', internalType: 'enum VoteLabels.Label', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voteId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'label',
        internalType: 'enum VoteLabels.Label',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'VoteLabelSet',
  },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  {
    type: 'error',
    inputs: [{ name: 'voteId', internalType: 'uint256', type: 'uint256' }],
    name: 'VoteNotFound',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
] as const;
