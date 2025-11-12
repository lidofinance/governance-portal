import { useLidoSDK } from 'providers/lido-sdk';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { MEVBoostRelayList } from 'shared/blockchain/contracts';
import { MEVBoostRelay } from '../motion-card-description/types-mev';

export const useMEVBoostRelays = () => {
  const { chainId } = useLidoSDK();
  const mevBoostRelayList = useReadContract(MEVBoostRelayList);

  const query = useQuery({
    queryKey: ['mev-boost-relays', chainId, mevBoostRelayList.address],
    queryFn: async () => {
      const relays = (await mevBoostRelayList.readContract(
        'get_relays',
      )) as unknown as [
        string, // uri
        string, // operator/name
        boolean, // is_mandatory
        string, // description
      ][];

      // Create a map for quick lookups
      const relaysMap = new Map<string, MEVBoostRelay & { uriHost: string }>();

      relays.forEach((relay) => {
        const [uri, name, isMandatory, description] = relay;

        // Extract hostname from URI for display
        let uriHost = uri;
        try {
          const url = new URL(uri);
          uriHost = url.hostname;
        } catch {
          // If URI parsing fails, use the full URI
        }

        relaysMap.set(uri, {
          uri,
          name,
          isMandatory,
          description,
          uriHost,
        });
      });

      return { relays, relaysMap };
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });

  return {
    relays: query.data?.relays,
    relaysMap: query.data?.relaysMap,
    isRelaysDataLoading: query.isLoading,
    ...query,
  };
};
