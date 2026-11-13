//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LidoLendRiskStewardActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lidoLendRiskStewardActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      {
        name: '_riskStewardDashboard',
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
        name: 'action',
        internalType: 'enum LidoLendRiskStewardActions.Action',
        type: 'uint8',
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeRiskStewardPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'steward', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'riskStewardDashboard',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
