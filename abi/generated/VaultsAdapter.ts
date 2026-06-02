//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VaultsAdapter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultsAdapterAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_lidoLocator', internalType: 'address', type: 'address' },
      { name: '_evmScriptExecutor', internalType: 'address', type: 'address' },
      {
        name: '_validatorExitFeeLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'badDebtVault',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'vaultAcceptor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'maxSharesToSocialize',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'BadDebtSocializationFailed',
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
      { name: 'pubkeys', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'ForceValidatorExitFailed',
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
      {
        name: 'liabilitySharesTarget',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LiabilitySharesTargetUpdateFailed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newFee',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ValidatorExitFeeLimitUpdated',
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
      {
        name: 'infraFeeBP',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'liquidityFeeBP',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reservationFeeBP',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VaultFeesUpdateFailed',
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
      { name: 'isInJail', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'VaultJailStatusUpdateFailed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WITHDRAWAL_REQUEST_PREDEPLOY_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'evmScriptExecutor',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_pubkeys', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'forceValidatorExit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLocator',
    outputs: [
      { name: '', internalType: 'contract ILidoLocator', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      {
        name: '_liabilitySharesTarget',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setLiabilitySharesTarget',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_validatorExitFeeLimit',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setValidatorExitFeeLimit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_isInJail', internalType: 'bool', type: 'bool' },
    ],
    name: 'setVaultJailStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_badDebtVault', internalType: 'address', type: 'address' },
      { name: '_vaultAcceptor', internalType: 'address', type: 'address' },
      {
        name: '_maxSharesToSocialize',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'socializeBadDebt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_infraFeeBP', internalType: 'uint256', type: 'uint256' },
      { name: '_liquidityFeeBP', internalType: 'uint256', type: 'uint256' },
      { name: '_reservationFeeBP', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateVaultFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'validatorExitFeeLimit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const;
