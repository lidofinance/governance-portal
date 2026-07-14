//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CSCurveSetup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const csCurveSetupAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'accounting_', internalType: 'address', type: 'address' },
      { name: 'registry_', internalType: 'address', type: 'address' },
      {
        name: 'params',
        internalType: 'struct IOneShotCurveSetup.ConstructorParams',
        type: 'tuple',
        components: [
          {
            name: 'bondCurve',
            internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
            type: 'tuple[]',
            components: [
              {
                name: 'minKeysCount',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'trend', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'keyRemovalCharge',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'generalDelayedPenaltyFine',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'keysLimit',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'queueConfig',
            internalType: 'struct IOneShotCurveSetup.QueueConfigOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'priority', internalType: 'uint256', type: 'uint256' },
              { name: 'maxDeposits', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'rewardShareData',
            internalType:
              'struct IOneShotCurveSetup.KeyNumberValueIntervalsOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              {
                name: 'data',
                internalType:
                  'struct IParametersRegistry.KeyNumberValueInterval[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'minKeyNumber',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
              },
            ],
          },
          {
            name: 'performanceLeewayData',
            internalType:
              'struct IOneShotCurveSetup.KeyNumberValueIntervalsOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              {
                name: 'data',
                internalType:
                  'struct IParametersRegistry.KeyNumberValueInterval[]',
                type: 'tuple[]',
                components: [
                  {
                    name: 'minKeyNumber',
                    internalType: 'uint256',
                    type: 'uint256',
                  },
                  { name: 'value', internalType: 'uint256', type: 'uint256' },
                ],
              },
            ],
          },
          {
            name: 'strikesParams',
            internalType: 'struct IOneShotCurveSetup.StrikesOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'lifetime', internalType: 'uint256', type: 'uint256' },
              { name: 'threshold', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'badPerformancePenalty',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'performanceCoefficients',
            internalType:
              'struct IOneShotCurveSetup.PerformanceCoefficientsOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              {
                name: 'attestationsWeight',
                internalType: 'uint256',
                type: 'uint256',
              },
              {
                name: 'blocksWeight',
                internalType: 'uint256',
                type: 'uint256',
              },
              { name: 'syncWeight', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'allowedExitDelay',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'exitDelayFee',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
          {
            name: 'maxElWithdrawalRequestFee',
            internalType: 'struct IOneShotCurveSetup.ScalarOverride',
            type: 'tuple',
            components: [
              { name: 'isSet', internalType: 'bool', type: 'bool' },
              { name: 'value', internalType: 'uint256', type: 'uint256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'AlreadyExecuted' },
  { type: 'error', inputs: [], name: 'EmptyBondCurve' },
  { type: 'error', inputs: [], name: 'ZeroAccountingAddress' },
  { type: 'error', inputs: [], name: 'ZeroRegistryAddress' },
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
    ],
    name: 'BondCurveDeployed',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ACCOUNTING',
    outputs: [
      { name: '', internalType: 'contract IAccounting', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REGISTRY',
    outputs: [
      {
        name: '',
        internalType: 'contract IParametersRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'allowedExitDelayOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'badPerformancePenaltyOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'bondCurve',
    outputs: [
      { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
      { name: 'trend', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deployedCurveId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'execute',
    outputs: [{ name: 'curveId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'executed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'exitDelayFeeOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'generalDelayedPenaltyFineOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBondCurve',
    outputs: [
      {
        name: 'bondCurve_',
        internalType: 'struct IBondCurve.BondCurveIntervalInput[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeysCount', internalType: 'uint256', type: 'uint256' },
          { name: 'trend', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPerformanceLeewayDataOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      {
        name: 'data',
        internalType: 'struct IParametersRegistry.KeyNumberValueInterval[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeyNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardShareDataOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      {
        name: 'data',
        internalType: 'struct IParametersRegistry.KeyNumberValueInterval[]',
        type: 'tuple[]',
        components: [
          { name: 'minKeyNumber', internalType: 'uint256', type: 'uint256' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'keyRemovalChargeOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'keysLimitOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxElWithdrawalRequestFeeOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'performanceCoefficientsOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'attestationsWeight', internalType: 'uint256', type: 'uint256' },
      { name: 'blocksWeight', internalType: 'uint256', type: 'uint256' },
      { name: 'syncWeight', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'performanceLeewayDataOverride',
    outputs: [{ name: 'isSet', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'queueConfigOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'priority', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDeposits', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'rewardShareDataOverride',
    outputs: [{ name: 'isSet', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'strikesParamsOverride',
    outputs: [
      { name: 'isSet', internalType: 'bool', type: 'bool' },
      { name: 'lifetime', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
] as const;
