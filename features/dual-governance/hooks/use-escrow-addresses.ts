import { useLidoSDK } from 'providers/lido-sdk';
import { useEffect, useMemo, useState } from 'react';
import { DualGovernance } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { usePublicClient, useReadContracts } from 'wagmi';
import { findAbiItem } from 'utils/find-abi-item';
import { Address } from 'viem';

const ESCROW_CHANGED_EVENT_NAME = 'NewSignallingEscrowDeployed';

export const useEscrowAddresses = () => {
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient();
  const [historicalEscrowAddresses, setHistoricalEscrowAddresses] = useState<
    Address[] | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);

  const dgContract = useMemo(
    () => ({
      address: getContractAddress(DualGovernance, chainId),
      abi: DualGovernance.abi,
    }),
    [chainId],
  );

  const eventAbi = findAbiItem({
    abi: DualGovernance.abi,
    name: ESCROW_CHANGED_EVENT_NAME,
    type: 'event',
  });

  const {
    data,
    isLoading: isEscrowAddressLoading,
    error,
    refetch,
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

  useEffect(() => {
    if (!publicClient) {
      console.error('Public client must be defined');
      return;
    }

    const fetchLogs = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: getContractAddress(DualGovernance, chainId),
          event: eventAbi,
          fromBlock: 0n,
          toBlock: 'latest',
        });

        if (logs.length > 0) {
          const _escrowAddresses = logs.map((log: any) => log.args.escrow);

          setHistoricalEscrowAddresses(_escrowAddresses);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLogs();
    setIsLoading(false);
  }, [publicClient, chainId, data, eventAbi]);

  return {
    vetoSignallingAddress: data?.[0].result,
    rageQuitAddress: data?.[1].result,
    historicalEscrowAddresses,
    isLoading: isLoading && isEscrowAddressLoading,
    error,
    refetch,
  };
};
