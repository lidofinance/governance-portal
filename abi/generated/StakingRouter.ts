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
  {
    type: 'constructor',
    inputs: [
      { name: '_depositContract', internalType: 'address', type: 'address' },
      { name: '_lido', internalType: 'address', type: 'address' },
      { name: '_lidoLocator', internalType: 'address', type: 'address' },
      { name: '_maxEBType1', internalType: 'uint256', type: 'uint256' },
      { name: '_maxEBType2', internalType: 'uint256', type: 'uint256' },
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
  { type: 'error', inputs: [], name: 'AllocationExceedsLimit' },
  { type: 'error', inputs: [], name: 'AmountNotAlignedToGwei' },
  { type: 'error', inputs: [], name: 'ArraysLengthMismatch' },
  { type: 'error', inputs: [], name: 'DirectETHTransfer' },
  { type: 'error', inputs: [], name: 'EmptyKeysList' },
  { type: 'error', inputs: [], name: 'ExitedValidatorsCountCannotDecrease' },
  { type: 'error', inputs: [], name: 'InconsistentFeeSum' },
  { type: 'error', inputs: [], name: 'InvalidAmountGwei' },
  { type: 'error', inputs: [], name: 'InvalidFeeSum' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidMaxDepositPerBlockValue' },
  { type: 'error', inputs: [], name: 'InvalidMinDepositBlockDistance' },
  { type: 'error', inputs: [], name: 'InvalidPriorityExitShareThreshold' },
  {
    type: 'error',
    inputs: [{ name: 'code', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidReportData',
  },
  { type: 'error', inputs: [], name: 'InvalidStakeShareLimit' },
  { type: 'error', inputs: [], name: 'ModuleReturnExceedTarget' },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'OracleExtraDataNotSubmitted' },
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
  {
    type: 'error',
    inputs: [
      { name: 'expectedId', internalType: 'uint256', type: 'uint256' },
      { name: 'actualId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'UnexpectedModuleId',
  },
  { type: 'error', inputs: [], name: 'UnrecoverableModuleError' },
  { type: 'error', inputs: [], name: 'WrongPubkeyLength' },
  { type: 'error', inputs: [], name: 'WrongWithdrawalCredentialsType' },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  { type: 'error', inputs: [], name: 'ZeroArgument' },
  { type: 'error', inputs: [], name: 'ZeroDeposits' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DepositableEthReceived',
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
        name: 'nodeOperatorId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_publicKey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'StakingModuleExitNotificationFailed',
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
        internalType: 'enum StakingModuleStatus',
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
    name: 'INITIAL_DEPOSIT_SIZE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'LIDO_LOCATOR',
    outputs: [
      { name: '', internalType: 'contract ILidoLocator', type: 'address' },
    ],
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
    name: 'MAX_EFFECTIVE_BALANCE_WC_TYPE_01',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_EFFECTIVE_BALANCE_WC_TYPE_02',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_STAKING_MODULES_COUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_STAKING_MODULE_NAME_LENGTH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
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
    name: 'REPORT_VALIDATOR_EXITING_STATUS_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REPORT_VALIDATOR_EXIT_TRIGGERED_ROLE',
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
    name: 'STAKING_MODULE_SHARE_MANAGE_ROLE',
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
    stateMutability: 'pure',
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
      {
        name: '_stakingModuleConfig',
        internalType: 'struct StakingModuleConfig',
        type: 'tuple',
        components: [
          { name: 'stakeShareLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'priorityExitShareThreshold',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'stakingModuleFee',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'treasuryFee', internalType: 'uint256', type: 'uint256' },
          {
            name: 'maxDepositsPerBlock',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'minDepositBlockDistance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalCredentialsType',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
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
    ],
    name: 'canDeposit',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
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
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_depositCalldata', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalizeUpgrade_v4',
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
        internalType: 'struct NodeOperatorDigest[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          {
            name: 'summary',
            internalType: 'struct NodeOperatorSummary',
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
        internalType: 'struct StakingModuleDigest[]',
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
            internalType: 'struct StakingModule',
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
              {
                name: 'withdrawalCredentialsType',
                internalType: 'uint8',
                type: 'uint8',
              },
              {
                name: 'validatorsBalanceGwei',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
          {
            name: 'summary',
            internalType: 'struct StakingModuleSummary',
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
      { name: '_depositAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_isTopUp', internalType: 'bool', type: 'bool' },
    ],
    name: 'getDepositAllocations',
    outputs: [
      { name: 'totalAllocated', internalType: 'uint256', type: 'uint256' },
      { name: 'allocated', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'newAllocations', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'moduleId', internalType: 'uint256', type: 'uint256' }],
    name: 'getModuleValidatorsBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
        internalType: 'struct NodeOperatorDigest[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          {
            name: 'summary',
            internalType: 'struct NodeOperatorSummary',
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
        internalType: 'struct NodeOperatorDigest[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'isActive', internalType: 'bool', type: 'bool' },
          {
            name: 'summary',
            internalType: 'struct NodeOperatorSummary',
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
        internalType: 'struct NodeOperatorSummary',
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
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMembers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
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
        internalType: 'struct StakingModule',
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
          {
            name: 'withdrawalCredentialsType',
            internalType: 'uint8',
            type: 'uint8',
          },
          {
            name: 'validatorsBalanceGwei',
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
        internalType: 'struct StakingModuleDigest[]',
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
            internalType: 'struct StakingModule',
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
              {
                name: 'withdrawalCredentialsType',
                internalType: 'uint8',
                type: 'uint8',
              },
              {
                name: 'validatorsBalanceGwei',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
          {
            name: 'summary',
            internalType: 'struct StakingModuleSummary',
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
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
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
    name: 'getStakingModuleStateAccounting',
    outputs: [
      { name: 'validatorsBalanceGwei', internalType: 'uint64', type: 'uint64' },
      { name: 'exitedValidatorsCount', internalType: 'uint64', type: 'uint64' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleStateConfig',
    outputs: [
      {
        name: 'stateConfig',
        internalType: 'struct ModuleStateConfig',
        type: 'tuple',
        components: [
          { name: 'moduleAddress', internalType: 'address', type: 'address' },
          { name: 'moduleFee', internalType: 'uint16', type: 'uint16' },
          { name: 'treasuryFee', internalType: 'uint16', type: 'uint16' },
          { name: 'stakeShareLimit', internalType: 'uint16', type: 'uint16' },
          {
            name: 'priorityExitShareThreshold',
            internalType: 'uint16',
            type: 'uint16',
          },
          {
            name: 'status',
            internalType: 'enum StakingModuleStatus',
            type: 'uint8',
          },
          {
            name: 'withdrawalCredentialsType',
            internalType: 'uint8',
            type: 'uint8',
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
    name: 'getStakingModuleStateDeposits',
    outputs: [
      {
        name: 'stateDeposits',
        internalType: 'struct ModuleStateDeposits',
        type: 'tuple',
        components: [
          { name: 'lastDepositAt', internalType: 'uint64', type: 'uint64' },
          { name: 'lastDepositBlock', internalType: 'uint64', type: 'uint64' },
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
    name: 'getStakingModuleStatus',
    outputs: [
      { name: '', internalType: 'enum StakingModuleStatus', type: 'uint8' },
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
        internalType: 'struct StakingModuleSummary',
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
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getStakingModuleWithdrawalCredentials',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStakingModules',
    outputs: [
      {
        name: '',
        internalType: 'struct StakingModule[]',
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
          {
            name: 'withdrawalCredentialsType',
            internalType: 'uint8',
            type: 'uint8',
          },
          {
            name: 'validatorsBalanceGwei',
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
    name: 'getTotalModulesValidatorsBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [
      {
        name: 'validatorExitData',
        internalType: 'struct ValidatorExitData[]',
        type: 'tuple[]',
        components: [
          { name: 'stakingModuleId', internalType: 'uint256', type: 'uint256' },
          { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: '_withdrawalRequestPaidFee',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_exitType', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'onValidatorExitTriggered',
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
    inputs: [],
    name: 'receiveDepositableEther',
    outputs: [],
    stateMutability: 'payable',
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
      {
        name: '_stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      {
        name: '_validatorBalancesGwei',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'reportValidatorBalancesByStakingModule',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: '_proofSlotTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: '_publicKey', internalType: 'bytes', type: 'bytes' },
      {
        name: '_eligibleToExitInSec',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'reportValidatorExitDelay',
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
        internalType: 'enum StakingModuleStatus',
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
      { name: '_keyIndices', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_operatorIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_pubkeys', internalType: 'bytes[]', type: 'bytes[]' },
      { name: '_topUpLimits', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'topUp',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_stakingModuleId', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: '_triggerUpdateFinish', internalType: 'bool', type: 'bool' },
      {
        name: '_correction',
        internalType: 'struct ValidatorsCountsCorrection',
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
            name: 'newModuleExitedValidatorsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'newNodeOperatorExitedValidatorsCount',
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
        name: '_stakingModuleFees',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      { name: '_treasuryFees', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'updateAllStakingModulesFees',
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
      { name: '_stakeShareLimit', internalType: 'uint16', type: 'uint16' },
      {
        name: '_priorityExitShareThreshold',
        internalType: 'uint16',
        type: 'uint16',
      },
    ],
    name: 'updateModuleShares',
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
  {
    type: 'function',
    inputs: [
      {
        name: '_stakingModuleIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
      {
        name: '_validatorBalancesGwei',
        internalType: 'uint256[]',
        type: 'uint256[]',
      },
    ],
    name: 'validateReportValidatorBalancesByStakingModule',
    outputs: [],
    stateMutability: 'view',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const;
