//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DualGovernance
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dualGovernanceAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'components',
        internalType: 'struct DualGovernance.DualGovernanceComponents',
        type: 'tuple',
        components: [
          {
            name: 'timelock',
            internalType: 'contract ITimelock',
            type: 'address',
          },
          {
            name: 'resealManager',
            internalType: 'contract IResealManager',
            type: 'address',
          },
          {
            name: 'configProvider',
            internalType: 'contract IDualGovernanceConfigProvider',
            type: 'address',
          },
        ],
      },
      {
        name: 'signallingTokens',
        internalType: 'struct DualGovernance.SignallingTokens',
        type: 'tuple',
        components: [
          { name: 'stETH', internalType: 'contract IStETH', type: 'address' },
          { name: 'wstETH', internalType: 'contract IWstETH', type: 'address' },
          {
            name: 'withdrawalQueue',
            internalType: 'contract IWithdrawalQueue',
            type: 'address',
          },
        ],
      },
      {
        name: 'sanityCheckParams',
        internalType: 'struct DualGovernance.SanityCheckParams',
        type: 'tuple',
        components: [
          {
            name: 'minWithdrawalsBatchSize',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minTiebreakerActivationTimeout',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'maxTiebreakerActivationTimeout',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'maxSealableWithdrawalBlockersCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxMinAssetsLockDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotAdminExecutor',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotProposalsCanceller',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotResealCommittee',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotTiebreakerCommittee',
  },
  { type: 'error', inputs: [], name: 'DurationOverflow' },
  { type: 'error', inputs: [], name: 'DurationUnderflow' },
  { type: 'error', inputs: [], name: 'ERC1167FailedCreateClone' },
  {
    type: 'error',
    inputs: [{ name: 'executor', internalType: 'address', type: 'address' }],
    name: 'ExecutorNotRegistered',
  },
  { type: 'error', inputs: [], name: 'IndexOneBasedOverflow' },
  { type: 'error', inputs: [], name: 'IndexOneBasedUnderflow' },
  {
    type: 'error',
    inputs: [
      {
        name: 'configProvider',
        internalType: 'contract IDualGovernanceConfigProvider',
        type: 'address',
      },
    ],
    name: 'InvalidConfigProvider',
  },
  {
    type: 'error',
    inputs: [{ name: 'executor', internalType: 'address', type: 'address' }],
    name: 'InvalidExecutor',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'minAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidMinAssetsLockDuration',
  },
  {
    type: 'error',
    inputs: [{ name: 'canceller', internalType: 'address', type: 'address' }],
    name: 'InvalidProposalsCanceller',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidProposerAccount',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'rageQuitEthWithdrawalsMinDelay',
        internalType: 'Duration',
        type: 'uint32',
      },
      {
        name: 'rageQuitEthWithdrawalsMaxDelay',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidRageQuitEthWithdrawalsDelayRange',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'firstSealRageQuitSupport',
        internalType: 'PercentD16',
        type: 'uint128',
      },
      {
        name: 'secondSealRageQuitSupport',
        internalType: 'PercentD16',
        type: 'uint128',
      },
    ],
    name: 'InvalidRageQuitSupportRange',
  },
  {
    type: 'error',
    inputs: [
      { name: 'resealCommittee', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidResealCommittee',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'resealManager',
        internalType: 'contract IResealManager',
        type: 'address',
      },
    ],
    name: 'InvalidResealManager',
  },
  {
    type: 'error',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'InvalidSealable',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'secondSealRageQuitSupport',
        internalType: 'PercentD16',
        type: 'uint128',
      },
    ],
    name: 'InvalidSecondSealRageQuitSupport',
  },
  {
    type: 'error',
    inputs: [{ name: 'timeout', internalType: 'Duration', type: 'uint32' }],
    name: 'InvalidTiebreakerActivationTimeout',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'minTiebreakerActivationTimeout',
        internalType: 'Duration',
        type: 'uint32',
      },
      {
        name: 'maxTiebreakerActivationTimeout',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidTiebreakerActivationTimeoutBounds',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'InvalidTiebreakerCommittee',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'vetoSignallingMinDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
      {
        name: 'vetoSignallingMaxDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidVetoSignallingDurationRange',
  },
  { type: 'error', inputs: [], name: 'PercentD16Overflow' },
  { type: 'error', inputs: [], name: 'PercentD16Underflow' },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'ProposalSchedulingBlocked',
  },
  { type: 'error', inputs: [], name: 'ProposalSubmissionBlocked' },
  {
    type: 'error',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
    ],
    name: 'ProposerAlreadyRegistered',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
    ],
    name: 'ProposerNotRegistered',
  },
  { type: 'error', inputs: [], name: 'ResealIsNotAllowedInNormalState' },
  {
    type: 'error',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'SealableWithdrawalBlockerAlreadyAdded',
  },
  {
    type: 'error',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'SealableWithdrawalBlockerNotFound',
  },
  { type: 'error', inputs: [], name: 'SealableWithdrawalBlockersLimitReached' },
  { type: 'error', inputs: [], name: 'TiebreakNotAllowed' },
  { type: 'error', inputs: [], name: 'TimestampOverflow' },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'CancelAllPendingProposalsExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'CancelAllPendingProposalsSkipped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newConfigProvider',
        internalType: 'contract IDualGovernanceConfigProvider',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ConfigProviderSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'from',
        internalType: 'enum State',
        type: 'uint8',
        indexed: true,
      },
      { name: 'to', internalType: 'enum State', type: 'uint8', indexed: true },
      {
        name: 'state',
        internalType: 'struct DualGovernanceStateMachine.Context',
        type: 'tuple',
        components: [
          { name: 'state', internalType: 'enum State', type: 'uint8' },
          { name: 'enteredAt', internalType: 'Timestamp', type: 'uint40' },
          {
            name: 'vetoSignallingActivatedAt',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'signallingEscrow',
            internalType: 'contract ISignallingEscrow',
            type: 'address',
          },
          { name: 'rageQuitRound', internalType: 'uint8', type: 'uint8' },
          {
            name: 'vetoSignallingReactivationTime',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'normalOrVetoCooldownExitedAt',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'rageQuitEscrow',
            internalType: 'contract IRageQuitEscrow',
            type: 'address',
          },
          {
            name: 'configProvider',
            internalType: 'contract IDualGovernanceConfigProvider',
            type: 'address',
          },
        ],
        indexed: false,
      },
    ],
    name: 'DualGovernanceStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrowMasterCopy',
        internalType: 'contract IEscrowBase',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EscrowMasterCopyDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'escrow',
        internalType: 'contract ISignallingEscrow',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'NewSignallingEscrowDeployed',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalsCanceller',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ProposalsCancellerSet',
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
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ProposerExecutorSet',
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
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ProposerRegistered',
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
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ProposerUnregistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'resealCommittee',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ResealCommitteeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'resealManager',
        internalType: 'contract IResealManager',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ResealManagerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sealable',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SealableWithdrawalBlockerAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sealable',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SealableWithdrawalBlockerRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newTiebreakerActivationTimeout',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'TiebreakerActivationTimeoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newTiebreakerCommittee',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TiebreakerCommitteeSet',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SEALABLE_WITHDRAWAL_BLOCKERS_COUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_TIEBREAKER_ACTIVATION_TIMEOUT',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_TIEBREAKER_ACTIVATION_TIMEOUT',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
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
    inputs: [],
    name: 'activateNextState',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'sealableWithdrawalBlocker',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'addTiebreakerSealableWithdrawalBlocker',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'canCancelAllPendingProposals',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    name: 'canSubmitProposal',
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
    inputs: [],
    name: 'getConfigProvider',
    outputs: [
      {
        name: '',
        internalType: 'contract IDualGovernanceConfigProvider',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEffectiveState',
    outputs: [
      { name: 'effectiveState', internalType: 'enum State', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPersistedState',
    outputs: [
      { name: 'persistedState', internalType: 'enum State', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalsCanceller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
    ],
    name: 'getProposer',
    outputs: [
      {
        name: 'proposer',
        internalType: 'struct Proposers.Proposer',
        type: 'tuple',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'executor', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposers',
    outputs: [
      {
        name: 'proposers',
        internalType: 'struct Proposers.Proposer[]',
        type: 'tuple[]',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'executor', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRageQuitEscrow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getResealCommittee',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getResealManager',
    outputs: [
      { name: '', internalType: 'contract IResealManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStateDetails',
    outputs: [
      {
        name: 'stateDetails',
        internalType: 'struct IDualGovernance.StateDetails',
        type: 'tuple',
        components: [
          { name: 'effectiveState', internalType: 'enum State', type: 'uint8' },
          { name: 'persistedState', internalType: 'enum State', type: 'uint8' },
          {
            name: 'persistedStateEnteredAt',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'vetoSignallingActivatedAt',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'vetoSignallingReactivationTime',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'normalOrVetoCooldownExitedAt',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          { name: 'rageQuitRound', internalType: 'uint256', type: 'uint256' },
          {
            name: 'vetoSignallingDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTiebreakerDetails',
    outputs: [
      {
        name: 'tiebreakerState',
        internalType: 'struct ITiebreaker.TiebreakerDetails',
        type: 'tuple',
        components: [
          { name: 'isTie', internalType: 'bool', type: 'bool' },
          {
            name: 'tiebreakerCommittee',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tiebreakerActivationTimeout',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'sealableWithdrawalBlockers',
            internalType: 'address[]',
            type: 'address[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVetoSignallingEscrow',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'executor', internalType: 'address', type: 'address' }],
    name: 'isExecutor',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
    ],
    name: 'isProposer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
      { name: 'executor', internalType: 'address', type: 'address' },
    ],
    name: 'registerProposer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'sealableWithdrawalBlocker',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'removeTiebreakerSealableWithdrawalBlocker',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'resealSealable',
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
    inputs: [
      {
        name: 'newConfigProvider',
        internalType: 'contract IDualGovernanceConfigProvider',
        type: 'address',
      },
    ],
    name: 'setConfigProvider',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newProposalsCanceller',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setProposalsCanceller',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
      { name: 'newExecutor', internalType: 'address', type: 'address' },
    ],
    name: 'setProposerExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newResealCommittee', internalType: 'address', type: 'address' },
    ],
    name: 'setResealCommittee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newResealManager',
        internalType: 'contract IResealManager',
        type: 'address',
      },
    ],
    name: 'setResealManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newTiebreakerActivationTimeout',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'setTiebreakerActivationTimeout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newTiebreakerCommittee',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setTiebreakerCommittee',
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
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'tiebreakerResumeSealable',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'tiebreakerScheduleProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposerAccount', internalType: 'address', type: 'address' },
    ],
    name: 'unregisterProposer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
