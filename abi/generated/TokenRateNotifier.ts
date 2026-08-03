//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TokenRateNotifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const tokenRateNotifierAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'initialOwner_', internalType: 'address', type: 'address' },
      { name: 'tokenRateProvider_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ErrorAddExistedObserver' },
  { type: 'error', inputs: [], name: 'ErrorBadObserverInterface' },
  { type: 'error', inputs: [], name: 'ErrorMaxObserversCountExceeded' },
  { type: 'error', inputs: [], name: 'ErrorNoObserverToRemove' },
  { type: 'error', inputs: [], name: 'ErrorNotAuthorizedRebaseCaller' },
  {
    type: 'error',
    inputs: [],
    name: 'ErrorTokenRateNotifierRevertedWithNoData',
  },
  { type: 'error', inputs: [], name: 'ErrorZeroAddressObserver' },
  { type: 'error', inputs: [], name: 'ErrorZeroAddressOwner' },
  { type: 'error', inputs: [], name: 'ErrorZeroAddressTokenRateProvider' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'kind',
        internalType: 'enum TokenRateNotifier.ObserverKind',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'ObserverAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'kind',
        internalType: 'enum TokenRateNotifier.ObserverKind',
        type: 'uint8',
        indexed: true,
      },
    ],
    name: 'ObserverRemoved',
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
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'observer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'lowLevelRevertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'PushTokenRateFailed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'INDEX_NOT_FOUND',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_OBSERVERS_COUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REQUIRED_INTERFACE_NO_ARGS',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REQUIRED_INTERFACE_WITH_ARGS',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN_RATE_PROVIDER',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'observer_', internalType: 'address', type: 'address' },
      {
        name: 'kind_',
        internalType: 'enum TokenRateNotifier.ObserverKind',
        type: 'uint8',
      },
    ],
    name: 'addObserver',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_reportTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_timeElapsed', internalType: 'uint256', type: 'uint256' },
      { name: '_preTotalShares', internalType: 'uint256', type: 'uint256' },
      { name: '_preTotalEther', internalType: 'uint256', type: 'uint256' },
      { name: '_postTotalShares', internalType: 'uint256', type: 'uint256' },
      { name: '_postTotalEther', internalType: 'uint256', type: 'uint256' },
      { name: '_sharesMintedAsFees', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'handlePostTokenRebase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'observers',
    outputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      {
        name: 'kind',
        internalType: 'enum TokenRateNotifier.ObserverKind',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'observersLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: 'observer_', internalType: 'address', type: 'address' }],
    name: 'removeObserver',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
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
] as const;
