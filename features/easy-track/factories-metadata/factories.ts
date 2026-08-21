// import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
// import * as abi from 'abi/generated';

import { defineFactories } from './define-factories';

// Use this object as an entry point for all new EasyTrack factories.
//
// This module must stay a leaf: it may only import ABIs, chains and types.
// A runtime import from elsewhere in the feature (a form part, or
// `shared/blockchain/contracts`) cycles back through `motion-types` and fails
export const FACTORIES = defineFactories({
  // LidoLendTest: {
  //   startable: true,
  //   abi: abi.lidoLendTestAbi,
  //   displayName: 'Lend to borrower (test)',
  //   tags: ['Treasury'],
  //   addresses: {
  //     [CHAINS.Hoodi]: '0x1111111111111111111111111111111111111111',
  //   },
  // },
} as const);
