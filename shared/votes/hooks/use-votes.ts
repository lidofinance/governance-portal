import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { range } from 'lodash';
import { getVoteStatus } from 'shared/votes/utils/get-vote-status';
import { getEventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { usePublicClient } from 'wagmi';
import { VoteStatus } from 'shared/votes/types';
import { Address } from 'viem';

type Props = {
  limit: number;
  getActive?: boolean;
};

export type VoteData = {
  voteId: number;
  id: number;
  vote: any;
  canExecute: boolean;
  event?: {
    creator: Address;
    metadata: string;
    voteId: bigint;
  };
  state: {
    status: VoteStatus;
    isQuorumReached: boolean;
  };
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

export const useVotes = ({ limit, getActive = false }: Props) => {
  const AragonVoting = useReadContract(Voting);
  const client = usePublicClient();

  return useQuery({
    queryKey: ['activeVotes', limit],
    queryFn: async () => {
      try {
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
              const [rawVote, canExecute] = await Promise.all([
                AragonVoting.readContract('getVote', [BigInt(voteId)]),
                AragonVoting.readContract('canExecute', [BigInt(voteId)]),
              ]);

              const getVoteAbi = Voting.abi.find(
                (item) => item.type === 'function' && item.name === 'getVote',
              );
              if (!getVoteAbi) {
                console.error('ABI entry for getVote not found.');
                return null;
              }

              const vote = mapPayload(getVoteAbi, 'getVote', rawVote);
              const startVoteEventAbi = Voting.abi.find(
                (item) => item.type === 'event' && item.name === 'StartVote',
              );

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
                id: voteId,
                vote,
                canExecute,
                event: startEvent,
                state,
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
          votes: getActive
            ? votes.filter(
                (vote) =>
                  vote.state.status === VoteStatus.ActiveMain ||
                  vote.state.status === VoteStatus.ActiveObjection,
              )
            : votes,
        };
      } catch (e) {
        console.error('Error in useVotes:', e);
        return { votes: [] };
      }
    },
    staleTime: Infinity,
  });
};
