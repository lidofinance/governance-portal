import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';
import { DualGovernance } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { useReadContracts } from 'wagmi';
import { historicalAddresses } from 'constants/historical-addresses';
import { Address } from 'viem';

export const useEscrowAddresses = () => {
  const { chainId } = useLidoSDK();

  const dgContract = useMemo(
    () => ({
      address: getContractAddress(DualGovernance, chainId),
      abi: DualGovernance.abi,
    }),
    [chainId],
  );

  const {
    data,
    isLoading: isEscrowAddressLoading,
    error: escrowAddressError,
    refetch: refetchEscrowAddresses,
  } = useReadContracts({
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

  const historicalEscrowAddresses =
    (historicalAddresses[chainId as keyof typeof historicalAddresses]
      ?.governanceAddresses as Address[] | undefined) || [];

  const refetch = async () => {
    await Promise.all([refetchEscrowAddresses()]);
  };

  const error = escrowAddressError || null;
  const isLoading = isEscrowAddressLoading;

  return {
    vetoSignallingAddress: data?.[0].result,
    rageQuitAddress: data?.[1].result,
    historicalEscrowAddresses,
    isLoading,
    error,
    refetch,
  };
};
