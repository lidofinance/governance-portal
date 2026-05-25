//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OracleReportSanityChecker
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oracleReportSanityCheckerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_lidoLocator', internalType: 'address', type: 'address' },
      { name: '_admin', internalType: 'address', type: 'address' },
      {
        name: '_limitsList',
        internalType: 'struct LimitsList',
        type: 'tuple',
        components: [
          {
            name: 'churnValidatorsPerDayLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'oneOffCLBalanceDecreaseBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'annualBalanceIncreaseBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'simulatedShareRateDeviationBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxValidatorExitRequestsPerReport',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxAccountingExtraDataListItemsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItemCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'requestTimestampMargin',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxPositiveTokenRebase',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      {
        name: '_managersRoster',
        internalType: 'struct OracleReportSanityChecker.ManagersRoster',
        type: 'tuple',
        components: [
          {
            name: 'allLimitsManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'churnValidatorsPerDayLimitManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'oneOffCLBalanceDecreaseLimitManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'annualBalanceIncreaseLimitManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'shareRateDeviationLimitManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'maxValidatorExitRequestsPerReportManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'maxAccountingExtraDataListItemsCountManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItemCountManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'requestTimestampMarginManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'maxPositiveTokenRebaseManagers',
            internalType: 'address[]',
            type: 'address[]',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ActualShareRateIsZero' },
  { type: 'error', inputs: [], name: 'AdminCannotBeZero' },
  {
    type: 'error',
    inputs: [
      { name: 'limitPerDay', internalType: 'uint256', type: 'uint256' },
      { name: 'exitedPerDay', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ExitedValidatorsLimitExceeded',
  },
  {
    type: 'error',
    inputs: [{ name: 'churnLimit', internalType: 'uint256', type: 'uint256' }],
    name: 'IncorrectAppearedValidators',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'oneOffCLBalanceDecreaseBP',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'IncorrectCLBalanceDecrease',
  },
  {
    type: 'error',
    inputs: [
      { name: 'annualBalanceDiff', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectCLBalanceIncrease',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'actualELRewardsVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'IncorrectELRewardsVaultBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'churnLimit', internalType: 'uint256', type: 'uint256' }],
    name: 'IncorrectExitedValidators',
  },
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'minAllowedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'maxAllowedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectLimitValue',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxRequestsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectNumberOfExitRequestsPerReport',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'requestCreationBlock',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'IncorrectRequestFinalization',
  },
  {
    type: 'error',
    inputs: [
      { name: 'actualSharesToBurn', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectSharesRequestedToBurn',
  },
  {
    type: 'error',
    inputs: [
      { name: 'simulatedShareRate', internalType: 'uint256', type: 'uint256' },
      { name: 'actualShareRate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectSimulatedShareRate',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'actualWithdrawalVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'IncorrectWithdrawalsVaultBalance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'maxItemsCount', internalType: 'uint256', type: 'uint256' },
      { name: 'receivedItemsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'MaxAccountingExtraDataItemsCountExceeded',
  },
  { type: 'error', inputs: [], name: 'NegativeTotalPooledEther' },
  { type: 'error', inputs: [], name: 'TooHighTokenRebaseLimit' },
  { type: 'error', inputs: [], name: 'TooLowTokenRebaseLimit' },
  {
    type: 'error',
    inputs: [
      { name: 'itemIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'nodeOpsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TooManyNodeOpsPerExtraDataItem',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'annualBalanceIncreaseBPLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AnnualBalanceIncreaseBPLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'churnValidatorsPerDayLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ChurnValidatorsPerDayLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxAccountingExtraDataListItemsCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxAccountingExtraDataListItemsCountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxNodeOperatorsPerExtraDataItemCount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxNodeOperatorsPerExtraDataItemCountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxPositiveTokenRebase',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxPositiveTokenRebaseSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxValidatorExitRequestsPerReport',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxValidatorExitRequestsPerReportSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oneOffCLBalanceDecreaseBPLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OneOffCLBalanceDecreaseBPLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requestTimestampMargin',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RequestTimestampMarginSet',
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
        name: 'simulatedShareRateDeviationBPLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SimulatedShareRateDeviationBPLimitSet',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ALL_LIMITS_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ANNUAL_BALANCE_INCREASE_LIMIT_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CHURN_VALIDATORS_PER_DAY_LIMIT_MANAGER_ROLE',
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
    name: 'MAX_ACCOUNTING_EXTRA_DATA_LIST_ITEMS_COUNT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_NODE_OPERATORS_PER_EXTRA_DATA_ITEM_COUNT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_POSITIVE_TOKEN_REBASE_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_VALIDATOR_EXIT_REQUESTS_PER_REPORT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ONE_OFF_CL_BALANCE_DECREASE_LIMIT_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REQUEST_TIMESTAMP_MARGIN_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SHARE_RATE_DEVIATION_LIMIT_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_extraDataListItemsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'checkAccountingExtraDataListItemsCount',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_timeElapsed', internalType: 'uint256', type: 'uint256' },
      { name: '_preCLBalance', internalType: 'uint256', type: 'uint256' },
      { name: '_postCLBalance', internalType: 'uint256', type: 'uint256' },
      {
        name: '_withdrawalVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_elRewardsVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_sharesRequestedToBurn',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_preCLValidators', internalType: 'uint256', type: 'uint256' },
      { name: '_postCLValidators', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkAccountingOracleReport',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_exitRequestsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkExitBusOracleReport',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_exitedValidatorsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'checkExitedValidatorsRatePerDay',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_itemIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_nodeOperatorsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkNodeOperatorsPerExtraDataItemCount',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_postTotalPooledEther',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_postTotalShares', internalType: 'uint256', type: 'uint256' },
      {
        name: '_etherLockedOnWithdrawalQueue',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_sharesBurntDueToWithdrawals',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_simulatedShareRate', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkSimulatedShareRate',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_lastFinalizableRequestId',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_reportTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'checkWithdrawalQueueOracleReport',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLidoLocator',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMaxPositiveTokenRebase',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getOracleReportLimits',
    outputs: [
      {
        name: '',
        internalType: 'struct LimitsList',
        type: 'tuple',
        components: [
          {
            name: 'churnValidatorsPerDayLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'oneOffCLBalanceDecreaseBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'annualBalanceIncreaseBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'simulatedShareRateDeviationBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxValidatorExitRequestsPerReport',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxAccountingExtraDataListItemsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItemCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'requestTimestampMargin',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxPositiveTokenRebase',
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
      {
        name: '_annualBalanceIncreaseBPLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setAnnualBalanceIncreaseBPLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_churnValidatorsPerDayLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setChurnValidatorsPerDayLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_maxAccountingExtraDataListItemsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxAccountingExtraDataListItemsCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_maxValidatorExitRequestsPerReport',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxExitRequestsPerOracleReport',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_maxNodeOperatorsPerExtraDataItemCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxNodeOperatorsPerExtraDataItemCount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_maxPositiveTokenRebase',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxPositiveTokenRebase',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_oneOffCLBalanceDecreaseBPLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setOneOffCLBalanceDecreaseBPLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_limitsList',
        internalType: 'struct LimitsList',
        type: 'tuple',
        components: [
          {
            name: 'churnValidatorsPerDayLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'oneOffCLBalanceDecreaseBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'annualBalanceIncreaseBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'simulatedShareRateDeviationBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxValidatorExitRequestsPerReport',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxAccountingExtraDataListItemsCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItemCount',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'requestTimestampMargin',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxPositiveTokenRebase',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'setOracleReportLimits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_requestTimestampMargin',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setRequestTimestampMargin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_simulatedShareRateDeviationBPLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setSimulatedShareRateDeviationBPLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_preTotalPooledEther',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_preTotalShares', internalType: 'uint256', type: 'uint256' },
      { name: '_preCLBalance', internalType: 'uint256', type: 'uint256' },
      { name: '_postCLBalance', internalType: 'uint256', type: 'uint256' },
      {
        name: '_withdrawalVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_elRewardsVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_sharesRequestedToBurn',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_etherToLockForWithdrawals',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_newSharesToBurnForWithdrawals',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'smoothenTokenRebase',
    outputs: [
      { name: 'withdrawals', internalType: 'uint256', type: 'uint256' },
      { name: 'elRewards', internalType: 'uint256', type: 'uint256' },
      {
        name: 'simulatedSharesToBurn',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: 'sharesToBurn', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const;
