//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MerkleGate
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const merkleGateAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'treeRoot',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'treeCid',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_treeRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_treeCid', internalType: 'string', type: 'string' },
    ],
    name: 'setTreeParams',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
