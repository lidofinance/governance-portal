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
    queryKey: ['motion-details', motionId],
    queryFn: async () => {
      invariant(client, 'client must be defined');
      invariant(easyTrackContract, 'easyTrack contract must be defined');
      invariant(motionId, 'motionId contract must be defined');

      try {
        const onChainMotionData = await easyTrackContract.readContract(
          'getMotion',
          [BigInt(motionId)],
        );

        if (onChainMotionData) {
          const event = await getMotionCreatedEvent({
            easyTrackContract,
            motionId: onChainMotionData.id,
            motionSnapshotBlock: onChainMotionData.snapshotBlock,
            client,
          });

          return formatMotionDataOnchain(event as any, onChainMotionData);
        } else {
          const subgraphMotion = await fetchMotionsSubgraphItem(
            chainId,
            motionId,
          );

          if (subgraphMotion) {
            const event = (await getMotionCreatedEvent({
              easyTrackContract,
              motionId: BigInt(subgraphMotion.id),
              motionSnapshotBlock: BigInt(subgraphMotion.snapshotBlock),
              client,
            })) as any;
            return {
              evmScript: event.args._evmScript,
              ...subgraphMotion,
            };
          }
          return await fetchMotionsSubgraphItem(chainId, motionId);
        }
      } catch (error) {
        return await fetchMotionsSubgraphItem(chainId, motionId);
      }
    },
  });
};
