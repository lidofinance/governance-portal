import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { MEVBoostRelayList } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';

export const useMEVBoostRelays = () => {
  const { chainId } = useLidoSDK();

  const readMEVBoostRelayList = useReadContract(MEVBoostRelayList);

  const result = useQuery({
    queryKey: [
      `mev-boost-relays-list-${chainId}`,
      readMEVBoostRelayList.address,
    ],
    queryFn: async () => {
      const relays = await readMEVBoostRelayList.readContract('get_relays');

      const parsedRelaysList = relays.map((relay) => {
        return {
          uri: relay.uri,
          name: relay.operator,
          isMandatory: relay.is_mandatory,
          description: relay.description,
          uriHost: relay.uri.split('@')[1],
        };
      });

      const relaysMap = new Map(
        parsedRelaysList.map((relay) => {
          return [relay.uri, relay];
        }),
      );

      return {
        relaysList: parsedRelaysList,
        relaysMap: relaysMap,
        relaysCount: relays.length,
      };
    },
  });

  return {
    relaysList: result.data?.relaysList,
    relaysMap: result.data?.relaysMap,
    relaysCount: result.data?.relaysCount ?? 0,
    error: result.error,
    isRelaysDataLoading: result.isLoading,
  };
};
