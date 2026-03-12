//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WithdrawalVault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const withdrawalVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'voting', internalType: 'address', type: 'address' },
      { name: 'impl', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
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
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address' }],
    name: 'proxy_changeAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxy_getAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxy_getIsOssified',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'setupCalldata', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'proxy_upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'constructor',
    inputs: [
      { name: '_lido', internalType: 'address', type: 'address' },
      { name: '_treasury', internalType: 'address', type: 'address' },
      {
        name: '_triggerableWithdrawalsGateway',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [
      { name: 'firstArrayLength', internalType: 'uint256', type: 'uint256' },
      { name: 'secondArrayLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ArraysLengthMismatch',
  },
  { type: 'error', inputs: [], name: 'FeeInvalidData' },
  { type: 'error', inputs: [], name: 'FeeReadFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'requiredFee', internalType: 'uint256', type: 'uint256' },
      { name: 'providedFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'IncorrectFee',
  },
  { type: 'error', inputs: [], name: 'InvalidContractVersionIncrement' },
  { type: 'error', inputs: [], name: 'NonZeroContractVersionOnInit' },
  {
    type: 'error',
    inputs: [
      { name: 'requested', internalType: 'uint256', type: 'uint256' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'NotEnoughEther',
  },
  { type: 'error', inputs: [], name: 'NotLido' },
  { type: 'error', inputs: [], name: 'NotTriggerableWithdrawalsGateway' },
  {
    type: 'error',
    inputs: [{ name: 'callData', internalType: 'bytes', type: 'bytes' }],
    name: 'RequestAdditionFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'received', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'UnexpectedContractVersion',
  },
  { type: 'error', inputs: [], name: 'ZeroAddress' },
  { type: 'error', inputs: [], name: 'ZeroAmount' },
  {
    type: 'error',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'ZeroArgument',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ContractVersionSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requestedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC20Recovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'requestedBy',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ERC721Recovered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'request', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'WithdrawalRequestAdded',
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
    name: 'TREASURY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TRIGGERABLE_WITHDRAWALS_GATEWAY',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WITHDRAWAL_REQUEST',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'pubkeys', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'amounts', internalType: 'uint64[]', type: 'uint64[]' },
    ],
    name: 'addWithdrawalRequests',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finalizeUpgrade_v2',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getContractVersion',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getWithdrawalRequestFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC20', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'contract IERC721', type: 'address' },
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recoverERC721',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'withdrawWithdrawals',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;
