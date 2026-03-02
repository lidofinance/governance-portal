import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';
import { DualGovernance } from 'shared/blockchain/contracts';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { useReadContracts } from 'wagmi';
import { HISTORICAL_ADDRESSES } from '../../../constants/historical-addresses.mjs';
import { Address } from 'viem';

export const useEscrowAddresses = () => {
  const { chainId } = useLidoSDK();

  const dgAddress = useContractAddress(DualGovernance);

  const dgContract = useMemo(
    () => ({
      address: dgAddress,
      abi: DualGovernance.abi,
    }),
    [dgAddress],
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
    (HISTORICAL_ADDRESSES[chainId as keyof typeof HISTORICAL_ADDRESSES]
      ?.escrowAddresses as Address[] | undefined) || [];

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
