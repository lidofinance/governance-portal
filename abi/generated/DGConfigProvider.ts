//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DGConfigProvider
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dgConfigProviderAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'dualGovernanceConfig',
        internalType: 'struct DualGovernanceConfig.Context',
        type: 'tuple',
        components: [
          {
            name: 'firstSealRageQuitSupport',
            internalType: 'PercentD16',
            type: 'uint256',
          },
          {
            name: 'secondSealRageQuitSupport',
            internalType: 'PercentD16',
            type: 'uint256',
          },
          {
            name: 'minAssetsLockDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingMinDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingMaxDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingMinActiveDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingDeactivationMaxDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoCooldownDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitExtensionPeriodDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitEthWithdrawalsMinDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitEthWithdrawalsMaxDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitEthWithdrawalsDelayGrowth',
            internalType: 'Duration',
            type: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FIRST_SEAL_RAGE_QUIT_SUPPORT',
    outputs: [{ name: '', internalType: 'PercentD16', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_ASSETS_LOCK_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RAGE_QUIT_ETH_WITHDRAWALS_DELAY_GROWTH',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RAGE_QUIT_ETH_WITHDRAWALS_MAX_DELAY',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RAGE_QUIT_ETH_WITHDRAWALS_MIN_DELAY',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RAGE_QUIT_EXTENSION_PERIOD_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SECOND_SEAL_RAGE_QUIT_SUPPORT',
    outputs: [{ name: '', internalType: 'PercentD16', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VETO_COOLDOWN_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VETO_SIGNALLING_DEACTIVATION_MAX_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VETO_SIGNALLING_MAX_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VETO_SIGNALLING_MIN_ACTIVE_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VETO_SIGNALLING_MIN_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDualGovernanceConfig',
    outputs: [
      {
        name: 'config',
        internalType: 'struct DualGovernanceConfig.Context',
        type: 'tuple',
        components: [
          {
            name: 'firstSealRageQuitSupport',
            internalType: 'PercentD16',
            type: 'uint256',
          },
          {
            name: 'secondSealRageQuitSupport',
            internalType: 'PercentD16',
            type: 'uint256',
          },
          {
            name: 'minAssetsLockDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingMinDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingMaxDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingMinActiveDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoSignallingDeactivationMaxDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'vetoCooldownDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitExtensionPeriodDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitEthWithdrawalsMinDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitEthWithdrawalsMaxDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitEthWithdrawalsDelayGrowth',
            internalType: 'Duration',
            type: 'uint32',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'rageQuitEthWithdrawalsMinDelay',
        internalType: 'Duration',
        type: 'uint32',
      },
      {
        name: 'rageQuitEthWithdrawalsMaxDelay',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidRageQuitEthWithdrawalsDelayRange',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'firstSealRageQuitSupport',
        internalType: 'PercentD16',
        type: 'uint256',
      },
      {
        name: 'secondSealRageQuitSupport',
        internalType: 'PercentD16',
        type: 'uint256',
      },
    ],
    name: 'InvalidRageQuitSupportRange',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'vetoSignallingMinDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
      {
        name: 'vetoSignallingMaxDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidVetoSignallingDurationRange',
  },
] as const;
