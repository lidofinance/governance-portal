import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { range } from 'lodash';
import {
  getVoteStatus,
  isQuorumReached,
} from 'shared/votes/utils/get-vote-status';
import { getEventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { usePublicClient, useChainId } from 'wagmi';
import { VoteData, VoteStatus } from 'shared/votes/types';
import { findAbiItem } from 'utils/find-abi-item';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  limit: number;
  getActive?: boolean;
};

const mapPayload = (
  functionAbi: any,
  functionName: string,
  rawPayload: any,
) => {
  if (!functionAbi || !functionAbi.outputs) {
    throw new Error(
      `Function ${functionName} not found or has no outputs in the ABI.`,
    );
  }

  return functionAbi.outputs.reduce(
    (
      acc: { [x: string]: any },
      output: { name: string },
      index: string | number,
    ) => {
      const key = output.name || `output_${index}`;
      acc[key] = rawPayload[index];
      return acc;
    },
    {},
  );
};

const filterVotes = (votes: VoteData[]) => {
  return votes.filter((voteData) => {
    voteData.state.status, VoteStatus.ActiveObjection;
    if (
      voteData.state.status === VoteStatus.ActiveObjection &&
      !isQuorumReached(voteData.vote)
    ) {
      return false;
    }
    return (
      voteData.state.status === VoteStatus.ActiveMain ||
      voteData.state.status === VoteStatus.ActiveObjection ||
      voteData.canExecute
    );
  });
};

export const useVotes = ({ limit, getActive = false }: Props) => {
  const AragonVoting = useReadContract(Voting);
  const client = usePublicClient();
  const isSupportedChain = useIsSupportedChain();
  const chainId = useChainId();
  const { chainId: sdkChainId } = useLidoSDK();

  return useQuery({
    queryKey: ['activeVotes', limit, chainId],
    enabled: isSupportedChain && chainId === sdkChainId,
    queryFn: async () => {
      try {
        if (!isSupportedChain) {
          console.warn('Votes query skipped - unsupported chain');
          return { votes: [] };
        }

        if (chainId !== sdkChainId) {
          console.warn(
            `Chain mismatch: Current chain ${chainId}, SDK chain ${sdkChainId}`,
          );
          return { votes: [] };
        }

        const votesTotalBn = await AragonVoting.readContract('votesLength');
        const votesTotal = Number(votesTotalBn);
        if (!votesTotal) {
          return { votes: [] };
        }

        const startId = votesTotal - 1;
        const endId = Math.max(startId - limit + 1, 0);
        const ids = range(startId, endId - 1, -1);

        const votesPromises = ids.map(
          async (voteId): Promise<VoteData | null> => {
            try {
              const [rawVote, canExecute, voteTime, objectionPhaseTime] =
                await Promise.all([
                  AragonVoting.readContract('getVote', [BigInt(voteId)]),
                  AragonVoting.readContract('canExecute', [BigInt(voteId)]),
                  AragonVoting.readContract('voteTime'),
                  AragonVoting.readContract('objectionPhaseTime'),
                ]);

              const getVoteAbi = Voting.abi.find(
                (item) => item.type === 'function' && item.name === 'getVote',
              );
              if (!getVoteAbi) {
                console.error('ABI entry for getVote not found.');
                return null;
              }

              const vote = mapPayload(getVoteAbi, 'getVote', rawVote);

              const startVoteEventAbi = findAbiItem({
                abi: Voting.abi,
                name: 'StartVote',
                type: 'event',
              });

              let startEvent;

              if (client && vote.snapshotBlock) {
                const voteStartEvent = await getEventStartVote({
                  address: AragonVoting.address,
                  client,
                  voteId: BigInt(voteId),
                  block: vote.snapshotBlock,
                  eventAbi: startVoteEventAbi,
                });
                if (voteStartEvent) {
                  startEvent = { ...voteStartEvent };
                }
              }

              const state = getVoteStatus(vote, canExecute);
              if (!state) {
                return null;
              }

              return {
                voteId,
                proposalId: voteId,
                vote,
                canExecute,
                event: startEvent,
                state,
                voteTime: Number(voteTime),
                objectionPhaseTime: Number(objectionPhaseTime),
              };
            } catch (e) {
              console.error('Error fetching vote:', e);
              return null;
            }
          },
        );

        const votes = (await Promise.all(votesPromises)).filter(
          (v): v is VoteData => v !== null,
        );

        if (votes.length === 0) {
          return { votes: [] };
        }

        return {
          votes: getActive ? filterVotes(votes) : votes,
        };
      } catch (e) {
        console.error('Error in useVotes:', e);
        return { votes: [] };
      }
    },
  });
};
