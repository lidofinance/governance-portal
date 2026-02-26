//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DualGovernanceLaunchVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dualGovernanceLaunchVerifierAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'params',
        internalType: 'struct DGLaunchVerifier.ConstructorParams',
        type: 'tuple',
        components: [
          { name: 'timelock', internalType: 'address', type: 'address' },
          { name: 'dualGovernance', internalType: 'address', type: 'address' },
          {
            name: 'emergencyGovernance',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'emergencyActivationCommittee',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'emergencyExecutionCommittee',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'emergencyProtectionEndDate',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'emergencyModeDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          { name: 'proposalsCount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'EmergencyModeEnabledAfterLaunch' },
  {
    type: 'error',
    inputs: [
      { name: 'paramName', internalType: 'string', type: 'string' },
      { name: 'expectedValue', internalType: 'address', type: 'address' },
      { name: 'actualValue', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidDGLaunchConfigAddress',
  },
  {
    type: 'error',
    inputs: [
      { name: 'paramName', internalType: 'string', type: 'string' },
      { name: 'expectedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'actualValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidDGLaunchConfigParameter',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'DGLaunchConfigurationValidated',
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
    name: 'EMERGENCY_ACTIVATION_COMMITTEE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EMERGENCY_EXECUTION_COMMITTEE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EMERGENCY_GOVERNANCE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EMERGENCY_MODE_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EMERGENCY_PROTECTION_END_DATE',
    outputs: [{ name: '', internalType: 'Timestamp', type: 'uint40' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PROPOSALS_COUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'verify',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
