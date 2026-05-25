//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OracleReportSanityCheckerV2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oracleReportSanityCheckerV2Abi = [
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
            name: 'exitedValidatorsPerDayLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'appearedValidatorsPerDayLimit',
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
            name: 'maxItemsPerExtraDataTransaction',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItem',
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
          {
            name: 'initialSlashingAmountPWei',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'inactivityPenaltiesAmountPWei',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'clBalanceOraclesErrorUpperBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'ActualShareRateIsZero' },
  { type: 'error', inputs: [], name: 'AdminCannotBeZero' },
  { type: 'error', inputs: [], name: 'CalledNotFromLido' },
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
    inputs: [
      {
        name: 'appearedValidatorsLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'IncorrectAppearedValidators',
  },
  {
    type: 'error',
    inputs: [
      { name: 'negativeCLRebaseSum', internalType: 'uint256', type: 'uint256' },
      {
        name: 'maxNegativeCLRebaseSum',
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
    inputs: [
      {
        name: 'exitedValidatorsLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
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
      { name: 'reportedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'provedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'limitBP', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NegativeRebaseFailedCLBalanceMismatch',
  },
  {
    type: 'error',
    inputs: [],
    name: 'NegativeRebaseFailedSecondOpinionReportIsNotReady',
  },
  {
    type: 'error',
    inputs: [
      { name: 'reportedValue', internalType: 'uint256', type: 'uint256' },
      { name: 'provedValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NegativeRebaseFailedWithdrawalVaultBalanceMismatch',
  },
  { type: 'error', inputs: [], name: 'NegativeTotalPooledEther' },
  { type: 'error', inputs: [], name: 'TooHighTokenRebaseLimit' },
  { type: 'error', inputs: [], name: 'TooLowTokenRebaseLimit' },
  {
    type: 'error',
    inputs: [
      { name: 'maxItemsCount', internalType: 'uint256', type: 'uint256' },
      { name: 'receivedItemsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TooManyItemsPerExtraDataTransaction',
  },
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
        name: 'appearedValidatorsPerDayLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AppearedValidatorsPerDayLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'clBalanceOraclesErrorUpperBPLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'CLBalanceOraclesErrorUpperBPLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'exitedValidatorsPerDayLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExitedValidatorsPerDayLimitSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'inactivityPenaltiesAmountPWei',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'InactivityPenaltiesAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'initialSlashingAmountPWei',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'InitialSlashingAmountSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxItemsPerExtraDataTransaction',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxItemsPerExtraDataTransactionSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'maxNodeOperatorsPerExtraDataItem',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MaxNodeOperatorsPerExtraDataItemSet',
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
        name: 'refSlot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'clTotalBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'clBalanceDecrease',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'maxAllowedCLRebaseNegativeSum',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NegativeCLRebaseAccepted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'refSlot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'clBalanceWei',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'withdrawalVaultBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NegativeCLRebaseConfirmed',
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
        name: 'secondOpinionOracle',
        internalType: 'contract ISecondOpinionOracle',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'SecondOpinionOracleChanged',
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
    name: 'APPEARED_VALIDATORS_PER_DAY_LIMIT_MANAGER_ROLE',
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
    name: 'EXITED_VALIDATORS_PER_DAY_LIMIT_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'INITIAL_SLASHING_AND_PENALTIES_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_ITEMS_PER_EXTRA_DATA_TRANSACTION_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_NODE_OPERATORS_PER_EXTRA_DATA_ITEM_ROLE',
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
    name: 'REQUEST_TIMESTAMP_MARGIN_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SECOND_OPINION_MANAGER_ROLE',
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
    stateMutability: 'nonpayable',
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
      {
        name: '_extraDataListItemsCount',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'checkExtraDataItemsCountPerTransaction',
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
            name: 'exitedValidatorsPerDayLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'appearedValidatorsPerDayLimit',
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
            name: 'maxItemsPerExtraDataTransaction',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItem',
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
          {
            name: 'initialSlashingAmountPWei',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'inactivityPenaltiesAmountPWei',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'clBalanceOraclesErrorUpperBPLimit',
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
    name: 'getReportDataCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'reportData',
    outputs: [
      { name: 'timestamp', internalType: 'uint64', type: 'uint64' },
      { name: 'totalExitedValidators', internalType: 'uint64', type: 'uint64' },
      { name: 'negativeCLRebaseWei', internalType: 'uint128', type: 'uint128' },
    ],
    stateMutability: 'view',
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
    inputs: [],
    name: 'secondOpinionOracle',
    outputs: [
      {
        name: '',
        internalType: 'contract ISecondOpinionOracle',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
        name: '_appearedValidatorsPerDayLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setAppearedValidatorsPerDayLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_exitedValidatorsPerDayLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setExitedValidatorsPerDayLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_initialSlashingAmountPWei',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_inactivityPenaltiesAmountPWei',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setInitialSlashingAndPenaltiesAmount',
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
        name: '_maxItemsPerExtraDataTransaction',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxItemsPerExtraDataTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_maxNodeOperatorsPerExtraDataItem',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setMaxNodeOperatorsPerExtraDataItem',
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
        name: '_limitsList',
        internalType: 'struct LimitsList',
        type: 'tuple',
        components: [
          {
            name: 'exitedValidatorsPerDayLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'appearedValidatorsPerDayLimit',
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
            name: 'maxItemsPerExtraDataTransaction',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'maxNodeOperatorsPerExtraDataItem',
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
          {
            name: 'initialSlashingAmountPWei',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'inactivityPenaltiesAmountPWei',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'clBalanceOraclesErrorUpperBPLimit',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
      {
        name: '_secondOpinionOracle',
        internalType: 'contract ISecondOpinionOracle',
        type: 'address',
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
        name: '_secondOpinionOracle',
        internalType: 'contract ISecondOpinionOracle',
        type: 'address',
      },
      {
        name: '_clBalanceOraclesErrorUpperBPLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setSecondOpinionOracleAndCLBalanceUpperMargin',
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
