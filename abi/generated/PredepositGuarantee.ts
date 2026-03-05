//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PredepositGuarantee
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const predepositGuaranteeAbi = [
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
      { name: '_genesisForkVersion', internalType: 'bytes4', type: 'bytes4' },
      { name: '_gIFirstValidator', internalType: 'GIndex', type: 'bytes32' },
      {
        name: '_gIFirstValidatorAfterChange',
        internalType: 'GIndex',
        type: 'bytes32',
      },
      { name: '_pivotSlot', internalType: 'uint64', type: 'uint64' },
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
  { type: 'error', inputs: [], name: 'ArrayLengthsNotMatch' },
  { type: 'error', inputs: [], name: 'CompensateFailed' },
  { type: 'error', inputs: [], name: 'EmptyDeposits' },
  { type: 'error', inputs: [], name: 'IndexOutOfRange' },
  { type: 'error', inputs: [], name: 'InputHasInfinityPoints' },
  {
    type: 'error',
    inputs: [
      {
        name: 'component',
        internalType: 'enum BLS12_381.Component',
        type: 'uint8',
      },
    ],
    name: 'InvalidCompressedComponent',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'component',
        internalType: 'enum BLS12_381.Component',
        type: 'uint8',
      },
    ],
    name: 'InvalidCompressedComponentSignBit',
  },
  { type: 'error', inputs: [], name: 'InvalidDepositAmount' },
  { type: 'error', inputs: [], name: 'InvalidDepositYLength' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  { type: 'error', inputs: [], name: 'InvalidPubkeyLength' },
  { type: 'error', inputs: [], name: 'InvalidSignature' },
  { type: 'error', inputs: [], name: 'InvalidSignatureLength' },
  { type: 'error', inputs: [], name: 'InvalidSlot' },
  {
    type: 'error',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidTopUpAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
      {
        name: 'stage',
        internalType: 'enum IPredepositGuarantee.ValidatorStage',
        type: 'uint8',
      },
    ],
    name: 'InvalidValidatorStage',
  },
  {
    type: 'error',
    inputs: [{ name: 'locked', internalType: 'uint256', type: 'uint256' }],
    name: 'LockedIsNotZero',
  },
  { type: 'error', inputs: [], name: 'NotDepositor' },
  {
    type: 'error',
    inputs: [
      { name: 'unlocked', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NotEnoughUnlocked',
  },
  { type: 'error', inputs: [], name: 'NotGuarantor' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  { type: 'error', inputs: [], name: 'NotStakingVaultOwner' },
  { type: 'error', inputs: [], name: 'NothingToRefund' },
  { type: 'error', inputs: [], name: 'PauseUntilMustBeInFuture' },
  { type: 'error', inputs: [], name: 'PausedExpected' },
  {
    type: 'error',
    inputs: [
      { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
      { name: 'depositAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'PredepositAmountInvalid',
  },
  { type: 'error', inputs: [], name: 'RefundFailed' },
  { type: 'error', inputs: [], name: 'ResumedExpected' },
  { type: 'error', inputs: [], name: 'RootNotFound' },
  { type: 'error', inputs: [], name: 'SameDepositor' },
  { type: 'error', inputs: [], name: 'SameGuarantor' },
  {
    type: 'error',
    inputs: [
      { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
      {
        name: 'stage',
        internalType: 'enum IPredepositGuarantee.ValidatorStage',
        type: 'uint8',
      },
    ],
    name: 'ValidatorNotActivated',
  },
  {
    type: 'error',
    inputs: [{ name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'ValidatorNotEligibleForActivation',
  },
  {
    type: 'error',
    inputs: [
      { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
      {
        name: 'stage',
        internalType: 'enum IPredepositGuarantee.ValidatorStage',
        type: 'uint8',
      },
    ],
    name: 'ValidatorNotNew',
  },
  {
    type: 'error',
    inputs: [
      { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
      {
        name: 'stage',
        internalType: 'enum IPredepositGuarantee.ValidatorStage',
        type: 'uint8',
      },
    ],
    name: 'ValidatorNotPreDeposited',
  },
  {
    type: 'error',
    inputs: [
      { name: 'validatorPubkey', internalType: 'bytes', type: 'bytes' },
      {
        name: 'stage',
        internalType: 'enum IPredepositGuarantee.ValidatorStage',
        type: 'uint8',
      },
    ],
    name: 'ValidatorNotProven',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'ValueNotMultipleOfPredepositAmount',
  },
  {
    type: 'error',
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8' }],
    name: 'WithdrawalCredentialsInvalidVersion',
  },
  { type: 'error', inputs: [], name: 'WithdrawalCredentialsMatch' },
  {
    type: 'error',
    inputs: [
      {
        name: 'withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'WithdrawalCredentialsMisformed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'stakingVault', internalType: 'address', type: 'address' },
      {
        name: 'withdrawalCredentialsAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'WithdrawalCredentialsMismatch',
  },
  { type: 'error', inputs: [], name: 'WithdrawalFailed' },
  {
    type: 'error',
    inputs: [{ name: 'argument', internalType: 'string', type: 'string' }],
    name: 'ZeroArgument',
  },
  { type: 'error', inputs: [], name: 'ZeroPauseDuration' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'total',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'locked',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'BalanceLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'BalanceRefunded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
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
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BalanceToppedUp',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'total',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'locked',
        internalType: 'uint128',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'BalanceUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
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
    name: 'BalanceWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newDepositor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'prevDepositor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DepositorSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guarantor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nodeOperator',
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
    name: 'GuarantorRefundAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'guarantor',
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
    name: 'GuarantorRefundClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newGuarantor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'prevGuarantor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'GuarantorSet',
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
        name: 'validatorPubkey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'stakingVault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ValidatorActivated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stakingVault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'validatorPubkey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
      {
        name: 'guaranteeTotal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'guaranteeLocked',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ValidatorCompensated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'validatorPubkey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'stakingVault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ValidatorPreDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'validatorPubkey',
        internalType: 'bytes',
        type: 'bytes',
        indexed: true,
      },
      {
        name: 'nodeOperator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'stakingVault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ValidatorProven',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ACTIVATION_DEPOSIT_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BEACON_ROOTS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    name: 'DEPOSIT_DOMAIN',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_VALIDATOR_CURR',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_VALIDATOR_PREV',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_PUBKEY_WC_PARENT',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_STATE_ROOT',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_SUPPORTED_WC_VERSION',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_TOPUP_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_SUPPORTED_WC_VERSION',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
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
    name: 'PIVOT_SLOT',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PREDEPOSIT_AMOUNT',
    outputs: [{ name: '', internalType: 'uint128', type: 'uint128' }],
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
    inputs: [{ name: '_pubkey', internalType: 'bytes', type: 'bytes' }],
    name: 'activateValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'claimGuarantorRefund',
    outputs: [
      { name: 'claimedEther', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_guarantor', internalType: 'address', type: 'address' }],
    name: 'claimableRefund',
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
      { name: '_defaultAdmin', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'nodeOperatorBalance',
    outputs: [
      {
        name: '',
        internalType: 'struct PredepositGuarantee.NodeOperatorBalance',
        type: 'tuple',
        components: [
          { name: 'total', internalType: 'uint128', type: 'uint128' },
          { name: 'locked', internalType: 'uint128', type: 'uint128' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'nodeOperatorDepositor',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'nodeOperatorGuarantor',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_duration', internalType: 'uint256', type: 'uint256' }],
    name: 'pauseFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_pauseUntilInclusive',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'pauseUntil',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_vault',
        internalType: 'contract IStakingVault',
        type: 'address',
      },
    ],
    name: 'pendingActivations',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_stakingVault',
        internalType: 'contract IStakingVault',
        type: 'address',
      },
      {
        name: '_deposits',
        internalType: 'struct IStakingVault.Deposit[]',
        type: 'tuple[]',
        components: [
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      {
        name: '_depositsY',
        internalType: 'struct BLS12_381.DepositY[]',
        type: 'tuple[]',
        components: [
          {
            name: 'pubkeyY',
            internalType: 'struct BLS12_381.Fp',
            type: 'tuple',
            components: [
              { name: 'a', internalType: 'bytes32', type: 'bytes32' },
              { name: 'b', internalType: 'bytes32', type: 'bytes32' },
            ],
          },
          {
            name: 'signatureY',
            internalType: 'struct BLS12_381.Fp2',
            type: 'tuple',
            components: [
              { name: 'c0_a', internalType: 'bytes32', type: 'bytes32' },
              { name: 'c0_b', internalType: 'bytes32', type: 'bytes32' },
              { name: 'c1_a', internalType: 'bytes32', type: 'bytes32' },
              { name: 'c1_b', internalType: 'bytes32', type: 'bytes32' },
            ],
          },
        ],
      },
    ],
    name: 'predeposit',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_witness',
        internalType: 'struct IPredepositGuarantee.ValidatorWitness',
        type: 'tuple',
        components: [
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorIndex', internalType: 'uint256', type: 'uint256' },
          {
            name: 'childBlockTimestamp',
            internalType: 'uint64',
            type: 'uint64',
          },
          { name: 'slot', internalType: 'uint64', type: 'uint64' },
          { name: 'proposerIndex', internalType: 'uint64', type: 'uint64' },
        ],
      },
      {
        name: '_invalidWithdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'proveInvalidValidatorWC',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_witness',
        internalType: 'struct IPredepositGuarantee.ValidatorWitness',
        type: 'tuple',
        components: [
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorIndex', internalType: 'uint256', type: 'uint256' },
          {
            name: 'childBlockTimestamp',
            internalType: 'uint64',
            type: 'uint64',
          },
          { name: 'slot', internalType: 'uint64', type: 'uint64' },
          { name: 'proposerIndex', internalType: 'uint64', type: 'uint64' },
        ],
      },
      {
        name: '_stakingVault',
        internalType: 'contract IStakingVault',
        type: 'address',
      },
    ],
    name: 'proveUnknownValidator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_witnesses',
        internalType: 'struct IPredepositGuarantee.ValidatorWitness[]',
        type: 'tuple[]',
        components: [
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorIndex', internalType: 'uint256', type: 'uint256' },
          {
            name: 'childBlockTimestamp',
            internalType: 'uint64',
            type: 'uint64',
          },
          { name: 'slot', internalType: 'uint64', type: 'uint64' },
          { name: 'proposerIndex', internalType: 'uint64', type: 'uint64' },
        ],
      },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'proveWCActivateAndTopUpValidators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_witness',
        internalType: 'struct IPredepositGuarantee.ValidatorWitness',
        type: 'tuple',
        components: [
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorIndex', internalType: 'uint256', type: 'uint256' },
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
    name: 'proveWCAndActivate',
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
      { name: '_newDepositor', internalType: 'address', type: 'address' },
    ],
    name: 'setNodeOperatorDepositor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_newGuarantor', internalType: 'address', type: 'address' },
    ],
    name: 'setNodeOperatorGuarantor',
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
      {
        name: '_topUps',
        internalType: 'struct PredepositGuarantee.ValidatorTopUp[]',
        type: 'tuple[]',
        components: [
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'topUpExistingValidators',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'topUpNodeOperatorBalance',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
    ],
    name: 'unlockedBalance',
    outputs: [{ name: 'unlocked', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_witness',
        internalType: 'struct IPredepositGuarantee.ValidatorWitness',
        type: 'tuple',
        components: [
          { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'validatorIndex', internalType: 'uint256', type: 'uint256' },
          {
            name: 'childBlockTimestamp',
            internalType: 'uint64',
            type: 'uint64',
          },
          { name: 'slot', internalType: 'uint64', type: 'uint64' },
          { name: 'proposerIndex', internalType: 'uint64', type: 'uint64' },
        ],
      },
      {
        name: '_withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'validatePubKeyWCProof',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_validatorPubkey', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'validatorStatus',
    outputs: [
      {
        name: '',
        internalType: 'struct IPredepositGuarantee.ValidatorStatus',
        type: 'tuple',
        components: [
          {
            name: 'stage',
            internalType: 'enum IPredepositGuarantee.ValidatorStage',
            type: 'uint8',
          },
          {
            name: 'stakingVault',
            internalType: 'contract IStakingVault',
            type: 'address',
          },
          { name: 'nodeOperator', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_deposit',
        internalType: 'struct IStakingVault.Deposit',
        type: 'tuple',
        components: [
          { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'depositDataRoot', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      {
        name: '_depositsY',
        internalType: 'struct BLS12_381.DepositY',
        type: 'tuple',
        components: [
          {
            name: 'pubkeyY',
            internalType: 'struct BLS12_381.Fp',
            type: 'tuple',
            components: [
              { name: 'a', internalType: 'bytes32', type: 'bytes32' },
              { name: 'b', internalType: 'bytes32', type: 'bytes32' },
            ],
          },
          {
            name: 'signatureY',
            internalType: 'struct BLS12_381.Fp2',
            type: 'tuple',
            components: [
              { name: 'c0_a', internalType: 'bytes32', type: 'bytes32' },
              { name: 'c0_b', internalType: 'bytes32', type: 'bytes32' },
              { name: 'c1_a', internalType: 'bytes32', type: 'bytes32' },
              { name: 'c1_b', internalType: 'bytes32', type: 'bytes32' },
            ],
          },
        ],
      },
      {
        name: '_withdrawalCredentials',
        internalType: 'bytes32',
        type: 'bytes32',
      },
    ],
    name: 'verifyDepositMessage',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_recipient', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawNodeOperatorBalance',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
