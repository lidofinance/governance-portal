//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SubmitExitRequestHashes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const submitExitRequestHashesAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      {
        name: '_nodeOperatorsRegistry',
        internalType: 'address',
        type: 'address',
      },
      { name: '_stakingRouter', internalType: 'address', type: 'address' },
      {
        name: '_validatorsExitBusOracle',
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
      {
        name: '',
        internalType: 'struct SubmitExitRequestHashesUtils.ExitRequestInput[]',
        type: 'tuple[]',
        components: [
          { name: 'moduleId', internalType: 'uint256', type: 'uint256' },
          { name: 'nodeOpId', internalType: 'uint256', type: 'uint256' },
          { name: 'valIndex', internalType: 'uint64', type: 'uint64' },
          { name: 'valPubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'valPubKeyIndex', internalType: 'uint256', type: 'uint256' },
        ],
      },
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
    inputs: [],
    name: 'validatorsExitBusOracle',
    outputs: [
      {
        name: '',
        internalType: 'contract IValidatorsExitBusOracle',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
] as const;
