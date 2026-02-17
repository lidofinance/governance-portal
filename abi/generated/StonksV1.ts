//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StonksV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stonksV1Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'agent_', internalType: 'address', type: 'address' },
      { name: 'manager_', internalType: 'address', type: 'address' },
      { name: 'tokenFrom_', internalType: 'address', type: 'address' },
      { name: 'tokenTo_', internalType: 'address', type: 'address' },
      { name: 'amountConverter_', internalType: 'address', type: 'address' },
      { name: 'orderSample_', internalType: 'address', type: 'address' },
      {
        name: 'orderDurationInSeconds_',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'marginInBasisPoints_',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'priceToleranceInBasisPoints_',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'agent_', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'manager', internalType: 'address', type: 'address' }],
    name: 'InvalidManagerAddress',
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
      { name: 'min', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MinimumPossibleBalanceNotMet',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'NotAgent',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'NotAgentOrManager',
  },
  {
    type: 'error',
    inputs: [
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PriceToleranceOverflowsAllowedLimit',
  },
  { type: 'error', inputs: [], name: 'TokensCannotBeSame' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AgentSet',
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
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
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
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
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
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_recipient',
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
        name: '_recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_amount',
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
    type: 'function',
    inputs: [],
    name: 'AGENT',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    name: 'MARGIN_IN_BASIS_POINTS',
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
    name: 'manager',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'manager_', internalType: 'address', type: 'address' }],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
