import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAccount } from 'wagmi';
import { ContractObject } from 'shared/blockchain/types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';

type Args = {
  evmContract: ContractObject;
};

export const useTrustedCaller = ({
  evmContract,
}: Args): UseQueryResult<Address> => {
  const { chainId } = useLidoSDK();
  const { address: walletAddress } = useAccount();

  const contractInstance = useReadContract(evmContract);

  return useQuery({
    queryKey: ['trustedCaller', contractInstance.address, chainId],
    queryFn: async () => await contractInstance.readContract('trustedCaller'),
    enabled: !!walletAddress,
  });
};
