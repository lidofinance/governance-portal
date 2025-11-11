//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CompositePostRebaseBeaconReceiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const compositePostRebaseBeaconReceiverAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_voting', internalType: 'address', type: 'address' },
      { name: '_oracle', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'callback',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'atIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CallbackAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'callback',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'atIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CallbackRemoved',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_CALLBACKS_COUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ORACLE',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REQUIRED_INTERFACE',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VOTING',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_callback', internalType: 'address', type: 'address' }],
    name: 'addCallback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'callbacks',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'callbacksLength',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_callback', internalType: 'address', type: 'address' },
      { name: '_atIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'insertCallback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_postTotalPooledEther',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_preTotalPooledEther',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_timeElapsed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processLidoOracleReport',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_atIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'removeCallback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const
