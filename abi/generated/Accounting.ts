//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Accounting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accountingAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'implementation_', internalType: 'address', type: 'address' },
      { name: 'admin_', internalType: 'address', type: 'address' },
      { name: 'data_', internalType: 'bytes', type: 'bytes' },
    ],
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
  { type: 'error', inputs: [], name: 'FailedCall' },
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
  {
    type: 'constructor',
    inputs: [
      { name: 'lidoLocator', internalType: 'address', type: 'address' },
      { name: 'module', internalType: 'address', type: 'address' },
      { name: 'feeDistributor', internalType: 'address', type: 'address' },
      { name: 'minBondLockPeriod', internalType: 'uint256', type: 'uint256' },
      { name: 'maxBondLockPeriod', internalType: 'uint256', type: 'uint256' },
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
  { type: 'error', inputs: [], name: 'BondLockNotExpired' },
  { type: 'error', inputs: [], name: 'FailedToSendEther' },
  {
    type: 'error',
    inputs: [],
    name: 'FeeSplitsChangeWithUndistributedRewards',
  },
  { type: 'error', inputs: [], name: 'InvalidBondCurveId' },
  { type: 'error', inputs: [], name: 'InvalidBondCurveLength' },
  { type: 'error', inputs: [], name: 'InvalidBondCurveValues' },
  { type: 'error', inputs: [], name: 'InvalidBondLockAmount' },
  { type: 'error', inputs: [], name: 'InvalidBondLockPeriod' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidInitializationCurveId' },
  { type: 'error', inputs: [], name: 'InvalidSplitRecipient' },
  { type: 'error', inputs: [], name: 'NoBondLocked' },
  { type: 'error', inputs: [], name: 'NodeOperatorDoesNotExist' },
  { type: 'error', inputs: [], name: 'NotAllowedToRecover' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NothingToClaim' },
  { type: 'error', inputs: [], name: 'PauseUntilMustBeInFuture' },
  { type: 'error', inputs: [], name: 'PausedExpected' },
  { type: 'error', inputs: [], name: 'PendingSharesExist' },
  { type: 'error', inputs: [], name: 'ResumedExpected' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  { type: 'error', inputs: [], name: 'SameAddress' },
  { type: 'error', inputs: [], name: 'SameBondCurveId' },
  { type: 'error', inputs: [], name: 'SenderIsNotEligible' },
  { type: 'error', inputs: [], name: 'SenderIsNotModule' },
  { type: 'error', inputs: [], name: 'TooManySplitShares' },
  { type: 'error', inputs: [], name: 'TooManySplits' },
  { type: 'error', inputs: [], name: 'ZeroAdminAddress' },
  { type: 'error', inputs: [], name: 'ZeroChargePenaltyRecipientAddress' },
  { type: 'error', inputs: [], name: 'ZeroFeeDistributorAddress' },
  { type: 'error', inputs: [], name: 'ZeroLocatorAddress' },
  { type: 'error', inputs: [], name: 'ZeroModuleAddress' },
  { type: 'error', inputs: [], name: 'ZeroPauseDuration' },
  { type: 'error', inputs: [], name: 'ZeroSplitRecipient' },
  { type: 'error', inputs: [], name: 'ZeroSplitShare' },
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
        name: 'burnedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondBurned',
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
        name: 'amountToCharge',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'chargedAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondCharged',
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
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondClaimedStETH',
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
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'requestId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondClaimedUnstETH',
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
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondClaimedWstETH',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'curveId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'bondCurveIntervals',
        internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
          { name: 'trend', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'BondCurveAdded',
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
        name: 'curveId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'setter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BondCurveSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'curveId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'bondCurveIntervals',
        internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
          { name: 'trend', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'BondCurveUpdated',
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
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondDebtCovered',
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
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondDebtIncreased',
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
        name: 'from',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondDepositedETH',
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
        name: 'from',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondDepositedStETH',
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
        name: 'from',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondDepositedWstETH',
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
        name: 'newAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'until',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondLockChanged',
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
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondLockCompensated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'period',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BondLockPeriodChanged',
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
    ],
    name: 'BondLockRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'chargePenaltyRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ChargePenaltyRecipientSet',
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
        name: 'rewardsClaimer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'CustomRewardsClaimerSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC1155Recovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC20Recovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ERC721Recovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'EtherRecovered',
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
    ],
    name: 'ExpiredBondLockRemoved',
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
        name: 'feeSplits',
        internalType: 'struct IFeeSplits.FeeSplit[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'share', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'FeeSplitsSet',
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
        name: 'duration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Paused',
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
        name: 'pendingSharesToSplit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PendingSharesToSplitChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'Resumed' },
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
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'shares',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StETHSharesRecovered',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BURNER',
    outputs: [{ name: '', internalType: 'contract IBurner', type: 'address' }],
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
    name: 'DEFAULT_BOND_CURVE_ID',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_DISTRIBUTOR',
    outputs: [
      { name: '', internalType: 'contract IFeeDistributor', type: 'address' },
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
    name: 'LIDO_LOCATOR',
    outputs: [
      { name: '', internalType: 'contract ILidoLocator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MANAGE_BOND_CURVES_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_BOND_LOCK_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_FEE_SPLITS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_BOND_LOCK_PERIOD',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    name: 'PAUSE_INFINITELY',
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
    name: 'RECOVERER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RESUME_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SET_BOND_CURVE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WITHDRAWAL_QUEUE',
    outputs: [
      { name: '', internalType: 'contract IWithdrawalQueue', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WSTETH',
    outputs: [{ name: '', internalType: 'contract IWstETH', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'bondCurve',
        internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
          { name: 'trend', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'addBondCurve',
    outputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'chargeFee',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'chargePenaltyRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'stETHAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'cumulativeFeeShares', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'claimRewardsStETH',
    outputs: [
      { name: 'claimedShares', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'stETHAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'cumulativeFeeShares', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'claimRewardsUnstETH',
    outputs: [{ name: 'requestId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'wstETHAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'cumulativeFeeShares', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'claimRewardsWstETH',
    outputs: [
      { name: 'claimedWstETH', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'compensateLockedBond',
    outputs: [
      { name: 'compensatedAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'depositETH',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'stETHAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'permit',
        internalType: 'struct IAccounting.PermitInput',
        type: 'tuple',
        components: [
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'depositStETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'stETHAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'permit',
        internalType: 'struct IAccounting.PermitInput',
        type: 'tuple',
        components: [
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'depositStETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'wstETHAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'permit',
        internalType: 'struct IAccounting.PermitInput',
        type: 'tuple',
        components: [
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'depositWstETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'wstETHAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: 'permit',
        internalType: 'struct IAccounting.PermitInput',
        type: 'tuple',
        components: [
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'deadline', internalType: 'uint256', type: 'uint256' },
          { name: 'v', internalType: 'uint8', type: 'uint8' },
          { name: 'r', internalType: 'bytes32', type: 'bytes32' },
          { name: 's', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'depositWstETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalizeUpgradeV3',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'keys', internalType: 'uint256', type: 'uint256' },
      { name: 'curveId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondAmountByKeysCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'keysCount', internalType: 'uint256', type: 'uint256' },
      { name: 'curveId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondAmountByKeysCountWstETH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondCurve',
    outputs: [
      {
        name: '',
        internalType: 'struct IBondCurve.BondCurveData',
        type: 'tuple',
        components: [
          {
            name: 'intervals',
            internalType: 'struct IBondCurve.BondCurveInterval[]',
            type: 'tuple[]',
            components: [
              {
                name: 'minKeysCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'minBond', internalType: 'uint256', type: 'uint256' },
              { name: 'trend', internalType: 'uint256', type: 'uint256' },
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
    ],
    name: 'getBondCurveId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondDebt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondLockPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondSummary',
    outputs: [
      { name: 'current', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getBondSummaryShares',
    outputs: [
      { name: 'current', internalType: 'uint256', type: 'uint256' },
      { name: 'required', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getClaimableBondShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'cumulativeFeeShares', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'getClaimableRewardsAndBondShares',
    outputs: [
      { name: 'claimableShares', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'curveId', internalType: 'uint256', type: 'uint256' }],
    name: 'getCurveInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IBondCurve.BondCurveData',
        type: 'tuple',
        components: [
          {
            name: 'intervals',
            internalType: 'struct IBondCurve.BondCurveInterval[]',
            type: 'tuple[]',
            components: [
              {
                name: 'minKeysCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'minBond', internalType: 'uint256', type: 'uint256' },
              { name: 'trend', internalType: 'uint256', type: 'uint256' },
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
    name: 'getCurvesCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getCustomRewardsClaimer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'splittableShares', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getFeeSplitTransfers',
    outputs: [
      {
        name: 'transfers',
        internalType: 'struct IFeeSplits.SplitTransfer[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'shares', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getFeeSplits',
    outputs: [
      {
        name: '',
        internalType: 'struct IFeeSplits.FeeSplit[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'share', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getInitializedVersion',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'curveId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getKeysCountByBondAmount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLockedBond',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLockedBondInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IBondLock.BondLockData',
        type: 'tuple',
        components: [
          { name: 'amount', internalType: 'uint128', type: 'uint128' },
          { name: 'until', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getNodeOperatorBondInfo',
    outputs: [
      {
        name: 'info',
        internalType: 'struct IAccounting.NodeOperatorBondInfo',
        type: 'tuple',
        components: [
          { name: 'currentBond', internalType: 'uint256', type: 'uint256' },
          { name: 'requiredBond', internalType: 'uint256', type: 'uint256' },
          { name: 'lockedBond', internalType: 'uint256', type: 'uint256' },
          { name: 'bondDebt', internalType: 'uint256', type: 'uint256' },
          {
            name: 'pendingSharesToSplit',
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
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPendingSharesToSplit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'additionalKeys', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequiredBondForNextKeys',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'additionalKeys', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRequiredBondForNextKeysWstETH',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getResumeSinceTimestamp',
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
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMembers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUnbondedKeysCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getUnbondedKeysCountToEject',
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
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'hasSplits',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'bondCurve',
        internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
          { name: 'trend', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'bondLockPeriod', internalType: 'uint256', type: 'uint256' },
      {
        name: '_chargePenaltyRecipient',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isLockExpired',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'lockBond',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'pauseFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'penalize',
    outputs: [{ name: 'penaltyCovered', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'cumulativeFeeShares', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'pullAndSplitFeeRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC1155',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC721',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recoverEther',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'recoverStETHShares',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'releaseLockedBond',
    outputs: [{ name: 'released', internalType: 'bool', type: 'bool' }],
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
    inputs: [],
    name: 'resume',
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
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'curveId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setBondCurve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'period', internalType: 'uint256', type: 'uint256' }],
    name: 'setBondLockPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_chargePenaltyRecipient',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setChargePenaltyRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsClaimer', internalType: 'address', type: 'address' },
    ],
    name: 'setCustomRewardsClaimer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      { name: 'maxAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'settleLockedBond',
    outputs: [
      { name: 'amountSettled', internalType: 'uint256', type: 'uint256' },
    ],
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
    name: 'totalBondShares',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unlockExpiredLock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'curveId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'bondCurve',
        internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
          { name: 'trend', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'updateBondCurve',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'nodeOperatorId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'feeSplits',
        internalType: 'struct IFeeSplits.FeeSplit[]',
        type: 'tuple[]',
        components: [
          { name: 'recipient', internalType: 'address', type: 'address' },
          { name: 'share', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'cumulativeFeeShares', internalType: 'uint256', type: 'uint256' },
      { name: 'rewardsProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'updateFeeSplits',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
