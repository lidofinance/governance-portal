//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LidoLendExitBookActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lidoLendExitBookActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_morphoExitBook', internalType: 'address', type: 'address' },
      { name: '_erc4626ExitBook', internalType: 'address', type: 'address' },
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
        internalType: 'enum LidoLendExitBookActions.Action',
        type: 'uint8',
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetErc4626ExitBookAllowedPayload',
    outputs: [
      { name: 'vaults', internalType: 'address[]', type: 'address[]' },
      { name: 'allowed', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetMorphoExitBookAllowedPayload',
    outputs: [
      {
        name: 'marketParamsList',
        internalType: 'struct MarketParams[]',
        type: 'tuple[]',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'allowed', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'erc4626ExitBook',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'morphoExitBook',
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
