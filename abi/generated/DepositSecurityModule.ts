//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DepositSecurityModule
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const depositSecurityModuleAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_lido', internalType: 'address', type: 'address' },
      { name: '_depositContract', internalType: 'address', type: 'address' },
      { name: '_stakingRouter', internalType: 'address', type: 'address' },
      {
        name: '_maxDepositsPerBlock',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_minDepositBlockDistance',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_pauseIntentValidityPeriodBlocks',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'DepositInactiveModule' },
  { type: 'error', inputs: [], name: 'DepositNoQuorum' },
  { type: 'error', inputs: [], name: 'DepositNonceChanged' },
  { type: 'error', inputs: [], name: 'DepositRootChanged' },
  { type: 'error', inputs: [], name: 'DepositTooFrequent' },
  { type: 'error', inputs: [], name: 'DepositUnexpectedBlockHash' },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'DuplicateAddress',
  },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'NotAGuardian',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'NotAnOwner',
  },
  { type: 'error', inputs: [], name: 'PauseIntentExpired' },
  { type: 'error', inputs: [], name: 'SignaturesNotSorted' },
  {
    type: 'error',
    inputs: [{ name: 'field', internalType: 'string', type: 'string' }],
    name: 'ZeroAddress',
  },
  {
    type: 'error',
    inputs: [{ name: 'parameter', internalType: 'string', type: 'string' }],
    name: 'ZeroParameter',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'stakingModuleId',
        internalType: 'uint24',
        type: 'uint24',
        indexed: true,
      },
    ],
    name: 'DepositsPaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint24',
        type: 'uint24',
        indexed: true,
      },
    ],
    name: 'DepositsUnpaused',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GuardianAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'GuardianQuorumChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guardian',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'GuardianRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxDepositsChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MinDepositBlockDistanceChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newValue',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'OwnerChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newValue',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PauseIntentValidityPeriodBlocksChanged',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ATTEST_MESSAGE_PREFIX',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEPOSIT_CONTRACT',
    outputs: [
      { name: '', internalType: 'contract IDepositContract', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LIDO',
    outputs: [{ name: '', internalType: 'contract ILido', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PAUSE_MESSAGE_PREFIX',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKING_ROUTER',
    outputs: [
      { name: '', internalType: 'contract IStakingRouter', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'newQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'addresses', internalType: 'address[]', type: 'address[]' },
      { name: 'newQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addGuardians',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'canDeposit',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'depositRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'depositCalldata', internalType: 'bytes', type: 'bytes' },
      {
        name: 'sortedGuardianSignatures',
        internalType: 'struct DepositSecurityModule.Signature[]',
        type: 'tuple[]',
        components: [
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'depositBufferedEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getGuardianIndex',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGuardianQuorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getGuardians',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxDeposits',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinDepositBlockDistance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPauseIntentValidityPeriodBlocks',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'isGuardian',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'stakingModuleId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'sig',
        internalType: 'struct DepositSecurityModule.Signature',
        type: 'tuple',
        components: [
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 'vs', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'pauseDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'addr', internalType: 'address', type: 'address' },
      { name: 'newQuorum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'uint256', type: 'uint256' }],
    name: 'setGuardianQuorum',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'uint256', type: 'uint256' }],
    name: 'setMaxDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'uint256', type: 'uint256' }],
    name: 'setMinDepositBlockDistance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newValue', internalType: 'uint256', type: 'uint256' }],
    name: 'setPauseIntentValidityPeriodBlocks',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unpauseDeposits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newLastDepositBlock', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setLastDepositBlock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
