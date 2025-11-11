//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EvmIncreaseNodeOperatorStakingLimit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const evmIncreaseNodeOperatorStakingLimitAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_nodeOperatorsRegistry',
        internalType: 'address',
        type: 'address',
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
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingLimit', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nodeOperatorsRegistry',
    outputs: [
      {
        name: '',
        internalType: 'contract INodeOperatorsRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
] as const
