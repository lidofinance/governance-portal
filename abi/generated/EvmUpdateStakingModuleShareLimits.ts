//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EvmUpdateStakingModuleShareLimits
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const evmUpdateStakingModuleShareLimitsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_stakingRouter', internalType: 'address', type: 'address' },
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_maxStakeShareLimitIncrease',
        internalType: 'uint16',
        type: 'uint16',
      },
      {
        name: '_maxStakeShareLimitDecrease',
        internalType: 'uint16',
        type: 'uint16',
      },
      {
        name: '_maxPriorityExitShareThresholdIncrease',
        internalType: 'uint16',
        type: 'uint16',
      },
      {
        name: '_maxPriorityExitShareThresholdDecrease',
        internalType: 'uint16',
        type: 'uint16',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_creator', internalType: 'address', type: 'address' },
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'createEVMScript',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'decodeEVMScriptCallData',
    outputs: [
      {
        name: '',
        internalType:
          'struct IUpdateStakingModuleShareLimits.ModuleShareParams',
        type: 'tuple',
        components: [
          {
            name: 'currentStakeShareLimit',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'newStakeShareLimit',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'currentPriorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'newPriorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxPriorityExitShareThresholdDecrease',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxPriorityExitShareThresholdIncrease',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxStakeShareLimitDecrease',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxStakeShareLimitIncrease',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakingModuleId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'stakingRouter',
    outputs: [
      { name: '', internalType: 'contract IStakingRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'params',
        internalType:
          'struct IUpdateStakingModuleShareLimits.ModuleShareParams',
        type: 'tuple',
        components: [
          {
            name: 'currentStakeShareLimit',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'newStakeShareLimit',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'currentPriorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'newPriorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
        ],
      },
    ],
    name: 'validateParams',
    outputs: [],
    stateMutability: 'view',
  },
] as const;
