//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LidoLendActivateMarket
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lidoLendActivateMarketAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_lidoLendOwner', internalType: 'address', type: 'address' },
      { name: '_irmRouter', internalType: 'address', type: 'address' },
      { name: '_configurableIrm', internalType: 'address', type: 'address' },
      {
        name: '_lidoLendMarketFactory',
        internalType: 'address',
        type: 'address',
      },
      { name: '_circuitBreaker', internalType: 'address', type: 'address' },
      {
        name: '_riskStewardDashboard',
        internalType: 'address',
        type: 'address',
      },
      { name: '_lidoLendPreseeder', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'circuitBreaker',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'configurableIrm',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
        name: 'params',
        internalType: 'struct LidoLendActivateMarket.ActivationParams',
        type: 'tuple',
        components: [
          {
            name: 'marketParams',
            internalType: 'struct MarketParams',
            type: 'tuple',
            components: [
              { name: 'loanToken', internalType: 'address', type: 'address' },
              {
                name: 'collateralToken',
                internalType: 'address',
                type: 'address',
              },
              { name: 'oracle', internalType: 'address', type: 'address' },
              { name: 'irm', internalType: 'address', type: 'address' },
              { name: 'lltv', internalType: 'uint256', type: 'uint256' },
            ],
          },
          { name: 'irmConfig', internalType: 'address', type: 'address' },
          { name: 'controller', internalType: 'address', type: 'address' },
          { name: 'enableSettlement', internalType: 'bool', type: 'bool' },
          { name: 'steward', internalType: 'address', type: 'address' },
          { name: 'pauserCommittee', internalType: 'address', type: 'address' },
          {
            name: 'preseedVault',
            internalType: 'contract ILidoLendERC4626',
            type: 'address',
          },
          { name: 'fee', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'irmRouter',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLend',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLendMarketFactory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLendOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLendPreseeder',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
