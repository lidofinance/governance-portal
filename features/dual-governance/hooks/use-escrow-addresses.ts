import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';
import { DualGovernance } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { usePublicClient, useReadContracts } from 'wagmi';
import { findAbiItem } from 'utils/find-abi-item';
import { Address } from 'viem';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';
import { registerDynamicAddressesBatch } from 'utils/dynamic-addresses';
import { useQuery } from '@tanstack/react-query';
import { getBatchedLogs } from 'utils/batched-logs';

export const useEscrowAddresses = () => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();

  const dgContract = useMemo(
    () => ({
      address: getContractAddress(DualGovernance, chainId),
      abi: DualGovernance.abi,
    }),
    [chainId],
  );

  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: 'NewSignallingEscrowDeployed',
    type: 'event',
  });

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

  const {
    data: historicalAddresses,
    isLoading: isLoadingHistoricalAddresses,
    error: historicalAddressesError,
    refetch: refetchHistoricalAddresses,
  } = useQuery<Address[] | null>({
    queryKey: ['historical-escrow-addresses', chainId],
    enabled: !!publicClient && !!chainId && !!eventAbi,
    staleTime: 30000, // 5 minutes
    queryFn: async () => {
      if (!publicClient) {
        throw new Error('Public client must be defined');
      }
      if (!eventAbi) {
        throw new Error('eventAbi must be defined');
      }

      const deploymentBlock =
        CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.dualGovernance || 0n;

      const contractAddress = getContractAddress(DualGovernance, chainId);

      const allLogs: any[] = [];

      try {
        const logs = await getBatchedLogs({
          publicClient,
          address: contractAddress,
          event: eventAbi,
          fromBlock: deploymentBlock,
          toBlock: 'latest',
          onProgress: (current, total) => {
            const percentComplete = Number((current * 100n) / total);
            console.debug(
              `Loading escrowAddresses logs: ${percentComplete}% complete`,
            );
          },
        });

        allLogs.push(...logs);
      } catch (error) {
        console.error(`Error fetching EPT proposal logs`, error);
      }

      if (allLogs.length > 0) {
        const _escrowAddresses = allLogs.map((log: any) => log.args.escrow);

        // Batch register escrow addresses to prevent rate limiting
        if (_escrowAddresses.length > 0) {
          registerDynamicAddressesBatch(
            chainId,
            _escrowAddresses,
            'escrow',
          ).catch((error) => {
            console.error(`Error batch registering escrow addresses:`, error);
          });
        }

        return _escrowAddresses;
      }

      return null;
    },
  });

  const refetch = async () => {
    await Promise.all([refetchEscrowAddresses(), refetchHistoricalAddresses()]);
  };

  const error = escrowAddressError || historicalAddressesError || null;
  const isLoading = isEscrowAddressLoading || isLoadingHistoricalAddresses;

  return {
    vetoSignallingAddress: data?.[0].result,
    rageQuitAddress: data?.[1].result,
    historicalEscrowAddresses: historicalAddresses,
    isLoading,
    error,
    refetch,
  };
};
