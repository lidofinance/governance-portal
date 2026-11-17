//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CuratedVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const curatedVerifierAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'withdrawalAddress', internalType: 'address', type: 'address' },
      { name: 'module', internalType: 'address', type: 'address' },
      { name: 'slotsPerEpoch', internalType: 'uint64', type: 'uint64' },
      {
        name: 'gindices',
        internalType: 'struct ICuratedVerifier.GIndices',
        type: 'tuple',
        components: [
          {
            name: 'gIFirstValidatorPrev',
            internalType: 'GIndex',
            type: 'bytes32',
          },
          {
            name: 'gIFirstValidatorCurr',
            internalType: 'GIndex',
            type: 'bytes32',
          },
          {
            name: 'gIFirstHistoricalSummaryPrev',
            internalType: 'GIndex',
            type: 'bytes32',
          },
          {
            name: 'gIFirstHistoricalSummaryCurr',
            internalType: 'GIndex',
            type: 'bytes32',
          },
          {
            name: 'gIFirstBalanceNodePrev',
            internalType: 'GIndex',
            type: 'bytes32',
          },
          {
            name: 'gIFirstBalanceNodeCurr',
            internalType: 'GIndex',
            type: 'bytes32',
          },
        ],
      },
      { name: 'firstSupportedSlot', internalType: 'Slot', type: 'uint64' },
      { name: 'pivotSlot', internalType: 'Slot', type: 'uint64' },
      { name: 'capellaSlot', internalType: 'Slot', type: 'uint64' },
      { name: 'admin', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BEACON_ROOTS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CAPELLA_SLOT',
    outputs: [{ name: '', internalType: 'Slot', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FIRST_SUPPORTED_SLOT',
    outputs: [{ name: '', internalType: 'Slot', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_BALANCES_NODE_CURR',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_BALANCES_NODE_PREV',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_BLOCK_ROOT_IN_SUMMARY',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_HISTORICAL_SUMMARY_CURR',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_HISTORICAL_SUMMARY_PREV',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_VALIDATOR_CURR',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GI_FIRST_VALIDATOR_PREV',
    outputs: [{ name: '', internalType: 'GIndex', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MODULE',
    outputs: [
      { name: '', internalType: 'contract IBaseModule', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PAUSE_INFINITELY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PAUSE_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PIVOT_SLOT',
    outputs: [{ name: '', internalType: 'Slot', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'RESUME_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SLOTS_PER_EPOCH',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SLOTS_PER_HISTORICAL_ROOT',
    outputs: [{ name: '', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'WITHDRAWAL_ADDRESS',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getResumeSinceTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getRoleMember',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMembers',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isPaused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'duration', internalType: 'uint256', type: 'uint256' }],
    name: 'pauseFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct ICuratedVerifier.ProcessBalanceProofInput',
        type: 'tuple',
        components: [
          {
            name: 'recentBlock',
            internalType: 'struct ICuratedVerifier.RecentHeaderWitness',
            type: 'tuple',
            components: [
              {
                name: 'header',
                internalType: 'struct BeaconBlockHeader',
                type: 'tuple',
                components: [
                  { name: 'slot', internalType: 'Slot', type: 'uint64' },
                  {
                    name: 'proposerIndex',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'parentRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'stateRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'bodyRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                ],
              },
              {
                name: 'rootsTimestamp',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
          {
            name: 'validator',
            internalType: 'struct ICuratedVerifier.ValidatorWitness',
            type: 'tuple',
            components: [
              { name: 'index', internalType: 'uint64', type: 'uint64' },
              {
                name: 'nodeOperatorId',
                internalType: 'uint32',
                type: 'uint32',
              },
              { name: 'keyIndex', internalType: 'uint32', type: 'uint32' },
              {
                name: 'object',
                internalType: 'struct Validator',
                type: 'tuple',
                components: [
                  { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
                  {
                    name: 'withdrawalCredentials',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'effectiveBalance',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'slashed', internalType: 'bool', type: 'bool' },
                  {
                    name: 'activationEligibilityEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'activationEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'exitEpoch', internalType: 'uint64', type: 'uint64' },
                  {
                    name: 'withdrawableEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                ],
              },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
          {
            name: 'balance',
            internalType: 'struct ICuratedVerifier.BalanceWitness',
            type: 'tuple',
            components: [
              { name: 'node', internalType: 'bytes32', type: 'bytes32' },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
        ],
      },
    ],
    name: 'processBalanceProof',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType:
          'struct ICuratedVerifier.ProcessHistoricalBalanceProofInput',
        type: 'tuple',
        components: [
          {
            name: 'recentBlock',
            internalType: 'struct ICuratedVerifier.RecentHeaderWitness',
            type: 'tuple',
            components: [
              {
                name: 'header',
                internalType: 'struct BeaconBlockHeader',
                type: 'tuple',
                components: [
                  { name: 'slot', internalType: 'Slot', type: 'uint64' },
                  {
                    name: 'proposerIndex',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'parentRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'stateRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'bodyRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                ],
              },
              {
                name: 'rootsTimestamp',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
          {
            name: 'historicalBlock',
            internalType: 'struct ICuratedVerifier.HistoricalHeaderWitness',
            type: 'tuple',
            components: [
              {
                name: 'header',
                internalType: 'struct BeaconBlockHeader',
                type: 'tuple',
                components: [
                  { name: 'slot', internalType: 'Slot', type: 'uint64' },
                  {
                    name: 'proposerIndex',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'parentRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'stateRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'bodyRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                ],
              },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
          {
            name: 'validator',
            internalType: 'struct ICuratedVerifier.ValidatorWitness',
            type: 'tuple',
            components: [
              { name: 'index', internalType: 'uint64', type: 'uint64' },
              {
                name: 'nodeOperatorId',
                internalType: 'uint32',
                type: 'uint32',
              },
              { name: 'keyIndex', internalType: 'uint32', type: 'uint32' },
              {
                name: 'object',
                internalType: 'struct Validator',
                type: 'tuple',
                components: [
                  { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
                  {
                    name: 'withdrawalCredentials',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'effectiveBalance',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'slashed', internalType: 'bool', type: 'bool' },
                  {
                    name: 'activationEligibilityEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'activationEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'exitEpoch', internalType: 'uint64', type: 'uint64' },
                  {
                    name: 'withdrawableEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                ],
              },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
          {
            name: 'balance',
            internalType: 'struct ICuratedVerifier.BalanceWitness',
            type: 'tuple',
            components: [
              { name: 'node', internalType: 'bytes32', type: 'bytes32' },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
        ],
      },
    ],
    name: 'processHistoricalBalanceProof',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct ICuratedVerifier.ProcessSlashedInput',
        type: 'tuple',
        components: [
          {
            name: 'validator',
            internalType: 'struct ICuratedVerifier.ValidatorWitness',
            type: 'tuple',
            components: [
              { name: 'index', internalType: 'uint64', type: 'uint64' },
              {
                name: 'nodeOperatorId',
                internalType: 'uint32',
                type: 'uint32',
              },
              { name: 'keyIndex', internalType: 'uint32', type: 'uint32' },
              {
                name: 'object',
                internalType: 'struct Validator',
                type: 'tuple',
                components: [
                  { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
                  {
                    name: 'withdrawalCredentials',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'effectiveBalance',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'slashed', internalType: 'bool', type: 'bool' },
                  {
                    name: 'activationEligibilityEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'activationEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'exitEpoch', internalType: 'uint64', type: 'uint64' },
                  {
                    name: 'withdrawableEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                ],
              },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
          {
            name: 'recentBlock',
            internalType: 'struct ICuratedVerifier.RecentHeaderWitness',
            type: 'tuple',
            components: [
              {
                name: 'header',
                internalType: 'struct BeaconBlockHeader',
                type: 'tuple',
                components: [
                  { name: 'slot', internalType: 'Slot', type: 'uint64' },
                  {
                    name: 'proposerIndex',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'parentRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'stateRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'bodyRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                ],
              },
              {
                name: 'rootsTimestamp',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
        ],
      },
    ],
    name: 'processSlashedProof',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'data',
        internalType: 'struct ICuratedVerifier.ProcessWithdrawnInput',
        type: 'tuple',
        components: [
          {
            name: 'validator',
            internalType: 'struct ICuratedVerifier.ValidatorWitness',
            type: 'tuple',
            components: [
              { name: 'index', internalType: 'uint64', type: 'uint64' },
              {
                name: 'nodeOperatorId',
                internalType: 'uint32',
                type: 'uint32',
              },
              { name: 'keyIndex', internalType: 'uint32', type: 'uint32' },
              {
                name: 'object',
                internalType: 'struct Validator',
                type: 'tuple',
                components: [
                  { name: 'pubkey', internalType: 'bytes', type: 'bytes' },
                  {
                    name: 'withdrawalCredentials',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'effectiveBalance',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'slashed', internalType: 'bool', type: 'bool' },
                  {
                    name: 'activationEligibilityEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'activationEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  { name: 'exitEpoch', internalType: 'uint64', type: 'uint64' },
                  {
                    name: 'withdrawableEpoch',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                ],
              },
              { name: 'proof', internalType: 'bytes32[]', type: 'bytes32[]' },
            ],
          },
          {
            name: 'recentBlock',
            internalType: 'struct ICuratedVerifier.RecentHeaderWitness',
            type: 'tuple',
            components: [
              {
                name: 'header',
                internalType: 'struct BeaconBlockHeader',
                type: 'tuple',
                components: [
                  { name: 'slot', internalType: 'Slot', type: 'uint64' },
                  {
                    name: 'proposerIndex',
                    internalType: 'uint64',
                    type: 'uint64',
                  },
                  {
                    name: 'parentRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'stateRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                  {
                    name: 'bodyRoot',
                    internalType: 'bytes32',
                    type: 'bytes32',
                  },
                ],
              },
              {
                name: 'rootsTimestamp',
                internalType: 'uint64',
                type: 'uint64',
              },
            ],
          },
        ],
      },
    ],
    name: 'processWithdrawnProof',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'callerConfirmation', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resume',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'duration',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Paused',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'Resumed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  { type: 'error', inputs: [], name: 'AccessControlBadConfirmation' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'neededRole', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'HistoricalSummaryDoesNotExist' },
  { type: 'error', inputs: [], name: 'IndexOutOfRange' },
  { type: 'error', inputs: [], name: 'InvalidBlockHeader' },
  { type: 'error', inputs: [], name: 'InvalidCapellaSlot' },
  { type: 'error', inputs: [], name: 'InvalidChainConfig' },
  { type: 'error', inputs: [], name: 'InvalidPivotSlot' },
  { type: 'error', inputs: [], name: 'InvalidPublicKey' },
  { type: 'error', inputs: [], name: 'InvalidWithdrawalAddress' },
  { type: 'error', inputs: [], name: 'PauseUntilMustBeInFuture' },
  { type: 'error', inputs: [], name: 'PausedExpected' },
  { type: 'error', inputs: [], name: 'ResumedExpected' },
  { type: 'error', inputs: [], name: 'RootNotFound' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'Slot', type: 'uint64' }],
    name: 'UnsupportedSlot',
  },
  { type: 'error', inputs: [], name: 'ValidatorIsNotSlashed' },
  { type: 'error', inputs: [], name: 'ValidatorIsNotWithdrawable' },
  { type: 'error', inputs: [], name: 'ValidatorIsSlashed' },
  { type: 'error', inputs: [], name: 'ValidatorIsWithdrawable' },
  { type: 'error', inputs: [], name: 'ZeroAdminAddress' },
  { type: 'error', inputs: [], name: 'ZeroModuleAddress' },
  { type: 'error', inputs: [], name: 'ZeroPauseDuration' },
  { type: 'error', inputs: [], name: 'ZeroWithdrawalAddress' },
] as const;
