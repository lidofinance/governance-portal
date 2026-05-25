//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EvmAlterTiersInOperatorGrid
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const evmAlterTiersInOperatorGridAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_lidoLocator', internalType: 'address', type: 'address' },
      {
        name: '_defaultTierMaxShareLimit',
        internalType: 'uint256',
        type: 'uint256',
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
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      {
        name: '',
        internalType: 'struct TierParams[]',
        type: 'tuple[]',
        components: [
          { name: 'shareLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'reserveRatioBP', internalType: 'uint256', type: 'uint256' },
          {
            name: 'forcedRebalanceThresholdBP',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'infraFeeBP', internalType: 'uint256', type: 'uint256' },
          { name: 'liquidityFeeBP', internalType: 'uint256', type: 'uint256' },
          {
            name: 'reservationFeeBP',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'defaultTierMaxShareLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLocator',
    outputs: [
      { name: '', internalType: 'contract ILidoLocator', type: 'address' },
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
] as const;
