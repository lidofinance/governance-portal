//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RegistryWithLimits
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registryWithLimitsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_admin', internalType: 'address', type: 'address' },
      {
        name: '_addRecipientToAllowedListRoleHolders',
        internalType: 'address[]',
        type: 'address[]',
      },
      {
        name: '_removeRecipientFromAllowedListRoleHolders',
        internalType: 'address[]',
        type: 'address[]',
      },
      {
        name: '_setParametersRoleHolders',
        internalType: 'address[]',
        type: 'address[]',
      },
      {
        name: '_updateSpentAmountRoleHolders',
        internalType: 'address[]',
        type: 'address[]',
      },
      {
        name: '_bokkyPooBahsDateTimeContract',
        internalType: 'contract IBokkyPooBahsDateTimeContract',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BokkyPooBahsDateTimeContractChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_periodStartTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'CurrentPeriodAdvanced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_limit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_periodDurationMonths',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LimitsParametersChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_title',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'RecipientAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RecipientRemoved',
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
        name: '_alreadySpentAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_spendableBalance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_periodStartTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: '_periodEndTimestamp',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SpendableAmountChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_newSpentAmount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SpentAmountChanged',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADD_RECIPIENT_TO_ALLOWED_LIST_ROLE',
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
    name: 'REMOVE_RECIPIENT_FROM_ALLOWED_LIST_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SET_PARAMETERS_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPDATE_SPENT_AMOUNT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_title', internalType: 'string', type: 'string' },
    ],
    name: 'addRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'allowedRecipients',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'bokkyPooBahsDateTimeContract',
    outputs: [
      {
        name: '',
        internalType: 'contract IBokkyPooBahsDateTimeContract',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllowedRecipients',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLimitParameters',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPeriodState',
    outputs: [
      { name: '_alreadySpentAmount', internalType: 'uint256', type: 'uint256' },
      {
        name: '_spendableBalanceInPeriod',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_periodStartTimestamp',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_periodEndTimestamp', internalType: 'uint256', type: 'uint256' },
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
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'isRecipientAllowed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_payoutAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_motionDuration', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isUnderSpendableBalance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'removeRecipient',
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
      {
        name: '_bokkyPooBahsDateTimeContract',
        internalType: 'address',
        type: 'address',
      },
    ],
    name: 'setBokkyPooBahsDateTimeContract',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_limit', internalType: 'uint256', type: 'uint256' },
      {
        name: '_periodDurationMonths',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setLimitParameters',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'spendableBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
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
      { name: '_newSpentAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'unsafeSetSpentAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_payoutAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateSpentAmount',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const
