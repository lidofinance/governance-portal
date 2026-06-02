//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EmergencyGovernance
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const emergencyGovernanceAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'governance', internalType: 'address', type: 'address' },
      { name: 'timelock', internalType: 'contract ITimelock', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotGovernance',
  },
  {
    type: 'error',
    inputs: [{ name: 'governance', internalType: 'address', type: 'address' }],
    name: 'InvalidGovernance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timelock', internalType: 'contract ITimelock', type: 'address' },
    ],
    name: 'InvalidTimelock',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposerAccount',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalSubmitted',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GOVERNANCE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TIMELOCK',
    outputs: [
      { name: '', internalType: 'contract ITimelock', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'canScheduleProposal',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelAllPendingProposals',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [
      {
        name: 'calls',
        internalType: 'struct ExternalCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint96', type: 'uint96' },
          { name: 'payload', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'metadata', internalType: 'string', type: 'string' },
    ],
    name: 'submitProposal',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const;
