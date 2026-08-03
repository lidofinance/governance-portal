//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OracleRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oracleRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'admin_', internalType: 'address', type: 'address' },
      { name: 'feedRegistry_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'EthUsdBridgeMissing' },
  {
    type: 'error',
    inputs: [
      { name: 'expectedAggregator', internalType: 'address', type: 'address' },
      { name: 'actualAggregator', internalType: 'address', type: 'address' },
      { name: 'expectedDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'actualDecimals', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'FeedConfigOutOfSync',
  },
  {
    type: 'error',
    inputs: [
      { name: 'base', internalType: 'address', type: 'address' },
      { name: 'quote', internalType: 'address', type: 'address' },
    ],
    name: 'FeedMissing',
  },
  {
    type: 'error',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'InvalidAdminAddress',
  },
  { type: 'error', inputs: [], name: 'InvalidAggregatorDecimals' },
  {
    type: 'error',
    inputs: [
      { name: 'feedRegistry', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidFeedRegistryAddress',
  },
  { type: 'error', inputs: [], name: 'InvalidStaleness' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'InvalidTokenAddress',
  },
  { type: 'error', inputs: [], name: 'InvalidTokenDecimals' },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'NotAdmin',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'NotAdminOrManager',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'NotEmergencyOperator',
  },
  {
    type: 'error',
    inputs: [
      { name: 'aggregator', internalType: 'address', type: 'address' },
      { name: 'answer', internalType: 'int256', type: 'int256' },
    ],
    name: 'OracleBadAnswer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'aggregator', internalType: 'address', type: 'address' },
      { name: 'feedDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'unitDecimals', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'OracleQuantizedToZero',
  },
  {
    type: 'error',
    inputs: [
      { name: 'aggregator', internalType: 'address', type: 'address' },
      { name: 'lastUpdate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'OracleStale',
  },
  {
    type: 'error',
    inputs: [
      { name: 'aggregator', internalType: 'address', type: 'address' },
      { name: 'roundId', internalType: 'uint80', type: 'uint80' },
      { name: 'answeredInRound', internalType: 'uint80', type: 'uint80' },
    ],
    name: 'OracleUnanswered',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'TokenNotConfigured',
  },
  {
    type: 'error',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'currentState', internalType: 'bool', type: 'bool' },
    ],
    name: 'TokenStateUnchanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'emergencyOperator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'EmergencyOperatorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'aggregator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'aggregatorDecimals',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'maxStalenessSeconds',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'scaleNumerator',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'scaleDenominator',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'EthUsdBridgeConfigured',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'manager',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ManagerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'isActive', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'TokenActiveUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'primaryQuote',
        internalType: 'enum IOracleRouter.QuoteDenomination',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'aggregator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'aggregatorDecimals',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'maxStalenessSeconds',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'tokenDecimals',
        internalType: 'uint8',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'scaleNumerator',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'scaleDenominator',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      { name: 'isActive', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'TokenConfigured',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'overrideSeconds',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'TokenEthUsdStalenessOverridden',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADMIN',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEED_REGISTRY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_DECIMALS',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRICE_DECIMALS',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRICE_UNIT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'emergencyOperator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ethUsdBridge',
    outputs: [
      { name: 'scaleNumerator', internalType: 'uint128', type: 'uint128' },
      { name: 'scaleDenominator', internalType: 'uint128', type: 'uint128' },
      { name: 'aggregator', internalType: 'address', type: 'address' },
      { name: 'maxStalenessSeconds', internalType: 'uint32', type: 'uint32' },
      { name: 'aggregatorDecimals', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'baseToken_', internalType: 'address', type: 'address' },
      { name: 'quoteToken_', internalType: 'address', type: 'address' },
      {
        name: 'quote_',
        internalType: 'enum IOracleRouter.QuoteDenomination',
        type: 'uint8',
      },
    ],
    name: 'getPricesAndDecimals',
    outputs: [
      { name: 'basePrice', internalType: 'uint256', type: 'uint256' },
      { name: 'quotePrice', internalType: 'uint256', type: 'uint256' },
      { name: 'baseTokenDecimals', internalType: 'uint8', type: 'uint8' },
      { name: 'quoteTokenDecimals', internalType: 'uint8', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'baseToken_', internalType: 'address', type: 'address' },
      { name: 'quoteToken_', internalType: 'address', type: 'address' },
    ],
    name: 'getUsdPrices',
    outputs: [
      { name: 'baseUsdPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'quoteUsdPrice', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isBridgeInSync',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token_', internalType: 'address', type: 'address' }],
    name: 'isFeedInSync',
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
    inputs: [
      { name: 'emergencyOperator_', internalType: 'address', type: 'address' },
    ],
    name: 'setEmergencyOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'maxStalenessSeconds_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setEthUsdBridge',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'manager_', internalType: 'address', type: 'address' }],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'isActive_', internalType: 'bool', type: 'bool' },
    ],
    name: 'setTokenActive',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'overrideSeconds_', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setTokenEthUsdStalenessOverride',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      {
        name: 'primaryQuote_',
        internalType: 'enum IOracleRouter.QuoteDenomination',
        type: 'uint8',
      },
      { name: 'maxStalenessSeconds_', internalType: 'uint32', type: 'uint32' },
      { name: 'isActive_', internalType: 'bool', type: 'bool' },
    ],
    name: 'setTokenFeed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'syncEthUsdBridge',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token_', internalType: 'address', type: 'address' }],
    name: 'syncTokenFeed',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'tokenConfig',
    outputs: [
      {
        name: 'primaryFeed',
        internalType: 'struct OracleRouter.FeedConfig',
        type: 'tuple',
        components: [
          { name: 'scaleNumerator', internalType: 'uint128', type: 'uint128' },
          {
            name: 'scaleDenominator',
            internalType: 'uint128',
            type: 'uint128',
          },
          { name: 'aggregator', internalType: 'address', type: 'address' },
          {
            name: 'maxStalenessSeconds',
            internalType: 'uint32',
            type: 'uint32',
          },
          { name: 'aggregatorDecimals', internalType: 'uint8', type: 'uint8' },
        ],
      },
      {
        name: 'ethUsdMaxStalenessOverrideSeconds',
        internalType: 'uint32',
        type: 'uint32',
      },
      { name: 'tokenDecimals', internalType: 'uint8', type: 'uint8' },
      {
        name: 'primaryQuote',
        internalType: 'enum IOracleRouter.QuoteDenomination',
        type: 'uint8',
      },
      { name: 'isActive', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
] as const;
