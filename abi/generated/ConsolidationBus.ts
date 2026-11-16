//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ConsolidationBus
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const consolidationBusAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'consolidationGateway',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'AdminCannotBeZero' },
  {
    type: 'error',
    inputs: [{ name: 'batchHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'BatchAlreadyPending',
  },
  {
    type: 'error',
    inputs: [{ name: 'batchHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'BatchNotFound',
  },
  {
    type: 'error',
    inputs: [
      { name: 'size', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'BatchTooLarge',
  },
  { type: 'error', inputs: [], name: 'EmptyBatch' },
  { type: 'error', inputs: [], name: 'EmptyBatchHashes' },
  {
    type: 'error',
    inputs: [{ name: 'groupIndex', internalType: 'uint256', type: 'uint256' }],
    name: 'EmptyGroup',
  },
  {
    type: 'error',
    inputs: [
      { name: 'currentTime', internalType: 'uint256', type: 'uint256' },
      { name: 'executeAfter', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ExecutionDelayNotPassed',
  },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [
      { name: 'groupIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'sourceIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidSourcePubkeyLength',
  },
  {
    type: 'error',
    inputs: [
      { name: 'groupIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidTargetPubkeyLength',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxGroupsInBatch', internalType: 'uint256', type: 'uint256' },
      { name: 'batchSizeLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MaxGroupsExceedsBatchSize',
  },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [
      { name: 'groupIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'sourceIndex', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SourceEqualsTarget',
  },
  {
    type: 'error',
    inputs: [
      { name: 'groupsCount', internalType: 'uint256', type: 'uint256' },
      { name: 'limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TooManyGroups',
  },
  {
    type: 'error',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'ZeroArgument',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BatchLimitUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'batchHashes',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
        indexed: false,
      },
    ],
    name: 'BatchesRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExecutionDelayUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxGroupsInBatchUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'publisher',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'batchData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'RequestsAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'batchHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'feePaid',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RequestsExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MANAGE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PUBLISH_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REMOVE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'groups',
        internalType: 'struct ConsolidationBus.ConsolidationGroup[]',
        type: 'tuple[]',
        components: [
          { name: 'sourcePubkeys', internalType: 'bytes[]', type: 'bytes[]' },
          { name: 'targetPubkey', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'addConsolidationRequests',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'batchSize',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'groups',
        internalType:
          'struct IConsolidationGateway.ConsolidationWitnessGroup[]',
        type: 'tuple[]',
        components: [
          { name: 'sourcePubkeys', internalType: 'bytes[]', type: 'bytes[]' },
          {
            name: 'targetWitness',
            internalType: 'struct IPredepositGuarantee.ValidatorWitness',
            type: 'tuple',
            components: [
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
              { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
              {
                name: 'validatorIndex',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'childBlockTimestamp',
                internalType: 'uint64',
                type: 'uint64',
              },
              { name: 'slot', internalType: 'uint64', type: 'uint64' },
              { name: 'proposerIndex', internalType: 'uint64', type: 'uint64' },
            ],
          },
        ],
      },
    ],
    name: 'executeConsolidation',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executionDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'batchHash', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getBatchInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct ConsolidationBus.BatchInfo',
        type: 'tuple',
        components: [
          { name: 'publisher', internalType: 'address', type: 'address' },
          { name: 'addedAt', internalType: 'uint64', type: 'uint64' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getConsolidationGateway',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoleMember',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMembers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'initialBatchSize', internalType: 'uint256', type: 'uint256' },
      {
        name: 'initialMaxGroupsInBatch',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'initialExecutionDelay',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxGroupsInBatch',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'batchHashes', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'removeBatches',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'limit', internalType: 'uint256', type: 'uint256' }],
    name: 'setBatchSize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'delay', internalType: 'uint256', type: 'uint256' }],
    name: 'setExecutionDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'limit', internalType: 'uint256', type: 'uint256' }],
    name: 'setMaxGroupsInBatch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  { type: 'error', inputs: [], name: 'NotAdmin' },
  { type: 'error', inputs: [], name: 'ProxyIsOssified' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'ProxyOssified' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [{ name: 'newAdmin_', internalType: 'address', type: 'address' }],
    name: 'proxy__changeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxy__getAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxy__getImplementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxy__getIsOssified',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxy__ossify',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation_', internalType: 'address', type: 'address' },
    ],
    name: 'proxy__upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation_', internalType: 'address', type: 'address' },
      { name: 'setupCalldata_', internalType: 'bytes', type: 'bytes' },
      { name: 'forceCall_', internalType: 'bool', type: 'bool' },
    ],
    name: 'proxy__upgradeToAndCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
