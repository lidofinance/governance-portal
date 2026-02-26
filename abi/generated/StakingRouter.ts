//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StakingRouter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stakingRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'implementation_', internalType: 'address', type: 'address' },
      { name: 'admin_', internalType: 'address', type: 'address' },
      { name: 'data_', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'nonpayable',
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
      { name: 'forceCall_', internalType: 'bool', type: 'bool' },
    ],
    name: 'proxy__upgradeToAndCall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'constructor',
    inputs: [
      { name: '_depositContract', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AppAuthLidoFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'firstArrayLength', internalType: 'uint256', type: 'uint256' },
      { name: 'secondArrayLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ArraysLengthMismatch',
  },
  { type: 'error', inputs: [], name: 'DepositContractZeroAddress' },
  { type: 'error', inputs: [], name: 'DirectETHTransfer' },
  { type: 'error', inputs: [], name: 'EmptyWithdrawalsCredentials' },
  { type: 'error', inputs: [], name: 'ExitedValidatorsCountCannotDecrease' },
  { type: 'error', inputs: [], name: 'InvalidContractVersionIncrement' },
  {
    type: 'error',
    inputs: [
      { name: 'etherValue', internalType: 'uint256', type: 'uint256' },
      { name: 'depositsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidDepositsValue',
  },
  { type: 'error', inputs: [], name: 'InvalidFeeSum' },
  { type: 'error', inputs: [], name: 'InvalidMaxDepositPerBlockValue' },
  { type: 'error', inputs: [], name: 'InvalidMinDepositBlockDistance' },
  { type: 'error', inputs: [], name: 'InvalidPriorityExitShareThreshold' },
  {
    type: 'error',
    inputs: [
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidPublicKeysBatchLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'code', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidReportData',
  },
  {
    type: 'error',
    inputs: [
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidSignaturesBatchLength',
  },
  { type: 'error', inputs: [], name: 'InvalidStakeShareLimit' },
  { type: 'error', inputs: [], name: 'NonZeroContractVersionOnInit' },
  {
    type: 'error',
    inputs: [
      {
        name: 'reportedExitedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'depositedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'ReportedExitedValidatorsExceedDeposited',
  },
  { type: 'error', inputs: [], name: 'StakingModuleAddressExists' },
  { type: 'error', inputs: [], name: 'StakingModuleNotActive' },
  { type: 'error', inputs: [], name: 'StakingModuleStatusTheSame' },
  { type: 'error', inputs: [], name: 'StakingModuleUnregistered' },
  { type: 'error', inputs: [], name: 'StakingModuleWrongName' },
  { type: 'error', inputs: [], name: 'StakingModulesLimitExceeded' },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'UnexpectedContractVersion',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'currentModuleExitedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'currentNodeOpExitedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'currentNodeOpStuckValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'UnexpectedCurrentValidatorsCount',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'newModuleTotalExitedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'newModuleTotalExitedValidatorsCountInStakingRouter',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'UnexpectedFinalExitedValidatorsCount',
  },
  { type: 'error', inputs: [], name: 'UnrecoverableModuleError' },
  { type: 'error', inputs: [], name: 'ZeroAddressAdmin' },
  { type: 'error', inputs: [], name: 'ZeroAddressLido' },
  { type: 'error', inputs: [], name: 'ZeroAddressStakingModule' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContractVersionSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'lowLevelRevertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'ExitedAndStuckValidatorsCountsUpdateFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'lowLevelRevertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'RewardsMintedReportFailed',
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
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'stakingModule',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'createdBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakingModuleAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'unreportedExitedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakingModuleExitedValidatorsIncompleteReporting',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'stakingModuleFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'treasuryFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'setBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakingModuleFeesSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'maxDepositsPerBlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'setBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakingModuleMaxDepositsPerBlockSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'minDepositBlockDistance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'setBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakingModuleMinDepositBlockDistanceSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'stakeShareLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'priorityExitShareThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'setBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakingModuleShareLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'status',
        internalType: 'enum StakingRouter.StakingModuleStatus',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'setBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'StakingModuleStatusSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StakingRouterETHDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'setBy',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'WithdrawalCredentialsSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingModuleId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'lowLevelRevertData',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'WithdrawalsCredentialsChangeFailed',
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
    name: 'DEPOSIT_CONTRACT',
    outputs: [
      { name: '', internalType: 'contract IDepositContract', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_PRECISION_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MANAGE_WITHDRAWAL_CREDENTIALS_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_STAKING_MODULES_COUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_STAKING_MODULE_NAME_LENGTH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REPORT_EXITED_VALIDATORS_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REPORT_REWARDS_MINTED_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKING_MODULE_MANAGE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'STAKING_MODULE_UNVETTING_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOTAL_BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UNSAFE_SET_EXITED_VALIDATORS_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      {
        name: '_stakingModuleAddress',
        internalType: 'address',
        type: 'address',
      },
      { name: '_stakeShareLimit', internalType: 'uint256', type: 'uint256' },
      {
        name: '_priorityExitShareThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_stakingModuleFee', internalType: 'uint256', type: 'uint256' },
      { name: '_treasuryFee', internalType: 'uint256', type: 'uint256' },
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
    ],
    name: 'addStakingModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorIds', internalType: 'bytes', type: 'bytes' },
      {
        name: '_vettedSigningKeysCounts',
        internalType: 'bytes',
        type: 'bytes',
      },
    ],
    name: 'decreaseStakingModuleVettedKeysCountByNodeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositsCount', internalType: 'uint256', type: 'uint256' },
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_depositCalldata', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_priorityExitShareThresholds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      {
        name: '_maxDepositsPerBlock',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      {
        name: '_minDepositBlockDistances',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'finalizeUpgrade_v2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getAllNodeOperatorDigests',
    outputs: [
      {
        name: '',
        internalType: 'struct StakingRouter.NodeOperatorDigest[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          {
            name: 'summary',
            internalType: 'struct StakingRouter.NodeOperatorSummary',
            type: 'tuple',
            components: [
              {
                name: 'targetLimitMode',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'targetValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'stuckValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'refundedValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'stuckPenaltyEndTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalExitedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalDepositedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'depositableValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllStakingModuleDigests',
    outputs: [
      {
        name: '',
        internalType: 'struct StakingRouter.StakingModuleDigest[]',
        type: 'tuple[]',
        components: [
          {
            name: 'nodeOperatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'activeNodeOperatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'state',
            internalType: 'struct StakingRouter.StakingModule',
            type: 'tuple',
            components: [
              { name: 'id', internalType: 'uint24', type: 'uint24' },
              {
                name: 'stakingModuleAddress',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'stakingModuleFee',
                internalType: 'uint16',
                type: 'uint16',
              },
              { name: 'treasuryFee', internalType: 'uint16', type: 'uint16' },
              {
                name: 'stakeShareLimit',
                internalType: 'uint16',
                type: 'uint16',
              },
              { name: 'status', internalType: 'uint8', type: 'uint8' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'lastDepositAt', internalType: 'uint64', type: 'uint64' },
              {
                name: 'lastDepositBlock',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'exitedValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'priorityExitShareThreshold',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'maxDepositsPerBlock',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'minDepositBlockDistance',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
          {
            name: 'summary',
            internalType: 'struct StakingRouter.StakingModuleSummary',
            type: 'tuple',
            components: [
              {
                name: 'totalExitedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalDepositedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'depositableValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContractVersion',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_depositsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDepositsAllocation',
    outputs: [
      { name: 'allocated', internalType: 'uint256', type: 'uint256' },
      { name: 'allocations', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLido',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_nodeOperatorIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'getNodeOperatorDigests',
    outputs: [
      {
        name: 'digests',
        internalType: 'struct StakingRouter.NodeOperatorDigest[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          {
            name: 'summary',
            internalType: 'struct StakingRouter.NodeOperatorSummary',
            type: 'tuple',
            components: [
              {
                name: 'targetLimitMode',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'targetValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'stuckValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'refundedValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'stuckPenaltyEndTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalExitedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalDepositedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'depositableValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
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
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_offset', internalType: 'uint256', type: 'uint256' },
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeOperatorDigests',
    outputs: [
      {
        name: '',
        internalType: 'struct StakingRouter.NodeOperatorDigest[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          {
            name: 'summary',
            internalType: 'struct StakingRouter.NodeOperatorSummary',
            type: 'tuple',
            components: [
              {
                name: 'targetLimitMode',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'targetValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'stuckValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'refundedValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'stuckPenaltyEndTimestamp',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalExitedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalDepositedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'depositableValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
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
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeOperatorSummary',
    outputs: [
      {
        name: 'summary',
        internalType: 'struct StakingRouter.NodeOperatorSummary',
        type: 'tuple',
        components: [
          { name: 'targetLimitMode', internalType: 'uint256', type: 'uint256' },
          {
            name: 'targetValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'stuckValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'refundedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'stuckPenaltyEndTimestamp',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalExitedValidators',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalDepositedValidators',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'depositableValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
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
    inputs: [],
    name: 'getStakingFeeAggregateDistribution',
    outputs: [
      { name: 'modulesFee', internalType: 'uint96', type: 'uint96' },
      { name: 'treasuryFee', internalType: 'uint96', type: 'uint96' },
      { name: 'basePrecision', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingFeeAggregateDistributionE4Precision',
    outputs: [
      { name: 'modulesFee', internalType: 'uint16', type: 'uint16' },
      { name: 'treasuryFee', internalType: 'uint16', type: 'uint16' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModule',
    outputs: [
      {
        name: '',
        internalType: 'struct StakingRouter.StakingModule',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint24', type: 'uint24' },
          {
            name: 'stakingModuleAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'stakingModuleFee', internalType: 'uint16', type: 'uint16' },
          { name: 'treasuryFee', internalType: 'uint16', type: 'uint16' },
          { name: 'stakeShareLimit', internalType: 'uint16', type: 'uint16' },
          { name: 'status', internalType: 'uint8', type: 'uint8' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'lastDepositAt', internalType: 'uint64', type: 'uint64' },
          {
            name: 'lastDepositBlock',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'exitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'priorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'maxDepositsPerBlock',
            internalType: 'uint64',
            type: 'uint64',
          },
          {
            name: 'minDepositBlockDistance',
            internalType: 'uint64',
            type: 'uint64',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleActiveValidatorsCount',
    outputs: [
      {
        name: 'activeValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'getStakingModuleDigests',
    outputs: [
      {
        name: 'digests',
        internalType: 'struct StakingRouter.StakingModuleDigest[]',
        type: 'tuple[]',
        components: [
          {
            name: 'nodeOperatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'activeNodeOperatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'state',
            internalType: 'struct StakingRouter.StakingModule',
            type: 'tuple',
            components: [
              { name: 'id', internalType: 'uint24', type: 'uint24' },
              {
                name: 'stakingModuleAddress',
                internalType: 'address',
                type: 'address',
              },
              {
                name: 'stakingModuleFee',
                internalType: 'uint16',
                type: 'uint16',
              },
              { name: 'treasuryFee', internalType: 'uint16', type: 'uint16' },
              {
                name: 'stakeShareLimit',
                internalType: 'uint16',
                type: 'uint16',
              },
              { name: 'status', internalType: 'uint8', type: 'uint8' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'lastDepositAt', internalType: 'uint64', type: 'uint64' },
              {
                name: 'lastDepositBlock',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'exitedValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'priorityExitShareThreshold',
                internalType: 'uint16',
                type: 'uint16',
              },
              {
                name: 'maxDepositsPerBlock',
                internalType: 'uint64',
                type: 'uint64',
              },
              {
                name: 'minDepositBlockDistance',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
          {
            name: 'summary',
            internalType: 'struct StakingRouter.StakingModuleSummary',
            type: 'tuple',
            components: [
              {
                name: 'totalExitedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'totalDepositedValidators',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'depositableValidatorsCount',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingModuleIds',
    outputs: [
      {
        name: 'stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleIsActive',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleIsDepositsPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleIsStopped',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleLastDepositBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_maxDepositsValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleMaxDepositsCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleMaxDepositsPerBlock',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleMinDepositBlockDistance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleStatus',
    outputs: [
      {
        name: '',
        internalType: 'enum StakingRouter.StakingModuleStatus',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleSummary',
    outputs: [
      {
        name: 'summary',
        internalType: 'struct StakingRouter.StakingModuleSummary',
        type: 'tuple',
        components: [
          {
            name: 'totalExitedValidators',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalDepositedValidators',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'depositableValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingModules',
    outputs: [
      {
        name: 'res',
        internalType: 'struct StakingRouter.StakingModule[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint24', type: 'uint24' },
          {
            name: 'stakingModuleAddress',
            internalType: 'address',
            type: 'address',
          },
          { name: 'stakingModuleFee', internalType: 'uint16', type: 'uint16' },
          { name: 'treasuryFee', internalType: 'uint16', type: 'uint16' },
          { name: 'stakeShareLimit', internalType: 'uint16', type: 'uint16' },
          { name: 'status', internalType: 'uint8', type: 'uint8' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'lastDepositAt', internalType: 'uint64', type: 'uint64' },
          {
            name: 'lastDepositBlock',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'exitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'priorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'maxDepositsPerBlock',
            internalType: 'uint64',
            type: 'uint64',
          },
          {
            name: 'minDepositBlockDistance',
            internalType: 'uint64',
            type: 'uint64',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingModulesCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingRewardsDistribution',
    outputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      {
        name: 'stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      { name: 'stakingModuleFees', internalType: 'uint96[]', type: 'uint96[]' },
      { name: 'totalFee', internalType: 'uint96', type: 'uint96' },
      { name: 'precisionPoints', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTotalFeeE4Precision',
    outputs: [{ name: 'totalFee', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWithdrawalCredentials',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasStakingModule',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_lido', internalType: 'address', type: 'address' },
      {
        name: '_withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'onValidatorsCountsByNodeOperatorReportingFinished',
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
      {
        name: '_stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      { name: '_totalShares', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'reportRewardsMinted',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorIds', internalType: 'bytes', type: 'bytes' },
      { name: '_exitedValidatorsCounts', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'reportStakingModuleExitedValidatorsCountByNodeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorIds', internalType: 'bytes', type: 'bytes' },
      { name: '_stuckValidatorsCounts', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'reportStakingModuleStuckValidatorsCountByNodeOperator',
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
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_status',
        internalType: 'enum StakingRouter.StakingModuleStatus',
        type: 'uint8',
      },
    ],
    name: 'setStakingModuleStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'setWithdrawalCredentials',
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
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: '_triggerUpdateFinish', internalType: 'bool', type: 'bool' },
      {
        name: '_correction',
        internalType: 'struct StakingRouter.ValidatorsCountsCorrection',
        type: 'tuple',
        components: [
          {
            name: 'currentModuleExitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'currentNodeOperatorExitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'currentNodeOperatorStuckValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'newModuleExitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'newNodeOperatorExitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'newNodeOperatorStuckValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'unsafeSetExitedValidatorsCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      {
        name: '_exitedValidatorsCounts',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'updateExitedValidatorsCountByStakingModule',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_refundedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'updateRefundedValidatorsCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_stakeShareLimit', internalType: 'uint256', type: 'uint256' },
      {
        name: '_priorityExitShareThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_stakingModuleFee', internalType: 'uint256', type: 'uint256' },
      { name: '_treasuryFee', internalType: 'uint256', type: 'uint256' },
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
    ],
    name: 'updateStakingModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: '_targetLimitMode', internalType: 'uint256', type: 'uint256' },
      { name: '_targetLimit', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateTargetValidatorsLimits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const
