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
      [CHAINS.Hoodi]: '0x68009122a394504E8fD7fee58F92Cd73c6A60717',
    },
  },
  LidoLendMarketManagerActions: {
    startable: true,
    abi: abi.lidoLendMarketManagerActionsAbi,
    displayName: 'Market Manager Actions',
    tags: ['Lido Lend', 'Market Manager'],
    // Order mirrors the `Action` enum in LidoLendMarketManagerActions.sol.
    actionTitles: [
      'Set instant activation',
      'Set collateral activation config',
      'Set settlement config',
      'Set supply cap',
      'Unfreeze markets',
      'Set market fee',
    ],
    // TODO: replace with real addresses once deployed. Local anvil fork only.
    addresses: {
      [CHAINS.Mainnet]: '0x400c07eACb636ecD4D98A255a9C385a5EAeF7679',
    },
  },
  LidoLendGuardianActions: {
    startable: true,
    abi: abi.lidoLendGuardianActionsAbi,
    displayName: 'Guardian Actions',
    tags: ['Lido Lend', 'Guardian'],
    // Order mirrors the `Action` enum in LidoLendGuardianActions.sol.
    actionTitles: [
      'Add guardian',
      'Remove guardian',
      'Replace guardian',
      'Set guardians quorum',
      'Set suspect window',
      'Unban accounts',
    ],
    // TODO: replace with real addresses once deployed. Local anvil fork only.
    addresses: {
      [CHAINS.Mainnet]: '0xe96c1712c88d6289Fc1A9C2db0845f482b52347C',
    },
  },
  LidoLendActivateMarket: {
    startable: true,
    abi: abi.lidoLendActivateMarketAbi,
    displayName: 'Activate market',
    tags: ['Lido Lend'],
    // TODO: replace with real addresses once deployed. Local anvil fork only.
    addresses: {
      [CHAINS.Mainnet]: '0xfDA856f1DDD1d9ECb891a7D09DFF686A5b0a7642',
    },
  },
} as const);
