//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CreateOrUpdateOperatorGroup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const createOrUpdateOperatorGroupAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_module', internalType: 'address', type: 'address' },
      { name: '_allowedExtModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allowedExternalModuleId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
      { name: 'groupId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'groupInfo',
        internalType: 'struct IMetaRegistry.OperatorGroup',
        type: 'tuple',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          {
            name: 'subNodeOperators',
            internalType: 'struct IMetaRegistry.SubNodeOperator[]',
            type: 'tuple[]',
            components: [
              {
                name: 'nodeOperatorId',
                internalType: 'uint64',
                type: 'uint64',
              },
              { name: 'share', internalType: 'uint16', type: 'uint16' },
            ],
          },
          {
            name: 'externalOperators',
            internalType: 'struct IMetaRegistry.ExternalOperator[]',
            type: 'tuple[]',
            components: [
              { name: 'data', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_externalOperatorData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'decodeNORExtOperatorData',
    outputs: [
      { name: 'moduleId', internalType: 'uint8', type: 'uint8' },
      { name: 'nodeOperatorId', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'moduleId', internalType: 'uint8', type: 'uint8' },
      { name: 'nodeOperatorId', internalType: 'uint64', type: 'uint64' },
    ],
    name: 'encodeNORExtOperatorData',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metaRegistry',
    outputs: [
      { name: '', internalType: 'contract IMetaRegistry', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'module',
    outputs: [
      { name: '', internalType: 'contract ICuratedModule', type: 'address' },
    ],
    stateMutability: 'view',
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
    name: 'stakingRouter',
    outputs: [
      { name: '', internalType: 'contract IStakingRouter', type: 'address' },
    ],
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
