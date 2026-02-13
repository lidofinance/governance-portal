import { orderBy } from 'lodash';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EasyTrack } from 'shared/blockchain/contracts';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { Motion, RawMotionSubgraph } from '../types';
import {
  getQuerySubgraphMotions,
  fetchMotionsSubgraphList,
} from '../subgraph/motions-subgraph-fetchers';
import { getMotionCreatedEvent } from '../utils/get-motion-created-event';
import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { formatMotionDataOnchain } from '../utils/format-motion-data-onchain';
import { Hex } from 'viem';

export const useActiveMotions = () => {
  const easyTrack = useReadContract(EasyTrack);
  const { chainId } = useLidoSDK();
  const publicClient = usePublicClient({ chainId });

  return useQuery({
    queryKey: ['active-motions', chainId],
    queryFn: async () => {
      invariant(publicClient, 'Public client must be defined');
      const activeMotions = await easyTrack.readContract('getMotions');

      const parsedMotionsWithScripts: Motion[] = [];
      for (const motion of activeMotions) {
        try {
          const event = await getMotionCreatedEvent({
            easyTrackContract: easyTrack,
            motionId: motion.id,
            motionSnapshotBlock: motion.snapshotBlock,
            client: publicClient,
          });

          if (event) {
            parsedMotionsWithScripts.push(
              formatMotionDataOnchain(event as any, motion),
            );
          }
        } catch (error) {
          console.error(`Failed to fetch motion ${motion.id}:`, error);
        }
      }

      return orderBy(parsedMotionsWithScripts, ['id'], ['desc']);
    },
  });
};

const PAGE_SIZE = 8;

const convertSubgraphToMotion = (raw: RawMotionSubgraph): Motion => {
  return {
    id: BigInt(raw.id),
    evmScriptFactory: raw.evmScriptFactory.toLowerCase() as Hex,
    creator: raw.creator.toLowerCase() as Hex,
    duration: BigInt(raw.duration),
    startDate: BigInt(raw.startDate),
    snapshotBlock: BigInt(raw.snapshotBlock),
    objectionsThreshold: BigInt(raw.objectionsThreshold),
    objectionsAmount: BigInt(raw.objectionsAmount),
    evmScriptHash: raw.evmScriptHash as Hex,
    status: raw.status,
    enacted_at: raw.enacted_at ? Number(raw.enacted_at) : undefined,
    evmScriptCalldata: raw.evmScriptCalldata as Hex,
    isOnChain: false,
  };
};

export const useArchivedMotions = () => {
  const { chainId } = useLidoSDK();

  return useInfiniteQuery({
    queryKey: ['archived-motions', chainId],
    queryFn: async ({ pageParam = 0 }) => {
      const query = getQuerySubgraphMotions({
        first: PAGE_SIZE,
        skip: pageParam * PAGE_SIZE,
      });
      const rawMotions = await fetchMotionsSubgraphList(chainId, query);
      return rawMotions.map(convertSubgraphToMotion);
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than PAGE_SIZE, there are no more pages
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      // Return the next page index
      return allPages.length;
    },
    initialPageParam: 0,
  });
};
