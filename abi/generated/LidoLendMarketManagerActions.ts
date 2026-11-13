//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LidoLendMarketManagerActions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const lidoLendMarketManagerActionsAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
      { name: '_lidoLendOwner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_creator', internalType: 'address', type: 'address' },
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'createEVMScript',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_evmScriptCallData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'decodeEVMScriptCallData',
    outputs: [
      {
        name: 'action',
        internalType: 'enum LidoLendMarketManagerActions.Action',
        type: 'uint8',
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetCollateralActivationConfigPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'newCfg',
        internalType:
          'struct ILidoLendMarketController.CollateralActivationConfig',
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
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetFeePayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newFee', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetInstantActivationPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetSettlementConfigPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'newConfig',
        internalType: 'struct ILidoLendMarketController.SettlementConfig',
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
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeSetSupplyCapPayload',
    outputs: [
      { name: 'marketId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newCap', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_payload', internalType: 'bytes', type: 'bytes' }],
    name: 'decodeUnfreezeMarketsPayload',
    outputs: [
      { name: 'marketIds', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLend',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'lidoLendOwner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedCaller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
] as const;
