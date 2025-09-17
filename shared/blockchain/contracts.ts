import { ContractObject } from './types';

import * as abi from 'abi/ts';
import * as addr from './contract-addresses';

export const StETH: ContractObject<typeof abi.stEthAbi> = {
  name: 'stETH',
  abi: abi.stEthAbi,
  chainAddressMap: addr.StETH,
};

export const WstETH: ContractObject<typeof abi.wstEthAbi> = {
  name: 'wstETH',
  abi: abi.wstEthAbi,
  chainAddressMap: addr.WstETH,
};

export const WithdrawalQueue: ContractObject<typeof abi.withdrawalQueueAbi> = {
  name: 'WithdrawalQueue',
  abi: abi.withdrawalQueueAbi,
  chainAddressMap: addr.WithdrawalQueue,
};

export const WithdrawalQueueMock: ContractObject<
  typeof abi.withdrawalQueueMockAbi
> = {
  name: 'WithdrawalQueueMock',
  abi: abi.withdrawalQueueMockAbi,
  chainAddressMap: addr.WithdrawalQueue,
};

export const Voting: ContractObject<typeof abi.votingAbi> = {
  name: 'AragonVoting',
  abi: abi.votingAbi,
  chainAddressMap: addr.Voting,
};

export const DualGovernance: ContractObject<typeof abi.dualGovernanceAbi> = {
  name: 'DualGovernance',
  abi: abi.dualGovernanceAbi,
  chainAddressMap: addr.DualGovernance,
};

export const EmergencyProtectedTimelock: ContractObject<
  typeof abi.emergencyProtectedTimelockAbi
> = {
  name: 'EmergencyProtectedTimelock',
  abi: abi.emergencyProtectedTimelockAbi,
  chainAddressMap: addr.EmergencyProtectedTimelock,
};

export const EmergencyGovernance: ContractObject<
  typeof abi.emergencyGovernanceAbi
> = {
  name: 'EmergencyGovernance',
  abi: abi.emergencyGovernanceAbi,
  chainAddressMap: addr.EmergencyGovernance,
};

export const DaoToken: ContractObject<typeof abi.daoTokenAbi> = {
  name: 'DaoToken',
  abi: abi.daoTokenAbi,
  chainAddressMap: addr.DaoToken,
};
