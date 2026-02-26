//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DGEscrow
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dgEscrowAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'stETH', internalType: 'contract IStETH', type: 'address' },
      { name: 'wstETH', internalType: 'contract IWstETH', type: 'address' },
      {
        name: 'withdrawalQueue',
        internalType: 'contract IWithdrawalQueue',
        type: 'address',
      },
      {
        name: 'dualGovernance',
        internalType: 'contract IDualGovernance',
        type: 'address',
      },
      {
        name: 'minWithdrawalsBatchSize',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: 'maxMinAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'BatchesQueueIsNotClosed' },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerIsNotDualGovernance',
  },
  { type: 'error', inputs: [], name: 'ClaimingIsFinished' },
  { type: 'error', inputs: [], name: 'DivisionByZero' },
  { type: 'error', inputs: [], name: 'DurationOverflow' },
  { type: 'error', inputs: [], name: 'ETHValueOverflow' },
  { type: 'error', inputs: [], name: 'ETHValueUnderflow' },
  { type: 'error', inputs: [], name: 'EmptyBatch' },
  { type: 'error', inputs: [], name: 'EmptyUnstETHIds' },
  { type: 'error', inputs: [], name: 'EthWithdrawalsDelayNotPassed' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'IndexOneBasedOverflow' },
  { type: 'error', inputs: [], name: 'IndexOneBasedUnderflow' },
  {
    type: 'error',
    inputs: [{ name: 'size', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidBatchSize',
  },
  {
    type: 'error',
    inputs: [
      { name: 'unstETHId', internalType: 'uint256', type: 'uint256' },
      { name: 'claimableAmount', internalType: 'ETHValue', type: 'uint128' },
    ],
    name: 'InvalidClaimableAmount',
  },
  {
    type: 'error',
    inputs: [
      { name: 'actual', internalType: 'address', type: 'address' },
      { name: 'expected', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidETHSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'unstETHId', internalType: 'uint256', type: 'uint256' }],
    name: 'InvalidFromUnstETHId',
  },
  {
    type: 'error',
    inputs: [
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidHintsLength',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'newMinAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'InvalidMinAssetsLockDuration',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'SharesValue', type: 'uint128' }],
    name: 'InvalidSharesValue',
  },
  {
    type: 'error',
    inputs: [
      { name: 'unstETHId', internalType: 'uint256', type: 'uint256' },
      { name: 'holder', internalType: 'address', type: 'address' },
    ],
    name: 'InvalidUnstETHHolder',
  },
  { type: 'error', inputs: [], name: 'InvalidUnstETHIdsSequence' },
  {
    type: 'error',
    inputs: [
      { name: 'unstETHId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'status',
        internalType: 'enum UnstETHRecordStatus',
        type: 'uint8',
      },
    ],
    name: 'InvalidUnstETHStatus',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'lockDurationExpiresAt',
        internalType: 'Timestamp',
        type: 'uint40',
      },
    ],
    name: 'MinAssetsLockDurationNotPassed',
  },
  { type: 'error', inputs: [], name: 'NonProxyCallsForbidden' },
  { type: 'error', inputs: [], name: 'PercentD16Overflow' },
  { type: 'error', inputs: [], name: 'RageQuitExtensionPeriodNotStarted' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  { type: 'error', inputs: [], name: 'SharesValueOverflow' },
  { type: 'error', inputs: [], name: 'SharesValueUnderflow' },
  { type: 'error', inputs: [], name: 'TimestampOverflow' },
  { type: 'error', inputs: [], name: 'UnclaimedBatches' },
  {
    type: 'error',
    inputs: [{ name: 'state', internalType: 'enum State', type: 'uint8' }],
    name: 'UnexpectedEscrowState',
  },
  {
    type: 'error',
    inputs: [{ name: 'state', internalType: 'enum State', type: 'uint8' }],
    name: 'UnexpectedWithdrawalsBatchesQueueState',
  },
  { type: 'error', inputs: [], name: 'UnfinalizedUnstETHIds' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'ETHValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'ETHClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'shares',
        internalType: 'SharesValue',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'ETHValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'ETHWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'from',
        internalType: 'enum State',
        type: 'uint8',
        indexed: true,
      },
      { name: 'to', internalType: 'enum State', type: 'uint8', indexed: true },
    ],
    name: 'EscrowStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'MinAssetsLockDurationSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'startedAt',
        internalType: 'Timestamp',
        type: 'uint40',
        indexed: false,
      },
    ],
    name: 'RageQuitExtensionPeriodStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rageQuitExtensionPeriodDuration',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'rageQuitEthWithdrawalsDelay',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'RageQuitStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'shares',
        internalType: 'SharesValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'StETHSharesLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'shares',
        internalType: 'SharesValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'StETHSharesUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'unstETHIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'totalAmountClaimed',
        internalType: 'ETHValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'UnstETHClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'finalizedShares',
        internalType: 'SharesValue[]',
        type: 'uint128[]',
        indexed: false,
      },
      {
        name: 'finalizedAmount',
        internalType: 'ETHValue[]',
        type: 'uint128[]',
        indexed: false,
      },
    ],
    name: 'UnstETHFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'unstETHIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'UnstETHIdsAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'unstETHIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'UnstETHIdsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'shares',
        internalType: 'SharesValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'UnstETHLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'holder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'finalizedSharesIncrement',
        internalType: 'SharesValue',
        type: 'uint128',
        indexed: false,
      },
      {
        name: 'finalizedAmountIncrement',
        internalType: 'ETHValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'UnstETHUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'unstETHIds',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'amountWithdrawn',
        internalType: 'ETHValue',
        type: 'uint128',
        indexed: false,
      },
    ],
    name: 'UnstETHWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [],
    name: 'WithdrawalsBatchesQueueClosed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'boundaryUnstETHId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'WithdrawalsBatchesQueueOpened',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DUAL_GOVERNANCE',
    outputs: [
      { name: '', internalType: 'contract IDualGovernance', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ESCROW_MASTER_COPY',
    outputs: [
      { name: '', internalType: 'contract IEscrowBase', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_MIN_ASSETS_LOCK_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_TRANSFERRABLE_ST_ETH_AMOUNT',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MIN_WITHDRAWALS_BATCH_SIZE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ST_ETH',
    outputs: [{ name: '', internalType: 'contract IStETH', type: 'address' }],
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
    name: 'WST_ETH',
    outputs: [{ name: '', internalType: 'contract IWstETH', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'fromUnstETHId', internalType: 'uint256', type: 'uint256' },
      { name: 'hints', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'claimNextWithdrawalsBatch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'maxUnstETHIdsCount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimNextWithdrawalsBatch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'hints', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'claimUnstETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getEscrowState',
    outputs: [{ name: '', internalType: 'enum State', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'getLockedUnstETHDetails',
    outputs: [
      {
        name: 'unstETHDetails',
        internalType: 'struct ISignallingEscrow.LockedUnstETHDetails[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          {
            name: 'status',
            internalType: 'enum UnstETHRecordStatus',
            type: 'uint8',
          },
          { name: 'lockedBy', internalType: 'address', type: 'address' },
          { name: 'shares', internalType: 'SharesValue', type: 'uint128' },
          {
            name: 'claimableAmount',
            internalType: 'ETHValue',
            type: 'uint128',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMinAssetsLockDuration',
    outputs: [
      {
        name: 'minAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'limit', internalType: 'uint256', type: 'uint256' }],
    name: 'getNextWithdrawalBatch',
    outputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRageQuitEscrowDetails',
    outputs: [
      {
        name: 'details',
        internalType: 'struct IRageQuitEscrow.RageQuitEscrowDetails',
        type: 'tuple',
        components: [
          {
            name: 'rageQuitEthWithdrawalsDelay',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitExtensionPeriodDuration',
            internalType: 'Duration',
            type: 'uint32',
          },
          {
            name: 'rageQuitExtensionPeriodStartedAt',
            internalType: 'Timestamp',
            type: 'uint40',
          },
          {
            name: 'isRageQuitExtensionPeriodStarted',
            internalType: 'bool',
            type: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRageQuitSupport',
    outputs: [{ name: '', internalType: 'PercentD16', type: 'uint128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSignallingEscrowDetails',
    outputs: [
      {
        name: 'details',
        internalType: 'struct ISignallingEscrow.SignallingEscrowDetails',
        type: 'tuple',
        components: [
          {
            name: 'totalStETHLockedShares',
            internalType: 'SharesValue',
            type: 'uint128',
          },
          {
            name: 'totalStETHClaimedETH',
            internalType: 'ETHValue',
            type: 'uint128',
          },
          {
            name: 'totalUnstETHUnfinalizedShares',
            internalType: 'SharesValue',
            type: 'uint128',
          },
          {
            name: 'totalUnstETHFinalizedETH',
            internalType: 'ETHValue',
            type: 'uint128',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getUnclaimedUnstETHIdsCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'vetoer', internalType: 'address', type: 'address' }],
    name: 'getVetoerDetails',
    outputs: [
      {
        name: 'details',
        internalType: 'struct ISignallingEscrow.VetoerDetails',
        type: 'tuple',
        components: [
          { name: 'unstETHIdsCount', internalType: 'uint256', type: 'uint256' },
          {
            name: 'stETHLockedShares',
            internalType: 'SharesValue',
            type: 'uint128',
          },
          {
            name: 'unstETHLockedShares',
            internalType: 'SharesValue',
            type: 'uint128',
          },
          {
            name: 'lastAssetsLockTimestamp',
            internalType: 'Timestamp',
            type: 'uint40',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'vetoer', internalType: 'address', type: 'address' }],
    name: 'getVetoerUnstETHIds',
    outputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'minAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isRageQuitFinalized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isWithdrawalsBatchesClosed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'lockStETH',
    outputs: [
      { name: 'lockedStETHShares', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'lockUnstETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'lockWstETH',
    outputs: [
      { name: 'lockedStETHShares', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'hints', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'markUnstETHFinalized',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'batchSize', internalType: 'uint256', type: 'uint256' }],
    name: 'requestNextWithdrawalsBatch',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newMinAssetsLockDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'setMinAssetsLockDuration',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'rageQuitExtensionPeriodDuration',
        internalType: 'Duration',
        type: 'uint32',
      },
      {
        name: 'rageQuitEthWithdrawalsDelay',
        internalType: 'Duration',
        type: 'uint32',
      },
    ],
    name: 'startRageQuit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'startRageQuitExtensionPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockStETH',
    outputs: [
      { name: 'unlockedStETHShares', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'unlockUnstETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockWstETH',
    outputs: [
      { name: 'wstETHUnlocked', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'unstETHIds', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const
