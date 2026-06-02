//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EvmReportWithdrawalsForSlashedValidators
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const evmReportWithdrawalsForSlashedValidatorsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_module', internalType: 'address', type: 'address' },
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
        internalType: 'struct WithdrawnValidatorInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
          { name: 'keyIndex', internalType: 'uint256', type: 'uint256' },
          { name: 'exitBalance', internalType: 'uint256', type: 'uint256' },
          { name: 'slashingPenalty', internalType: 'uint256', type: 'uint256' },
          { name: 'isSlashed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'module',
    outputs: [
      { name: '', internalType: 'contract IBaseModule', type: 'address' },
    ],
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
    name: 'trustedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const;
