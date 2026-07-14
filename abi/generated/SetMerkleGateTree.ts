//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SetMerkleGateTree
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const setMerkleGateTreeAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
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
      { name: 'gate', internalType: 'address', type: 'address' },
      { name: 'currentTreeRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'currentTreeCid', internalType: 'string', type: 'string' },
      { name: 'newTreeRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newTreeCid', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'gate', internalType: 'address', type: 'address' },
      { name: 'currentTreeRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'currentTreeCid', internalType: 'string', type: 'string' },
      { name: 'newTreeRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newTreeCid', internalType: 'string', type: 'string' },
    ],
    name: 'validateInputData',
    outputs: [],
    stateMutability: 'view',
  },
] as const;
