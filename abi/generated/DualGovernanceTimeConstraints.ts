//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DualGovernanceTimeConstraints
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dualGovernanceTimeConstraintsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'currentDayTime', internalType: 'Duration', type: 'uint32' },
      { name: 'startDayTime', internalType: 'Duration', type: 'uint32' },
      { name: 'endDayTime', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'DayTimeOutOfRange',
  },
  { type: 'error', inputs: [], name: 'DayTimeOverflow' },
  { type: 'error', inputs: [], name: 'DurationOverflow' },
  {
    type: 'error',
    inputs: [{ name: 'timestamp', internalType: 'Timestamp', type: 'uint40' }],
    name: 'TimestampNotPassed',
  },
  {
    type: 'error',
    inputs: [{ name: 'timestamp', internalType: 'Timestamp', type: 'uint40' }],
    name: 'TimestampPassed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'timestamp',
        internalType: 'Timestamp',
        type: 'uint40',
        indexed: false,
      },
    ],
    name: 'TimeAfterTimestampChecked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'timestamp',
        internalType: 'Timestamp',
        type: 'uint40',
        indexed: false,
      },
    ],
    name: 'TimeBeforeTimestampChecked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'startDayTime',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
      {
        name: 'endDayTime',
        internalType: 'Duration',
        type: 'uint32',
        indexed: false,
      },
    ],
    name: 'TimeWithinDayTimeChecked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DAY_DURATION',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timestamp', internalType: 'Timestamp', type: 'uint40' }],
    name: 'checkTimeAfterTimestamp',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timestamp', internalType: 'Timestamp', type: 'uint40' }],
    name: 'checkTimeAfterTimestampAndEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timestamp', internalType: 'Timestamp', type: 'uint40' }],
    name: 'checkTimeBeforeTimestamp',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timestamp', internalType: 'Timestamp', type: 'uint40' }],
    name: 'checkTimeBeforeTimestampAndEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'startDayTime', internalType: 'Duration', type: 'uint32' },
      { name: 'endDayTime', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'checkTimeWithinDayTime',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'startDayTime', internalType: 'Duration', type: 'uint32' },
      { name: 'endDayTime', internalType: 'Duration', type: 'uint32' },
    ],
    name: 'checkTimeWithinDayTimeAndEmit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentDayTime',
    outputs: [{ name: '', internalType: 'Duration', type: 'uint32' }],
    stateMutability: 'view',
  },
] as const
