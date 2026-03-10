import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EasyTrack } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { getMotionCreatedEvent } from '../utils/get-motion-created-event';
import { usePublicClient } from 'wagmi';
import { useLidoSDK } from 'providers/lido-sdk';
import invariant from 'tiny-invariant';
import { fetchMotionsSubgraphItem } from '../subgraph/motions-subgraph-fetchers';
import { formatMotionDataOnchain } from '../utils/format-motion-data-onchain';

type Args = {
  motionId: string;
};

export const useMotionDetails = ({ motionId }: Args) => {
  const { chainId } = useLidoSDK();
  const easyTrackContract = useReadContract(EasyTrack);
  const client = usePublicClient({ chainId });

  return useQuery({
    enabled: !!client,
    queryKey: ['motion-details', motionId, chainId],
    queryFn: async () => {
      invariant(client, 'client must be defined');
      invariant(motionId, 'motionId contract must be defined');

      const onChainMotionData = await easyTrackContract.readContract(
        'getMotion',
        [BigInt(motionId)],
      );

      if (!onChainMotionData) {
        const subgraphMotion = await fetchMotionsSubgraphItem(
          chainId,
          motionId,
        );
        if (!subgraphMotion) {
          return undefined;
        }

        let event;
        try {
          event = await getMotionCreatedEvent({
            easyTrackContract,
            motionId: BigInt(subgraphMotion.id),
            motionSnapshotBlock: BigInt(subgraphMotion.snapshotBlock),
            client,
          });
        } catch {
          // evmScript is optional — return subgraph data without it
        }

        return {
          ...subgraphMotion,
          evmScript: event?.args._evmScript,
        };
      }

      const event = await getMotionCreatedEvent({
        easyTrackContract,
        motionId: onChainMotionData.id,
        motionSnapshotBlock: onChainMotionData.snapshotBlock,
        client,
      });

      return formatMotionDataOnchain(event, onChainMotionData);
    },
  });
};
