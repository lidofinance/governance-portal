//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EmergencyProtectedTimelock
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const emergencyProtectedTimelockAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'sanityCheckParams',
        internalType: 'struct EmergencyProtectedTimelock.SanityCheckParams',
        type: 'tuple',
        components: [
          {
            name: 'minExecutionDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'maxAfterSubmitDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'maxAfterScheduleDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'maxEmergencyModeDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'maxEmergencyProtectionDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
        ],
      },
      { name: 'adminExecutor', internalType: 'address', type: 'address' },
      { name: 'afterSubmitDelay', internalType: 'Duration', type: 'uint32' },
      { name: 'afterScheduleDelay', internalType: 'Duration', type: 'uint32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'AfterScheduleDelayNotPassed',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'AfterSubmitDelayNotPassed',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotAdminExecutor',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotEmergencyActivationCommittee',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotEmergencyExecutionCommittee',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotGovernance',
  },
  { type: 'error', inputs: [], name: 'DurationOverflow' },
  {
    type: 'error',
    inputs: [
      { name: 'protectedTill', internalType: 'Timestamp', type: 'uint40' },
    ],
    name: 'EmergencyProtectionExpired',
  },
  { type: 'error', inputs: [], name: 'EmptyCalls' },
  {
    type: 'error',
    inputs: [
      { name: 'adminExecutor', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidAdminExecutor',
  },
  {
    type: 'error',
    inputs: [
      { name: 'afterScheduleDelay', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'InvalidAfterScheduleDelay',
  },
  {
    type: 'error',
    inputs: [
      { name: 'afterSubmitDelay', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'InvalidAfterSubmitDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'committee', internalType: 'address', type: 'address' }],
    name: 'InvalidEmergencyActivationCommittee',
  },
  {
    type: 'error',
    inputs: [{ name: 'committee', internalType: 'address', type: 'address' }],
    name: 'InvalidEmergencyExecutionCommittee',
  },
  {
    type: 'error',
    inputs: [{ name: 'governance', internalType: 'address', type: 'address' }],
    name: 'InvalidEmergencyGovernance',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'Duration', type: 'uint32' }],
    name: 'InvalidEmergencyModeDuration',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'Timestamp', type: 'uint40' }],
    name: 'InvalidEmergencyProtectionEndDate',
  },
  {
    type: 'error',
    inputs: [
      { name: 'executionDelay', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'InvalidExecutionDelay',
  },
  {
    type: 'error',
    inputs: [{ name: 'governance', internalType: 'address', type: 'address' }],
    name: 'InvalidGovernance',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'MinExecutionDelayNotPassed',
  },
  { type: 'error', inputs: [], name: 'TimestampOverflow' },
  {
    type: 'error',
    inputs: [{ name: 'state', internalType: 'bool', type: 'bool' }],
    name: 'UnexpectedEmergencyModeState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'status', internalType: 'enum Status', type: 'uint8' },
    ],
    name: 'UnexpectedProposalStatus',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAdminExecutor',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminExecutorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAfterScheduleDelay',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'AfterScheduleDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAfterSubmitDelay',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'AfterSubmitDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newActivationCommittee',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EmergencyActivationCommitteeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newExecutionCommittee',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EmergencyExecutionCommitteeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newEmergencyGovernance',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EmergencyGovernanceSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'EmergencyModeActivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'EmergencyModeDeactivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newEmergencyModeDuration',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'EmergencyModeDurationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newEmergencyProtectionEndDate',
        internalType: 'Timestamp',
        type: 'uint40',
        indexed: false,
      },
    ],
    name: 'EmergencyProtectionEndDateSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newGovernance',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GovernanceSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'ProposalScheduled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'executor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'calls',
        internalType: 'struct ExternalCall[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint96', type: 'uint96' },
          { name: 'payload', internalType: 'bytes', type: 'bytes' },
        ],
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
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalsCancelledTill',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_AFTER_SCHEDULE_DELAY',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_AFTER_SUBMIT_DELAY',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_EMERGENCY_MODE_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_EMERGENCY_PROTECTION_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_EXECUTION_DELAY',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'activateEmergencyMode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'canExecute',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'canSchedule',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelAllNonExecutedProposals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deactivateEmergencyMode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'emergencyExecute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emergencyReset',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAdminExecutor',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAfterScheduleDelay',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAfterSubmitDelay',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmergencyActivationCommittee',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmergencyExecutionCommittee',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmergencyGovernance',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEmergencyProtectionDetails',
    outputs: [
      {
        name: 'details',
        internalType:
          'struct IEmergencyProtectedTimelock.EmergencyProtectionDetails',
        type: 'tuple',
        components: [
          {
            name: 'emergencyModeDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'emergencyModeEndsAfter',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'emergencyProtectionEndsAfter',
            internalType: 'Timestamp',
            type: 'uint40',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGovernance',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposal',
    outputs: [
      {
        name: 'proposalDetails',
        internalType: 'struct ITimelock.ProposalDetails',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'submittedAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'scheduledAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
        ],
      },
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
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalCalls',
    outputs: [
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
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'getProposalDetails',
    outputs: [
      {
        name: 'proposalDetails',
        internalType: 'struct ITimelock.ProposalDetails',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'submittedAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'scheduledAt', internalType: 'Timestamp', type: 'uint40' },
          { name: 'status', internalType: 'enum Status', type: 'uint8' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getProposalsCount',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isEmergencyModeActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isEmergencyProtectionEnabled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'schedule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAdminExecutor', internalType: 'address', type: 'address' },
    ],
    name: 'setAdminExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newAfterScheduleDelay',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'setAfterScheduleDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAfterSubmitDelay', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'setAfterSubmitDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newEmergencyGovernance',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setEmergencyGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newEmergencyModeDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'setEmergencyModeDuration',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newEmergencyActivationCommittee',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setEmergencyProtectionActivationCommittee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newEmergencyProtectionEndDate',
        internalType: 'Timestamp',
        type: 'uint40',
      },
    ],
    name: 'setEmergencyProtectionEndDate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newEmergencyExecutionCommittee',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setEmergencyProtectionExecutionCommittee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newGovernance', internalType: 'address', type: 'address' },
    ],
    name: 'setGovernance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'executor', internalType: 'address', type: 'address' },
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
    ],
    name: 'submit',
    outputs: [
      { name: 'newProposalId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'executor', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'transferExecutorOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
