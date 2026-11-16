//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LidoLendOwner
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lidoLendOwnerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'core', internalType: 'contract ILidoLend', type: 'address' },
      { name: 'admin', internalType: 'address', type: 'address' },
      { name: 'marketCreator', internalType: 'address', type: 'address' },
      { name: 'feeManager', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
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
    name: 'FEE_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GUARDIAN_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LIDO_LEND',
    outputs: [
      { name: '', internalType: 'contract ILidoLend', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MARKET_CREATOR_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MARKET_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'guardian', internalType: 'address', type: 'address' },
    ],
    name: 'addGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketParams',
        internalType: 'struct MarketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketParams',
        internalType: 'struct MarketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'controller', internalType: 'address', type: 'address' },
      { name: 'enableSettlement', internalType: 'bool', type: 'bool' },
    ],
    name: 'createMarket',
    outputs: [],
    stateMutability: 'nonpayable',
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
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'guardian', internalType: 'address', type: 'address' },
    ],
    name: 'removeGuardian',
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
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'oldGuardian', internalType: 'address', type: 'address' },
      { name: 'newGuardian', internalType: 'address', type: 'address' },
    ],
    name: 'replaceGuardian',
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
        name: 'marketParams',
        internalType: 'struct MarketParams',
        type: 'tuple',
        components: [
          { name: 'loanToken', internalType: 'address', type: 'address' },
          { name: 'collateralToken', internalType: 'address', type: 'address' },
          { name: 'oracle', internalType: 'address', type: 'address' },
          { name: 'irm', internalType: 'address', type: 'address' },
          { name: 'lltv', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: 'newFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newFeeRecipient', internalType: 'address', type: 'address' },
    ],
    name: 'setFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'quorum', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setGuardiansQuorum',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'suspectWindow', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setGuardiansSuspectWindow',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setInstantActivation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      {
        name: 'config',
        internalType: 'struct CollateralActivationConfig',
        type: 'tuple',
        components: [
          {
            name: 'minActivationDelay',
            internalType: 'uint40',
            type: 'uint40',
          },
          {
            name: 'maxActivationDelay',
            internalType: 'uint40',
            type: 'uint40',
          },
          { name: 'maxDelayInflow', internalType: 'uint128', type: 'uint128' },
          {
            name: 'minDepositAmount',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'activatingLockDuration',
            internalType: 'uint40',
            type: 'uint40',
          },
          {
            name: 'minActivationAmount',
            internalType: 'uint128',
            type: 'uint128',
          },
          {
            name: 'maxGuardiansQuorumDelay',
            internalType: 'uint40',
            type: 'uint40',
          },
          { name: 'delayPerStrike', internalType: 'uint40', type: 'uint40' },
          { name: 'delayPerSuspect', internalType: 'uint40', type: 'uint40' },
        ],
      },
    ],
    name: 'setMarketCollateralActivationConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      {
        name: 'config',
        internalType: 'struct SettlementConfig',
        type: 'tuple',
        components: [
          { name: 'sliceFloorBps', internalType: 'uint16', type: 'uint16' },
          { name: 'sliceFloorAssets', internalType: 'uint96', type: 'uint96' },
          {
            name: 'fullCutBelowCollateral',
            internalType: 'uint96',
            type: 'uint96',
          },
          { name: 'ltvStepBps', internalType: 'uint16', type: 'uint16' },
        ],
      },
    ],
    name: 'setMarketSettlementConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketId', internalType: 'Id', type: 'bytes32' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setMarketSupplyCap',
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
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferLidoLendOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'marketIds', internalType: 'Id[]', type: 'bytes32[]' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'unbanGuardianSignals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'marketId', internalType: 'Id', type: 'bytes32' }],
    name: 'unfreezeMarket',
    outputs: [],
    stateMutability: 'nonpayable',
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
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  {
    type: 'error',
    inputs: [{ name: 'marketId', internalType: 'Id', type: 'bytes32' }],
    name: 'UnknownMarket',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
] as const;
