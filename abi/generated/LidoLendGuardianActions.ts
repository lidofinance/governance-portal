//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LidoLendGuardianActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lidoLendGuardianActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_lidoLendOwner', internalType: 'address', type: 'address' },
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
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeAddGuardianPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'guardian', internalType: 'address', type: 'address' },
      { name: 'newQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'decodeEVMScriptCallData',
    outputs: [
      {
        name: 'action',
        internalType: 'enum LidoLendGuardianActions.Action',
        type: 'uint8',
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeRemoveGuardianPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'guardian', internalType: 'address', type: 'address' },
      { name: 'newQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeReplaceGuardianPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'oldGuardian', internalType: 'address', type: 'address' },
      { name: 'newGuardian', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetGuardiansQuorumPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetSuspectWindowPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newSuspectWindow', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeUnbanAccountsPayload',
    outputs: [
      {
        name: 'requests',
        internalType: 'struct LidoLendGuardianActions.UnbanRequest[]',
        type: 'tuple[]',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'marketIds', internalType: 'bytes32[]', type: 'bytes32[]' },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLend',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLendOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const;
