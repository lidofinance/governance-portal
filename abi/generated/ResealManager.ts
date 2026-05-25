//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ResealManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const resealManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'emergencyProtectedTimelock',
        internalType: 'contract ITimelock',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'CallerIsNotGovernance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'SealableWrongPauseState' },
  {
    type: 'function',
    inputs: [],
    name: 'EMERGENCY_PROTECTED_TIMELOCK',
    outputs: [
      { name: '', internalType: 'contract ITimelock', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PAUSE_INFINITELY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'reseal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'sealable', internalType: 'address', type: 'address' }],
    name: 'resume',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
