//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Voting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const votingAbi = [
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'proxyType',
    outputs: [{ name: 'proxyTypeId', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'isDepositable',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'appId',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'kernel',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    payable: false,
    type: 'constructor',
    inputs: [
      { name: '_kernel', type: 'address' },
      { name: '_appId', type: 'bytes32' },
      { name: '_initializePayload', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
  },
  { payable: true, type: 'fallback', stateMutability: 'payable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', type: 'address', indexed: false },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'ProxyDeposit',
  },
] as const;
