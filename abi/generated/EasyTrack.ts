//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EasyTrack
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const easyTrackAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_governanceToken', internalType: 'address', type: 'address' },
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_motionDuration', internalType: 'uint256', type: 'uint256' },
      { name: '_motionsCountLimit', internalType: 'uint256', type: 'uint256' },
      {
        name: '_objectionsThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_evmScriptExecutor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EVMScriptExecutorChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_evmScriptFactory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_permissions',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'EVMScriptFactoryAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_evmScriptFactory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'EVMScriptFactoryRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_motionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'MotionCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_motionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_creator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_evmScriptFactory',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_evmScriptCallData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
      {
        name: '_evmScript',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'MotionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_motionDuration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MotionDurationChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_motionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'MotionEnacted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_motionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_objector',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_newObjectionsAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_newObjectionsAmountPct',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MotionObjected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_motionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'MotionRejected',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newMotionsCountLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MotionsCountLimitChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ObjectionsThresholdChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Paused',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Unpaused',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CANCEL_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
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
    name: 'MAX_MOTIONS_LIMIT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_OBJECTIONS_THRESHOLD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_MOTION_DURATION',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PAUSE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UNPAUSE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_evmScriptFactory', internalType: 'address', type: 'address' },
      { name: '_permissions', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'addEVMScriptFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_motionId', internalType: 'uint256', type: 'uint256' },
      { name: '_objector', internalType: 'address', type: 'address' },
    ],
    name: 'canObjectToMotion',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'cancelAllMotions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_motionId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelMotion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_motionIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'cancelMotions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_evmScriptFactory', internalType: 'address', type: 'address' },
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'createMotion',
    outputs: [
      { name: '_newMotionId', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_motionId', internalType: 'uint256', type: 'uint256' },
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'enactMotion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'evmScriptExecutor',
    outputs: [
      {
        name: '',
        internalType: 'contract IEVMScriptExecutor',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'evmScriptFactories',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'evmScriptFactoryPermissions',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEVMScriptFactories',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_motionId', internalType: 'uint256', type: 'uint256' }],
    name: 'getMotion',
    outputs: [
      {
        name: '',
        internalType: 'struct EasyTrack.Motion',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          {
            name: 'evmScriptFactory',
            internalType: 'address',
            type: 'address',
          },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'startDate', internalType: 'uint256', type: 'uint256' },
          { name: 'snapshotBlock', internalType: 'uint256', type: 'uint256' },
          {
            name: 'objectionsThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'objectionsAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'evmScriptHash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMotions',
    outputs: [
      {
        name: '',
        internalType: 'struct EasyTrack.Motion[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          {
            name: 'evmScriptFactory',
            internalType: 'address',
            type: 'address',
          },
          { name: 'creator', internalType: 'address', type: 'address' },
          { name: 'duration', internalType: 'uint256', type: 'uint256' },
          { name: 'startDate', internalType: 'uint256', type: 'uint256' },
          { name: 'snapshotBlock', internalType: 'uint256', type: 'uint256' },
          {
            name: 'objectionsThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'objectionsAmount',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'evmScriptHash', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
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
    inputs: [],
    name: 'governanceToken',
    outputs: [
      { name: '', internalType: 'contract IMiniMeToken', type: 'address' },
    ],
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
      {
        name: '_maybeEVMScriptFactory',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'isEVMScriptFactory',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'motionDuration',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'motions',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'evmScriptFactory', internalType: 'address', type: 'address' },
      { name: 'creator', internalType: 'address', type: 'address' },
      { name: 'duration', internalType: 'uint256', type: 'uint256' },
      { name: 'startDate', internalType: 'uint256', type: 'uint256' },
      { name: 'snapshotBlock', internalType: 'uint256', type: 'uint256' },
      { name: 'objectionsThreshold', internalType: 'uint256', type: 'uint256' },
      { name: 'objectionsAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'evmScriptHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'motionsCountLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_motionId', internalType: 'uint256', type: 'uint256' }],
    name: 'objectToMotion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'objections',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'objectionsThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_evmScriptFactory', internalType: 'address', type: 'address' },
    ],
    name: 'removeEVMScriptFactory',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
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
    inputs: [
      { name: '_evmScriptExecutor', internalType: 'address', type: 'address' },
    ],
    name: 'setEVMScriptExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_motionDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMotionDuration',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_motionsCountLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMotionsCountLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_objectionsThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setObjectionsThreshold',
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
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
