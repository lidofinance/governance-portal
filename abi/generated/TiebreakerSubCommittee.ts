//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TiebreakerSubCommittee
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tiebreakerSubCommitteeAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      {
        name: 'committeeMembers',
        internalType: 'address[]',
        type: 'address[]',
      },
      { name: 'executionQuorum', internalType: 'uint256', type: 'uint256' },
      {
        name: 'tiebreakerCoreCommittee',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AccountIsNotMember',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotMember',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'DuplicatedMember',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  {
    type: 'error',
    inputs: [{ name: 'hash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'HashAlreadyScheduled',
  },
  {
    type: 'error',
    inputs: [{ name: 'hash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'HashAlreadyUsed',
  },
  {
    type: 'error',
    inputs: [{ name: 'hash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'HashIsNotScheduled',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'InvalidMemberAccount',
  },
  { type: 'error', inputs: [], name: 'InvalidQuorum' },
  {
    type: 'error',
    inputs: [{ name: 'timelock', internalType: 'Duration', type: 'uint32' }],
    name: 'InvalidTimelockDuration',
  },
  { type: 'error', inputs: [], name: 'OffsetOutOfBounds' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ProposalDoesNotExist',
  },
  { type: 'error', inputs: [], name: 'QuorumIsNotReached' },
  { type: 'error', inputs: [], name: 'TimelockNotPassed' },
  { type: 'error', inputs: [], name: 'TimestampOverflow' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'HashScheduled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'HashUsed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MemberAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'member',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MemberRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'quorum',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'QuorumSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'timelockDuration',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'TimelockDurationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'hash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      { name: 'support', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'Voted',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TIEBREAKER_CORE_COMMITTEE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newMembers', internalType: 'address[]', type: 'address[]' },
      { name: 'executionQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addMembers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'approves',
    outputs: [{ name: 'approve', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'executeScheduleProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'executeSealableResume',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMembers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getOrderedKeys',
    outputs: [{ name: '', internalType: 'bytes32[]', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'key', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getProposal',
    outputs: [
      {
        name: '',
        internalType: 'struct Proposal',
        type: 'tuple',
        components: [
          { name: 'submittedAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'proposalType', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'index', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalAt',
    outputs: [
      {
        name: '',
        internalType: 'struct Proposal',
        type: 'tuple',
        components: [
          { name: 'submittedAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'proposalType', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'offset', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getProposals',
    outputs: [
      {
        name: 'proposals',
        internalType: 'struct Proposal[]',
        type: 'tuple[]',
        components: [
          { name: 'submittedAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'proposalType', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalsLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getScheduleProposalState',
    outputs: [
      { name: 'support', internalType: 'uint256', type: 'uint256' },
      { name: 'executionQuorum', internalType: 'uint256', type: 'uint256' },
      { name: 'quorumAt', internalType: 'Timestamp', type: 'uint40' },
      { name: 'isExecuted', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'getSealableResumeState',
    outputs: [
      { name: 'support', internalType: 'uint256', type: 'uint256' },
      { name: 'executionQuorum', internalType: 'uint256', type: 'uint256' },
      { name: 'quorumAt', internalType: 'Timestamp', type: 'uint40' },
      { name: 'isExecuted', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTimelockDuration',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'member', internalType: 'address', type: 'address' }],
    name: 'isMember',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'membersToRemove', internalType: 'address[]', type: 'address[]' },
      { name: 'executionQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeMembers',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'hash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'schedule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'scheduleProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'sealableResume',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newQuorum', internalType: 'uint256', type: 'uint256' }],
    name: 'setQuorum',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newTimelock', internalType: 'Duration', type: 'uint32' }],
    name: 'setTimelockDuration',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
