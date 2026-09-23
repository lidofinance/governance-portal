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
    addresses: {
      [CHAINS.Hoodi]: '0x915570870A6e9D141BF25ab155684e7fa2843356',
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
    addresses: {
      [CHAINS.Hoodi]: '0x8df659bC546c1FED3eB761b14922098c0AD3Ad5B',
    },
  },
  LidoLendCircuitBreakerActions: {
    startable: true,
    abi: abi.lidoLendCircuitBreakerActionsAbi,
    displayName: 'Circuit Breaker Actions',
    tags: ['Lido Lend', 'Circuit Breaker'],
    // Order mirrors the `Action` enum in LidoLendCircuitBreakerActions.sol.
    actionTitles: [
      'Register pauser',
      'Set pause duration',
      'Set heartbeat interval',
    ],
    addresses: {
      [CHAINS.Hoodi]: '0x812Ea1494d53d8D1ba479c4c1D88c9d680ea88C5',
    },
  },
  LidoLendExitBookActions: {
    startable: true,
    abi: abi.lidoLendExitBookActionsAbi,
    displayName: 'Exit Book Actions',
    tags: ['Lido Lend', 'Exit Book'],
    // Order mirrors the `Action` enum in LidoLendExitBookActions.sol.
    actionTitles: [
      'Update Morpho exit book markets',
      'Update ERC-4626 exit book vaults',
    ],
    addresses: {
      [CHAINS.Hoodi]: '0xC520f27acEF637B4F07Cce4a2B18c643F27f4D14',
    },
  },
  LidoLendRiskStewardActions: {
    startable: true,
    abi: abi.lidoLendRiskStewardActionsAbi,
    displayName: 'Risk Steward Actions',
    tags: ['Lido Lend', 'Risk Steward'],
    // Order mirrors the `Action` enum in LidoLendRiskStewardActions.sol.
    actionTitles: ['Add risk steward', 'Remove risk steward'],
    addresses: {
      [CHAINS.Hoodi]: '0xeF584E7fBbE0fCe7463dC00c063462973e5cbDa4',
    },
  },
  LidoLendActivateMarket: {
    startable: true,
    abi: abi.lidoLendActivateMarketAbi,
    displayName: 'Activate market',
    tags: ['Lido Lend'],
    addresses: {
      [CHAINS.Hoodi]: '0xC4F75E3Da78230Ff9235A2E5Cf6F1962C56A4C69',
    },
  },
  LidoLendApplyIrmConfig: {
    startable: true,
    abi: abi.lidoLendApplyIrmConfigAbi,
    displayName: 'Apply IRM config',
    tags: ['Lido Lend'],
    addresses: {
      [CHAINS.Hoodi]: '0xca22a45A392d201EaaE540Fb12cA360Db9d847B2',
    },
  },
} as const);
