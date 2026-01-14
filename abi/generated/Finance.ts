//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Finance
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const financeAbi = [
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_receiver', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_reference', internalType: 'string', type: 'string' },
    ],
    name: 'newImmediatePayment',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    constant: true,
    payable: false,
    type: 'function',
    inputs: [],
    name: 'CREATE_PAYMENTS_ROLE',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'view',
  },
] as const
