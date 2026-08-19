//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StonksV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stonksV2Abi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'initParams_',
        internalType: 'struct Stonks.InitParams',
        type: 'tuple',
        components: [
          { name: 'admin', internalType: 'address', type: 'address' },
          { name: 'agent', internalType: 'address', type: 'address' },
          { name: 'manager', internalType: 'address', type: 'address' },
          { name: 'tokenFrom', internalType: 'address', type: 'address' },
          { name: 'tokenTo', internalType: 'address', type: 'address' },
          { name: 'amountConverter', internalType: 'address', type: 'address' },
          { name: 'orderSample', internalType: 'address', type: 'address' },
          {
            name: 'orderDurationInSeconds',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'marginInBasisPoints',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'priceToleranceInBasisPoints',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxImprovementInBasisPoints',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'allowPartialFill', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'InvalidAdminAddress',
  },
  {
    type: 'error',
    inputs: [{ name: 'agent', internalType: 'address', type: 'address' }],
    name: 'InvalidAgentAddress',
  },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amountConverter', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidAmountConverterAddress',
  },
  {
    type: 'error',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'max', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidOrderDuration',
  },
  {
    type: 'error',
    inputs: [{ name: 'orderSample', internalType: 'address', type: 'address' }],
    name: 'InvalidOrderSampleAddress',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenFrom', internalType: 'address', type: 'address' }],
    name: 'InvalidTokenFromAddress',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenTo', internalType: 'address', type: 'address' }],
    name: 'InvalidTokenToAddress',
  },
  {
    type: 'error',
    inputs: [
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MarginOverflowsAllowedLimit',
  },
  {
    type: 'error',
    inputs: [
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MaxImprovementOverflowsAllowedLimit',
  },
  {
    type: 'error',
    inputs: [
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MinimumPossibleBalanceNotMet',
  },
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
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PriceToleranceOverflowsAllowedLimit',
  },
  {
    type: 'error',
    inputs: [
      { name: 'available', internalType: 'uint256', type: 'uint256' },
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SellAmountExceedsBalance',
  },
  { type: 'error', inputs: [], name: 'StonksKilled' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'TokenFromNotSupported',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'TokenToNotSupported',
  },
  { type: 'error', inputs: [], name: 'TokensCannotBeSame' },
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
        name: 'allowPartialFill',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'AllowPartialFillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amountConverter',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AmountConverterSet',
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
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC1155Recovered',
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
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC20Recovered',
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
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ERC721Recovered',
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
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherRecovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'KillEngaged',
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
        name: 'marginInBasisPoints',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MarginInBasisPointsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxImprovementInBasisPoints',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxImprovementInBasisPointsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderContract',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'minBuyAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OrderContractCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderDurationInSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OrderDurationInSecondsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderSample',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'OrderSampleSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'priceToleranceInBasisPoints',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PriceToleranceInBasisPointsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'SignaturesPaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'by', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'SignaturesUnpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenFrom',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenFromSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenTo',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenToSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
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
    name: 'AGENT',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ALLOW_PARTIAL_FILL',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'AMOUNT_CONVERTER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MARGIN_DIFFERENCE_IN_BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MARGIN_IN_BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_IMPROVEMENT_IN_BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ORDER_DURATION_IN_SECONDS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ORDER_SAMPLE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PRICE_TOLERANCE_IN_BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RECEIVER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN_FROM',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN_TO',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'areSignaturesPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [{ name: 'amount_', internalType: 'uint256', type: 'uint256' }],
    name: 'estimateTradeOutput',
    outputs: [
      {
        name: 'estimatedTradeOutput',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'estimateTradeOutputFromCurrentBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxImprovementBps',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOrderParameters',
    outputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPriceTolerance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isCreationPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isKilled',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'killSwitch',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'pauseCreation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pauseSignatures',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minBuyAmount_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'placeOrder',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sellAmount_', internalType: 'uint256', type: 'uint256' },
      { name: 'minBuyAmount_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'placeOrderWithAmount',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'tokenId_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC1155',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'amount_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token_', internalType: 'address', type: 'address' },
      { name: 'tokenId_', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC721',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recoverEther',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [{ name: 'manager_', internalType: 'address', type: 'address' }],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpauseCreation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpauseSignatures',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
