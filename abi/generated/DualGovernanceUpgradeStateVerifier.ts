//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DualGovernanceUpgradeStateVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dualGovernanceUpgradeStateVerifierAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'newDualGovernance', internalType: 'address', type: 'address' },
      {
        name: 'newTiebreakerCoreCommittee',
        internalType: 'address',
        type: 'address',
      },
      {
        name: 'configProviderForDisconnectedDualGovernance',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidConfigProviderForDisconnectedDualGovernance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidDualGovernanceAddress',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidProposalsCanceller',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidProposerExecutor',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'actualValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidProposesCount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidResealCommittee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'Duration', type: 'uint32' },
      { name: 'actualValue', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'InvalidTiebreakerActivationTimeout',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidTiebreakerCommittee',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidTiebreakerSealableWithdrawalBlockers',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expectedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'actualValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidTiebreakerSealableWithdrawalBlockersCount',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'DGUpgradeConfigurationValidated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN_EXECUTOR',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CONFIG_PROVIDER_FOR_DISCONNECTED_DUAL_GOVERNANCE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DUAL_GOVERNANCE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NEW_DUAL_GOVERNANCE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'NEW_TIEBREAKER_CORE_COMMITTEE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RESEAL_COMMITTEE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TIEBREAKER_ACTIVATION_TIMEOUT',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TIMELOCK',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TRIGGERABLE_WITHDRAWALS_GATEWAY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VALIDATORS_EXIT_BUS_ORACLE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VOTING',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WITHDRAWAL_QUEUE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'verify',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
