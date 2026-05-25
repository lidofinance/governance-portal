//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ReferralPartnersRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const referralPartnersRegistryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_trustedCaller', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_rewardProgram',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: '_title',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'RewardProgramAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_rewardProgram',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RewardProgramRemoved',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardProgram', internalType: 'address', type: 'address' },
      { name: '_title', internalType: 'string', type: 'string' },
    ],
    name: 'addRewardProgram',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardPrograms',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_maybeRewardProgram', internalType: 'address', type: 'address' },
    ],
    name: 'isRewardProgram',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_rewardProgram', internalType: 'address', type: 'address' },
    ],
    name: 'removeRewardProgram',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'rewardPrograms',
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
