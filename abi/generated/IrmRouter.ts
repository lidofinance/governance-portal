//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IrmRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const irmRouterAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'morpho', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MORPHO',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketParams',
        internalType: 'struct MarketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'market',
        internalType: 'struct Market',
        type: 'tuple',
        components: [
          {
            name: 'totalSupplyAssets',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'totalSupplyShares',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'totalBorrowAssets',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'totalBorrowShares',
            internalType: 'uint128',
            type: 'uint128',
          },
          { name: 'lastUpdate', internalType: 'uint128', type: 'uint128' },
          { name: 'fee', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'borrowRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketParams',
        internalType: 'struct MarketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
      {
        name: 'market',
        internalType: 'struct Market',
        type: 'tuple',
        components: [
          {
            name: 'totalSupplyAssets',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'totalSupplyShares',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'totalBorrowAssets',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'totalBorrowShares',
            internalType: 'uint128',
            type: 'uint128',
          },
          { name: 'lastUpdate', internalType: 'uint128', type: 'uint128' },
          { name: 'fee', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    name: 'borrowRateView',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner_', internalType: 'address', type: 'address' },
      { name: 'manager_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isInitialized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'manager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'Id', type: 'bytes32' }],
    name: 'marketIrm',
    outputs: [{ name: '', internalType: 'contract IIrm', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newManager', internalType: 'address', type: 'address' }],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketParams',
        internalType: 'struct MarketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'irm', internalType: 'contract IIrm', type: 'address' },
    ],
    name: 'setMarketIrm',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'manager',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ManagerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'Id', type: 'bytes32', indexed: true },
      { name: 'irm', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'MarketIrmSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
] as const;
