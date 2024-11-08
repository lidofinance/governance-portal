export const emergencyProtectedTimelockAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'sanityCheckParams',
        type: 'tuple',
        internalType: 'struct EmergencyProtectedTimelock.SanityCheckParams',
        components: [
          {
            name: 'maxAfterSubmitDelay',
            type: 'uint32',
            internalType: 'Duration',
          },
          {
            name: 'maxAfterScheduleDelay',
            type: 'uint32',
            internalType: 'Duration',
          },
          {
            name: 'maxEmergencyModeDuration',
            type: 'uint32',
            internalType: 'Duration',
          },
          {
            name: 'maxEmergencyProtectionDuration',
            type: 'uint32',
            internalType: 'Duration',
          },
        ],
      },
      { name: 'adminExecutor', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'MAX_AFTER_SCHEDULE_DELAY',
    inputs: [],
    outputs: [{ name: '', type: 'uint32', internalType: 'Duration' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MAX_AFTER_SUBMIT_DELAY',
    inputs: [],
    outputs: [{ name: '', type: 'uint32', internalType: 'Duration' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MAX_EMERGENCY_MODE_DURATION',
    inputs: [],
    outputs: [{ name: '', type: 'uint32', internalType: 'Duration' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MAX_EMERGENCY_PROTECTION_DURATION',
    inputs: [],
    outputs: [{ name: '', type: 'uint32', internalType: 'Duration' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'activateEmergencyMode',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'canExecute',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'canSchedule',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cancelAllNonExecutedProposals',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deactivateEmergencyMode',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'emergencyExecute',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'emergencyReset',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'execute',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAdminExecutor',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAfterScheduleDelay',
    inputs: [],
    outputs: [{ name: '', type: 'uint32', internalType: 'Duration' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAfterSubmitDelay',
    inputs: [],
    outputs: [{ name: '', type: 'uint32', internalType: 'Duration' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEmergencyActivationCommittee',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEmergencyExecutionCommittee',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEmergencyGovernance',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEmergencyProtectionDetails',
    inputs: [],
    outputs: [
      {
        name: 'details',
        type: 'tuple',
        internalType:
          'struct IEmergencyProtectedTimelock.EmergencyProtectionDetails',
        components: [
          {
            name: 'emergencyModeDuration',
            type: 'uint32',
            internalType: 'Duration',
          },
          {
            name: 'emergencyModeEndsAfter',
            type: 'uint40',
            internalType: 'Timestamp',
          },
          {
            name: 'emergencyProtectionEndsAfter',
            type: 'uint40',
            internalType: 'Timestamp',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGovernance',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProposal',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: 'proposalDetails',
        type: 'tuple',
        internalType: 'struct ITimelock.ProposalDetails',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'executor', type: 'address', internalType: 'address' },
          { name: 'submittedAt', type: 'uint40', internalType: 'Timestamp' },
          { name: 'scheduledAt', type: 'uint40', internalType: 'Timestamp' },
          { name: 'status', type: 'uint8', internalType: 'enum Status' },
        ],
      },
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ExternalCall[]',
        components: [
          { name: 'target', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint96', internalType: 'uint96' },
          { name: 'payload', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProposalCalls',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ExternalCall[]',
        components: [
          { name: 'target', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint96', internalType: 'uint96' },
          { name: 'payload', type: 'bytes', internalType: 'bytes' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProposalDetails',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: 'proposalDetails',
        type: 'tuple',
        internalType: 'struct ITimelock.ProposalDetails',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'executor', type: 'address', internalType: 'address' },
          { name: 'submittedAt', type: 'uint40', internalType: 'Timestamp' },
          { name: 'scheduledAt', type: 'uint40', internalType: 'Timestamp' },
          { name: 'status', type: 'uint8', internalType: 'enum Status' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProposalsCount',
    inputs: [],
    outputs: [{ name: 'count', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isEmergencyModeActive',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isEmergencyProtectionEnabled',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'schedule',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setEmergencyGovernance',
    inputs: [
      {
        name: 'emergencyGovernance',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setEmergencyModeDuration',
    inputs: [
      {
        name: 'emergencyModeDuration',
        type: 'uint32',
        internalType: 'Duration',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setEmergencyProtectionActivationCommittee',
    inputs: [
      {
        name: 'emergencyActivationCommittee',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setEmergencyProtectionEndDate',
    inputs: [
      {
        name: 'emergencyProtectionEndDate',
        type: 'uint40',
        internalType: 'Timestamp',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setEmergencyProtectionExecutionCommittee',
    inputs: [
      {
        name: 'emergencyExecutionCommittee',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGovernance',
    inputs: [
      { name: 'newGovernance', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setupDelays',
    inputs: [
      { name: 'afterSubmitDelay', type: 'uint32', internalType: 'Duration' },
      {
        name: 'afterScheduleDelay',
        type: 'uint32',
        internalType: 'Duration',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'submit',
    inputs: [
      { name: 'executor', type: 'address', internalType: 'address' },
      {
        name: 'calls',
        type: 'tuple[]',
        internalType: 'struct ExternalCall[]',
        components: [
          { name: 'target', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint96', internalType: 'uint96' },
          { name: 'payload', type: 'bytes', internalType: 'bytes' },
        ],
      },
      { name: 'metadata', type: 'string', internalType: 'string' },
    ],
    outputs: [
      { name: 'newProposalId', type: 'uint256', internalType: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferExecutorOwnership',
    inputs: [
      { name: 'executor', type: 'address', internalType: 'address' },
      { name: 'owner', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AfterScheduleDelaySet',
    inputs: [
      {
        name: 'newAfterScheduleDelay',
        type: 'uint32',
        indexed: false,
        internalType: 'Duration',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'AfterSubmitDelaySet',
    inputs: [
      {
        name: 'newAfterSubmitDelay',
        type: 'uint32',
        indexed: false,
        internalType: 'Duration',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyActivationCommitteeSet',
    inputs: [
      {
        name: 'newActivationCommittee',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyExecutionCommitteeSet',
    inputs: [
      {
        name: 'newActivationCommittee',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyGovernanceSet',
    inputs: [
      {
        name: 'newEmergencyGovernance',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyModeActivated',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyModeDeactivated',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyModeDurationSet',
    inputs: [
      {
        name: 'newEmergencyModeDuration',
        type: 'uint32',
        indexed: false,
        internalType: 'Duration',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EmergencyProtectionEndDateSet',
    inputs: [
      {
        name: 'newEmergencyProtectionEndDate',
        type: 'uint40',
        indexed: false,
        internalType: 'Timestamp',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'GovernanceSet',
    inputs: [
      {
        name: 'newGovernance',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProposalExecuted',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true, internalType: 'uint256' },
      {
        name: 'callResults',
        type: 'bytes[]',
        indexed: false,
        internalType: 'bytes[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProposalScheduled',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProposalSubmitted',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true, internalType: 'uint256' },
      {
        name: 'executor',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'calls',
        type: 'tuple[]',
        indexed: false,
        internalType: 'struct ExternalCall[]',
        components: [
          { name: 'target', type: 'address', internalType: 'address' },
          { name: 'value', type: 'uint96', internalType: 'uint96' },
          { name: 'payload', type: 'bytes', internalType: 'bytes' },
        ],
      },
      {
        name: 'metadata',
        type: 'string',
        indexed: false,
        internalType: 'string',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProposalsCancelledTill',
    inputs: [
      {
        name: 'proposalId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AfterScheduleDelayNotPassed',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'AfterSubmitDelayNotPassed',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'CallerIsNotAdminExecutor',
    inputs: [{ name: 'value', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'CallerIsNotEmergencyActivationCommittee',
    inputs: [{ name: 'caller', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'CallerIsNotEmergencyExecutionCommittee',
    inputs: [{ name: 'caller', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'CallerIsNotGovernance',
    inputs: [{ name: 'caller', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'EmergencyProtectionExpired',
    inputs: [
      { name: 'protectedTill', type: 'uint40', internalType: 'Timestamp' },
    ],
  },
  { type: 'error', name: 'EmptyCalls', inputs: [] },
  {
    type: 'error',
    name: 'InvalidAfterScheduleDelay',
    inputs: [{ name: 'value', type: 'uint32', internalType: 'Duration' }],
  },
  {
    type: 'error',
    name: 'InvalidAfterSubmitDelay',
    inputs: [{ name: 'value', type: 'uint32', internalType: 'Duration' }],
  },
  {
    type: 'error',
    name: 'InvalidEmergencyActivationCommittee',
    inputs: [{ name: 'committee', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidEmergencyExecutionCommittee',
    inputs: [{ name: 'committee', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidEmergencyGovernance',
    inputs: [{ name: 'governance', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'InvalidEmergencyModeDuration',
    inputs: [{ name: 'value', type: 'uint32', internalType: 'Duration' }],
  },
  {
    type: 'error',
    name: 'InvalidEmergencyProtectionEndDate',
    inputs: [{ name: 'value', type: 'uint40', internalType: 'Timestamp' }],
  },
  {
    type: 'error',
    name: 'InvalidGovernance',
    inputs: [{ name: 'value', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'ProposalNotFound',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'ProposalNotScheduled',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'error',
    name: 'ProposalNotSubmitted',
    inputs: [{ name: 'proposalId', type: 'uint256', internalType: 'uint256' }],
  },
  { type: 'error', name: 'TimestampOverflow', inputs: [] },
  {
    type: 'error',
    name: 'UnexpectedEmergencyModeState',
    inputs: [{ name: 'value', type: 'bool', internalType: 'bool' }],
  },
] as const;
