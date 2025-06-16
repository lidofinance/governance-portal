import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { parseAbiItem } from 'viem';
import { Address } from 'viem';
import invariant from 'tiny-invariant';
import { usePublicClient } from 'wagmi';
import { CONTRACT_DEPLOYMENT_BLOCKS } from 'shared/blockchain/deployment-blocks';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

type HistoricalGovernanceAddressesResult = {
  addresses: Address[];
  isLoading: boolean;
  error: Error | null;
};

/**
 *  This hook is in a draft state ATM. Do not use.
 */
export const useGetHistoricalGovernanceAddresses =
  (): HistoricalGovernanceAddressesResult => {
    const { chainId } = useLidoSDK();
    const isSupportedChain = useIsSupportedChain();
    const EPTContract = useReadContract(EmergencyProtectedTimelock);
    const client = usePublicClient();

    const {
      data: addresses = [],
      isLoading,
      error,
    } = useQuery<Address[], Error>({
      queryKey: ['historicalGovernanceAddresses', chainId],
      queryFn: async () => {
        if (!client || !EPTContract) {
          return [];
        }

        return getGovernanceSetAddresses({
          client,
          EPTContract,
          chainId,
        });
      },
      enabled: !!EPTContract && isSupportedChain,
      staleTime: 300000, // 5 minutes
      retry: 1,
    });

    return {
      addresses,
      isLoading,
      error,
    };
  };

type Props = {
  client: ReturnType<typeof usePublicClient>;
  EPTContract: {
    address: Address;
  };
  chainId?: CHAINS;
};

const getGovernanceSetAddresses = async ({
  client,
  EPTContract,
  chainId,
}: Props): Promise<Address[]> => {
  const eventAbi = parseAbiItem('event GovernanceSet(address newGovernance)');

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');
  invariant(EPTContract, 'EPTContract not found');

  try {
    const contractAddress = EPTContract.address;

    const deploymentBlock =
      chainId && chainId in CONTRACT_DEPLOYMENT_BLOCKS
        ? CONTRACT_DEPLOYMENT_BLOCKS[chainId]?.emergencyProtectedTimelock || 0n
        : 0n;

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      fromBlock: deploymentBlock,
      toBlock: 'latest',
    });

    return logs
      .map((log) => log.args.newGovernance as Address)
      .filter((addr): addr is Address => !!addr);
  } catch (error) {
    console.error('Error fetching GovernanceSet events:', error);
    return [];
  }
};
