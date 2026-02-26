//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MEVBoostRelayAllowedList
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mevBoostRelayAllowedListAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'uri_hash', type: 'string', indexed: true },
      {
        name: 'relay',
        type: 'tuple',
        components: [
          { name: 'uri', type: 'string' },
          { name: 'operator', type: 'string' },
          { name: 'is_mandatory', type: 'bool' },
          { name: 'description', type: 'string' },
        ],
        indexed: false,
      },
    ],
    name: 'RelayAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'uri_hash', type: 'string', indexed: true },
      { name: 'uri', type: 'string', indexed: false },
    ],
    name: 'RelayRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'allowed_list_version', type: 'uint256', indexed: true }],
    name: 'AllowedListUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'new_owner', type: 'address', indexed: true }],
    name: 'OwnerChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'new_manager', type: 'address', indexed: true }],
    name: 'ManagerChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'token', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'recipient', type: 'address', indexed: true },
    ],
    name: 'ERC20Recovered',
  },
  {
    type: 'constructor',
    inputs: [{ name: 'owner', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'get_relays_amount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'get_owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'get_manager',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'get_relays',
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'uri', type: 'string' },
          { name: 'operator', type: 'string' },
          { name: 'is_mandatory', type: 'bool' },
          { name: 'description', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'relay_uri', type: 'string' }],
    name: 'get_relay_by_uri',
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'uri', type: 'string' },
          { name: 'operator', type: 'string' },
          { name: 'is_mandatory', type: 'bool' },
          { name: 'description', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'get_allowed_list_version',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'uri', type: 'string' },
      { name: 'operator', type: 'string' },
      { name: 'is_mandatory', type: 'bool' },
      { name: 'description', type: 'string' },
    ],
    name: 'add_relay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'uri', type: 'string' }],
    name: 'remove_relay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'change_owner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'manager', type: 'address' }],
    name: 'set_manager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dismiss_manager',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'recipient', type: 'address' },
    ],
    name: 'recover_erc20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'fallback', stateMutability: 'nonpayable' },
] as const
