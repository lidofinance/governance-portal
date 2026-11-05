//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VaultFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_lidoLocator', internalType: 'address', type: 'address' },
      { name: '_beacon', internalType: 'address', type: 'address' },
      { name: '_dashboardImpl', internalType: 'address', type: 'address' },
      { name: '_previousFactory', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'CloneArgumentsTooLong' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'InsufficientFunds' },
  {
    type: 'error',
    inputs: [{ name: 'argument', internalType: 'string', type: 'string' }],
    name: 'ZeroArgument',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'dashboard',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'admin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DashboardCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'VaultCreated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BEACON',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DASHBOARD_IMPL',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'LIDO_LOCATOR',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PREVIOUS_FACTORY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_defaultAdmin', internalType: 'address', type: 'address' },
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      {
        name: '_nodeOperatorManager',
        internalType: 'address',
        type: 'address',
      },
      { name: '_nodeOperatorFeeBP', internalType: 'uint256', type: 'uint256' },
      { name: '_confirmExpiry', internalType: 'uint256', type: 'uint256' },
      {
        name: '_roleAssignments',
        internalType: 'struct Permissions.RoleAssignment[]',
        type: 'tuple[]',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'role', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'createVaultWithDashboard',
    outputs: [
      {
        name: 'vault',
        internalType: 'contract IStakingVault',
        type: 'address',
      },
      {
        name: 'dashboard',
        internalType: 'contract Dashboard',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_defaultAdmin', internalType: 'address', type: 'address' },
      { name: '_nodeOperator', internalType: 'address', type: 'address' },
      {
        name: '_nodeOperatorManager',
        internalType: 'address',
        type: 'address',
      },
      { name: '_nodeOperatorFeeBP', internalType: 'uint256', type: 'uint256' },
      { name: '_confirmExpiry', internalType: 'uint256', type: 'uint256' },
      {
        name: '_roleAssignments',
        internalType: 'struct Permissions.RoleAssignment[]',
        type: 'tuple[]',
        components: [
          { name: 'account', internalType: 'address', type: 'address' },
          { name: 'role', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
    ],
    name: 'createVaultWithDashboardWithoutConnectingToVaultHub',
    outputs: [
      {
        name: 'vault',
        internalType: 'contract IStakingVault',
        type: 'address',
      },
      {
        name: 'dashboard',
        internalType: 'contract Dashboard',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_vault', internalType: 'address', type: 'address' }],
    name: 'deployedVaults',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const;
