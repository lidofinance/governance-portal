//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StonksOrder
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stonksOrderAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'agent_', internalType: 'address', type: 'address' },
      { name: 'relayer_', internalType: 'address', type: 'address' },
      { name: 'domainSeparator_', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'CannotRecoverTokenFrom',
  },
  {
    type: 'error',
    inputs: [{ name: 'agent_', internalType: 'address', type: 'address' }],
    name: 'InvalidAgentAddress',
  },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidAmountToRecover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'bytes32', type: 'bytes32' },
      { name: 'actual', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'InvalidOrderHash',
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
  { type: 'error', inputs: [], name: 'OrderAlreadyInitialized' },
  {
    type: 'error',
    inputs: [{ name: 'validTo', internalType: 'uint256', type: 'uint256' }],
    name: 'OrderExpired',
  },
  {
    type: 'error',
    inputs: [
      { name: 'validTo', internalType: 'uint256', type: 'uint256' },
      { name: 'currentTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'OrderNotExpired',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxAcceptedAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'actualAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PriceConditionChanged',
  },
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
        name: 'domainSeparator',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'DomainSeparatorSet',
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
        name: 'order',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'orderHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'orderData',
        internalType: 'struct GPv2Order.Data',
        type: 'tuple',
        components: [
          {
            name: 'sellToken',
            internalType: 'contract IERC20Metadata',
            type: 'address',
          },
          {
            name: 'buyToken',
            internalType: 'contract IERC20Metadata',
            type: 'address',
          },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'sellAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'buyAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'validTo', internalType: 'uint32', type: 'uint32' },
          { name: 'appData', internalType: 'bytes32', type: 'bytes32' },
          { name: 'feeAmount', internalType: 'uint256', type: 'uint256' },
          { name: 'kind', internalType: 'bytes32', type: 'bytes32' },
          { name: 'partiallyFillable', internalType: 'bool', type: 'bool' },
          {
            name: 'sellTokenBalance',
            internalType: 'bytes32',
            type: 'bytes32',
          },
          { name: 'buyTokenBalance', internalType: 'bytes32', type: 'bytes32' },
        ],
        indexed: false,
      },
    ],
    name: 'OrderCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'relayer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RelayerSet',
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
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RELAYER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOrderDetails',
    outputs: [
      { name: 'hash_', internalType: 'bytes32', type: 'bytes32' },
      { name: 'tokenFrom_', internalType: 'address', type: 'address' },
      { name: 'tokenTo_', internalType: 'address', type: 'address' },
      { name: 'sellAmount_', internalType: 'uint256', type: 'uint256' },
      { name: 'buyAmount_', internalType: 'uint256', type: 'uint256' },
      { name: 'validTo_', internalType: 'uint32', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'minBuyAmount_', internalType: 'uint256', type: 'uint256' },
      { name: 'manager_', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hash_', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'magicValue', internalType: 'bytes4', type: 'bytes4' }],
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
    inputs: [],
    name: 'recoverTokenFrom',
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
    name: 'stonks',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const;
