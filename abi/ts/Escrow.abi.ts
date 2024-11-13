export const escrowAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'stETH',
        type: 'address',
        internalType: 'contract IStETH',
      },
      {
        name: 'wstETH',
        type: 'address',
        internalType: 'contract IWstETH',
      },
      {
        name: 'withdrawalQueue',
        type: 'address',
        internalType: 'contract IWithdrawalQueue',
      },
      {
        name: 'dualGovernance',
        type: 'address',
        internalType: 'contract IDualGovernance',
      },
      {
        name: 'minWithdrawalsBatchSize',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'DUAL_GOVERNANCE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IDualGovernance',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MIN_WITHDRAWALS_BATCH_SIZE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ST_ETH',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IStETH',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'WITHDRAWAL_QUEUE',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IWithdrawalQueue',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'WST_ETH',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IWstETH',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'claimNextWithdrawalsBatch',
    inputs: [
      {
        name: 'fromUnstETHId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'hints',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimNextWithdrawalsBatch',
    inputs: [
      {
        name: 'maxUnstETHIdsCount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimUnstETH',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: 'hints',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getLockedAssetsTotals',
    inputs: [],
    outputs: [
      {
        name: 'totals',
        type: 'tuple',
        internalType: 'struct LockedAssetsTotals',
        components: [
          {
            name: 'stETHLockedShares',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'stETHClaimedETH',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'unstETHUnfinalizedShares',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'unstETHFinalizedETH',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNextWithdrawalBatch',
    inputs: [
      {
        name: 'limit',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRageQuitExtensionPeriodStartedAt',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint40',
        internalType: 'Timestamp',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRageQuitSupport',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
        internalType: 'PercentD16',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUnclaimedUnstETHIdsCount',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getVetoerState',
    inputs: [
      {
        name: 'vetoer',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'state',
        type: 'tuple',
        internalType: 'struct VetoerState',
        components: [
          {
            name: 'stETHLockedShares',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'unstETHLockedShares',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'unstETHIdsCount',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'lastAssetsLockTimestamp',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'minAssetsLockDuration',
        type: 'uint32',
        internalType: 'Duration',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isRageQuitExtensionPeriodStarted',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRageQuitFinalized',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isWithdrawalsBatchesFinalized',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lockStETH',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'lockedStETHShares',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'lockUnstETH',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'lockWstETH',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'lockedStETHShares',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'markUnstETHFinalized',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
      {
        name: 'hints',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'requestNextWithdrawalsBatch',
    inputs: [
      {
        name: 'batchSize',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMinAssetsLockDuration',
    inputs: [
      {
        name: 'newMinAssetsLockDuration',
        type: 'uint32',
        internalType: 'Duration',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'startRageQuit',
    inputs: [
      {
        name: 'rageQuitExtensionPeriodDuration',
        type: 'uint32',
        internalType: 'Duration',
      },
      {
        name: 'rageQuitEthWithdrawalsDelay',
        type: 'uint32',
        internalType: 'Duration',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'startRageQuitExtensionPeriod',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockStETH',
    inputs: [],
    outputs: [
      {
        name: 'unlockedStETHShares',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockUnstETH',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unlockWstETH',
    inputs: [],
    outputs: [
      {
        name: 'unlockedStETHShares',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawETH',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawETH',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'ETHClaimed',
    inputs: [
      {
        name: 'amount',
        type: 'uint128',
        indexed: false,
        internalType: 'ETHValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ETHWithdrawn',
    inputs: [
      {
        name: 'holder',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'shares',
        type: 'uint128',
        indexed: false,
        internalType: 'SharesValue',
      },
      {
        name: 'value',
        type: 'uint128',
        indexed: false,
        internalType: 'ETHValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'EscrowStateChanged',
    inputs: [
      {
        name: 'from',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
      {
        name: 'to',
        type: 'uint8',
        indexed: false,
        internalType: 'enum State',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MinAssetsLockDurationSet',
    inputs: [
      {
        name: 'newAssetsLockDuration',
        type: 'uint32',
        indexed: false,
        internalType: 'Duration',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RageQuitExtensionPeriodStarted',
    inputs: [
      {
        name: 'startedAt',
        type: 'uint40',
        indexed: false,
        internalType: 'Timestamp',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RageQuitStarted',
    inputs: [
      {
        name: 'rageQuitExtensionDuration',
        type: 'uint32',
        indexed: false,
        internalType: 'Duration',
      },
      {
        name: 'rageQuitEthWithdrawalsDelay',
        type: 'uint32',
        indexed: false,
        internalType: 'Duration',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StETHSharesLocked',
    inputs: [
      {
        name: 'holder',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'shares',
        type: 'uint128',
        indexed: false,
        internalType: 'SharesValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'StETHSharesUnlocked',
    inputs: [
      {
        name: 'holder',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'shares',
        type: 'uint128',
        indexed: false,
        internalType: 'SharesValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHClaimed',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
      {
        name: 'totalAmountClaimed',
        type: 'uint128',
        indexed: false,
        internalType: 'ETHValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHFinalized',
    inputs: [
      {
        name: 'ids',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
      {
        name: 'finalizedSharesIncrement',
        type: 'uint128',
        indexed: false,
        internalType: 'SharesValue',
      },
      {
        name: 'finalizedAmountIncrement',
        type: 'uint128',
        indexed: false,
        internalType: 'ETHValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHIdsAdded',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHIdsClaimed',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHLocked',
    inputs: [
      {
        name: 'holder',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'ids',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
      {
        name: 'shares',
        type: 'uint128',
        indexed: false,
        internalType: 'SharesValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHUnlocked',
    inputs: [
      {
        name: 'holder',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'ids',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
      {
        name: 'finalizedSharesIncrement',
        type: 'uint128',
        indexed: false,
        internalType: 'SharesValue',
      },
      {
        name: 'finalizedAmountIncrement',
        type: 'uint128',
        indexed: false,
        internalType: 'ETHValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UnstETHWithdrawn',
    inputs: [
      {
        name: 'unstETHIds',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
      {
        name: 'amountWithdrawn',
        type: 'uint128',
        indexed: false,
        internalType: 'ETHValue',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalBatchesQueueClosed',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'WithdrawalBatchesQueueOpened',
    inputs: [
      {
        name: 'boundaryUnstETHId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AddressInsufficientBalance',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'BatchesQueueIsNotClosed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CallerIsNotDualGovernance',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'ClaimingIsFinished',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DivisionByZero',
    inputs: [],
  },
  {
    type: 'error',
    name: 'DurationOverflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ETHValueOverflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ETHValueUnderflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EmptyBatch',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EmptyUnstETHIds',
    inputs: [],
  },
  {
    type: 'error',
    name: 'EthWithdrawalsDelayNotPassed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'FailedInnerCall',
    inputs: [],
  },
  {
    type: 'error',
    name: 'IndexOneBasedOverflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'IndexOneBasedUnderflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidBatchSize',
    inputs: [
      {
        name: 'size',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidClaimableAmount',
    inputs: [
      {
        name: 'unstETHId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'expected',
        type: 'uint128',
        internalType: 'ETHValue',
      },
      {
        name: 'actual',
        type: 'uint128',
        internalType: 'ETHValue',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidETHSender',
    inputs: [
      {
        name: 'actual',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'expected',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidHintsLength',
    inputs: [
      {
        name: 'actual',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'expected',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidMinAssetsLockDuration',
    inputs: [
      {
        name: 'newMinAssetsLockDuration',
        type: 'uint32',
        internalType: 'Duration',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidSharesValue',
    inputs: [
      {
        name: 'value',
        type: 'uint128',
        internalType: 'SharesValue',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidUnstETHHolder',
    inputs: [
      {
        name: 'unstETHId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'actual',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'expected',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'InvalidUnstETHIdsSequence',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidUnstETHStatus',
    inputs: [
      {
        name: 'unstETHId',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'status',
        type: 'uint8',
        internalType: 'enum UnstETHRecordStatus',
      },
    ],
  },
  {
    type: 'error',
    name: 'MinAssetsLockDurationNotPassed',
    inputs: [
      {
        name: 'lockDurationExpiresAt',
        type: 'uint40',
        internalType: 'Timestamp',
      },
    ],
  },
  {
    type: 'error',
    name: 'NonProxyCallsForbidden',
    inputs: [],
  },
  {
    type: 'error',
    name: 'PercentD16Overflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RageQuitExtensionPeriodNotStarted',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SafeCastOverflowedUintDowncast',
    inputs: [
      {
        name: 'bits',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'SharesValueOverflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'SharesValueUnderflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TimestampOverflow',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnclaimedBatches',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnexpectedState',
    inputs: [
      {
        name: 'value',
        type: 'uint8',
        internalType: 'enum State',
      },
    ],
  },
  {
    type: 'error',
    name: 'UnexpectedUnstETHId',
    inputs: [],
  },
  {
    type: 'error',
    name: 'UnfinalizedUnstETHIds',
    inputs: [],
  },
  {
    type: 'error',
    name: 'WithdrawalBatchesQueueIsInAbsentState',
    inputs: [],
  },
  {
    type: 'error',
    name: 'WithdrawalBatchesQueueIsNotInAbsentState',
    inputs: [],
  },
  {
    type: 'error',
    name: 'WithdrawalBatchesQueueIsNotInOpenedState',
    inputs: [],
  },
] as const;
