import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { ContractObject, Token } from './types';
import { TOKEN_CONTRACT_MAP } from './constants';
import { Address } from 'viem';

export const getContractAddress = (
  contract: ContractObject,
  chainId: CHAINS,
): Address => {
  const address = contract.chainAddressMap[chainId];

  if (!address) {
    throw new Error(
      `Contract ${contract.name} address is not defined for chainId: ${chainId}`,
    );
  }

  return address;
};

export const getTokenAddress = (token: Token, chainId: CHAINS) => {
  const contract = TOKEN_CONTRACT_MAP[token];

  if (!contract) {
    throw new Error(
      `Contract for token ${token} is not defined for chainId: ${chainId}`,
    );
  }

  return getContractAddress(contract, chainId);
};
