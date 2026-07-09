//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CSExitPenalties
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const csExitPenaltiesAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'module', internalType: 'address', type: 'address' },
      { name: 'strikes', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  { type: 'error', inputs: [], name: 'SenderIsNotModule' },
  { type: 'error', inputs: [], name: 'SenderIsNotStrikes' },
  { type: 'error', inputs: [], name: 'ValidatorExitDelayNotApplicable' },
  { type: 'error', inputs: [], name: 'ZeroModuleAddress' },
  { type: 'error', inputs: [], name: 'ZeroStrikesAddress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperatorId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'pubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'strikesPenalty',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StrikesPenaltyProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperatorId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'exitType',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'pubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'withdrawalRequestPaidFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'withdrawalRequestRecordedFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TriggeredExitFeeRecorded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperatorId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'pubkey', internalType: 'bytes', type: 'bytes', indexed: false },
      {
        name: 'delayFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ValidatorExitDelayProcessed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ACCOUNTING',
    outputs: [
      { name: '', internalType: 'contract IAccounting', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MODULE',
    outputs: [
      { name: '', internalType: 'contract IBaseModule', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PARAMETERS_REGISTRY',
    outputs: [
      {
        name: '',
        internalType: 'contract IParametersRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STRIKES',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STRIKES_EXIT_TYPE_ID',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VOLUNTARY_EXIT_TYPE_ID',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKey', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getExitPenaltyInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct ExitPenaltyInfo',
        type: 'tuple',
        components: [
          {
            name: 'delayFee',
            internalType: 'struct MarkedUint248',
            type: 'tuple',
            components: [
              { name: 'value', internalType: 'uint248', type: 'uint248' },
              { name: 'isValue', internalType: 'bool', type: 'bool' },
            ],
          },
          {
            name: 'strikesPenalty',
            internalType: 'struct MarkedUint248',
            type: 'tuple',
            components: [
              { name: 'value', internalType: 'uint248', type: 'uint248' },
              { name: 'isValue', internalType: 'bool', type: 'bool' },
            ],
          },
          {
            name: 'elWithdrawalRequestFee',
            internalType: 'struct MarkedUint248',
            type: 'tuple',
            components: [
              { name: 'value', internalType: 'uint248', type: 'uint248' },
              { name: 'isValue', internalType: 'bool', type: 'bool' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKey', internalType: 'bytes', type: 'bytes' },
      { name: 'eligibleToExitInSec', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isValidatorExitDelayPenaltyApplicable',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKey', internalType: 'bytes', type: 'bytes' },
      { name: 'eligibleToExitInSec', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processExitDelayReport',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKey', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'processStrikesReport',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'publicKey', internalType: 'bytes', type: 'bytes' },
      {
        name: 'elWithdrawalRequestFeePaid',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'exitType', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processTriggeredExit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'admin', internalType: 'address', type: 'address' }],
    name: 'ERC1967InvalidAdmin',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
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
  { type: 'fallback', stateMutability: 'payable' },
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
    ],
    name: 'proxy__upgradeToAndCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const;
