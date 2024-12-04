import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';
import { DualGovernance } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { useReadContracts } from 'wagmi';

export const useEscrowAddresses = () => {
  const { chainId } = useLidoSDK();

  const dgContract = useMemo(
    () => ({
      address: getContractAddress(DualGovernance, chainId),
      abi: DualGovernance.abi,
    }),
    [chainId],
  );

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      {
        ...dgContract,
        functionName: 'getVetoSignallingEscrow',
      },
      {
        ...dgContract,
        functionName: 'getRageQuitEscrow',
      },
    ],
  });

  return {
    vetoSignallingAddress: data?.[0].result,
    rageQuitAddress: data?.[1].result,
    isLoading,
    error,
    refetch,
  };
};
