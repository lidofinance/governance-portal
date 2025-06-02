import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { parseAbiItem } from 'viem';
import { Address } from 'viem';
import invariant from 'tiny-invariant';
import { usePublicClient } from 'wagmi';

type HistoricalGovernanceAddressesResult = {
  addresses: Address[];
  isLoading: boolean;
  error: Error | null;
};

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
        });
      },
      enabled: !!EPTContract && isSupportedChain,
      staleTime: 5 * 60 * 1000,
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
};

const getGovernanceSetAddresses = async ({
  client,
  EPTContract,
}: Props): Promise<Address[]> => {
  const eventAbi = parseAbiItem('event GovernanceSet(address newGovernance)');

  invariant(client, 'Client must be provided');
  invariant(eventAbi, 'Event ABI not found');
  invariant(EPTContract, 'EPTContract not found');

  try {
    const contractAddress = EPTContract.address;

    const logs = await client.getLogs({
      address: contractAddress,
      event: eventAbi,
      fromBlock: 252997n,
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
