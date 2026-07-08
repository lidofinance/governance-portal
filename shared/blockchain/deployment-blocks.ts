import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

type ContractDeploymentBlockMap = Record<
  'dualGovernance' | 'emergencyProtectedTimelock',
  bigint
>;

type ChainContractsMap = Partial<Record<CHAINS, ContractDeploymentBlockMap>>;

export const CONTRACT_DEPLOYMENT_BLOCKS: ChainContractsMap = {
  [CHAINS.Mainnet]: {
    dualGovernance: 22537924n,
    emergencyProtectedTimelock: 22537921n,
  },
  [CHAINS.Hoodi]: {
    // DualGovernance: 252981n,
    dualGovernance: 391701n,
    // EmergencyProtectedTimelock: 252978n,
    emergencyProtectedTimelock: 391698n,
  },
};
