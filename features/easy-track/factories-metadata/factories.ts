import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import * as abi from 'abi/generated';

import { defineFactories } from './define-factories';

// Use this object as an entry point for all new EasyTrack factories.
//
// This module must stay a leaf: it may only import ABIs, chains and types.
// A runtime import from elsewhere in the feature (a form part, or
// `shared/blockchain/contracts`) cycles back through `motion-types` and fails
export const FACTORIES = defineFactories({
  SetDepositsReserveTarget: {
    startable: true,
    abi: abi.setDepositsReserveTargetAbi,
    displayName: 'Set deposits reserve target',
    tags: ['Staking'],
    addresses: {
      [CHAINS.Mainnet]: '0x62E9Dc68BDCBC46362f40e0bb9c154C9a42E62b0',
      [CHAINS.Hoodi]: '0x68009122a394504E8fD7fee58F92Cd73c6A60717',
    },
  },
} as const);
