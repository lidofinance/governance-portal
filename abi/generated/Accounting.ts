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
      {
        name: '_lidoLocator',
        internalType: 'contract ILidoLocator',
        type: 'address',
      },
      { name: '_lido', internalType: 'contract ILido', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'reportTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'upperBoundTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectReportTimestamp',
  },
  {
    type: 'error',
    inputs: [
      { name: 'reportValidators', internalType: 'uint256', type: 'uint256' },
      { name: 'minValidators', internalType: 'uint256', type: 'uint256' },
      { name: 'maxValidators', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectReportValidators',
  },
  { type: 'error', inputs: [], name: 'InternalSharesCantBeZero' },
  {
    type: 'error',
    inputs: [
      { name: 'operation', internalType: 'string', type: 'string' },
      { name: 'addr', internalType: 'address', type: 'address' },
    ],
    name: 'NotAuthorized',
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
    inputs: [
      {
        name: '_report',
        internalType: 'struct ReportValues',
        type: 'tuple',
        components: [
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'timeElapsed', internalType: 'uint256', type: 'uint256' },
          { name: 'clValidators', internalType: 'uint256', type: 'uint256' },
          { name: 'clBalance', internalType: 'uint256', type: 'uint256' },
          {
            name: 'withdrawalVaultBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'elRewardsVaultBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'sharesRequestedToBurn',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalFinalizationBatches',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'simulatedShareRate',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'handleOracleReport',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_report',
        internalType: 'struct ReportValues',
        type: 'tuple',
        components: [
          { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
          { name: 'timeElapsed', internalType: 'uint256', type: 'uint256' },
          { name: 'clValidators', internalType: 'uint256', type: 'uint256' },
          { name: 'clBalance', internalType: 'uint256', type: 'uint256' },
          {
            name: 'withdrawalVaultBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'elRewardsVaultBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'sharesRequestedToBurn',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'withdrawalFinalizationBatches',
            internalType: 'uint256[]',
            type: 'uint256[]',
          },
          {
            name: 'simulatedShareRate',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    name: 'simulateOracleReport',
    outputs: [
      {
        name: 'update',
        internalType: 'struct Accounting.CalculatedValues',
        type: 'tuple',
        components: [
          {
            name: 'withdrawalsVaultTransfer',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'elRewardsVaultTransfer',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'etherToFinalizeWQ',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'sharesToFinalizeWQ',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'sharesToBurnForWithdrawals',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'totalSharesToBurn',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'sharesToMintAsFees',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'feeDistribution',
            internalType: 'struct Accounting.FeeDistribution',
            type: 'tuple',
            components: [
              {
                name: 'moduleFeeRecipients',
                internalType: 'address[]',
                type: 'address[]',
              },
              {
                name: 'moduleIds',
                internalType: 'uint256[]',
                type: 'uint256[]',
              },
              {
                name: 'moduleSharesToMint',
                internalType: 'uint256[]',
                type: 'uint256[]',
              },
              {
                name: 'treasurySharesToMint',
                internalType: 'uint256',
                type: 'uint256',
              },
            ],
          },
          {
            name: 'principalClBalance',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'preTotalShares', internalType: 'uint256', type: 'uint256' },
          {
            name: 'preTotalPooledEther',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'postInternalShares',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'postInternalEther',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'postTotalShares', internalType: 'uint256', type: 'uint256' },
          {
            name: 'postTotalPooledEther',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;
