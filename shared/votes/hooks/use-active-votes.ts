import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { Voting } from 'shared/blockchain/contracts';
import { range } from 'lodash';
import { getVoteStatus } from 'shared/votes/utils/get-vote-status';
import { getEventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { usePublicClient } from 'wagmi';
import { VoteStatus } from 'shared/votes/types';

const PAGE_SIZE = 1;

type Props = {
  currentPage: number;
  showActive?: boolean;
};

export type VoteResult = {
  voteId: number;
  vote: any;
  canExecute: any;
  event: any;
  state: any;
} | null;

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

export const useActiveVotes = ({ currentPage, showActive = false }: Props) => {
  const AragonVoting = useReadContract(Voting);

  const client = usePublicClient();

  return useQuery({
    queryKey: ['activeVotes', `${currentPage}`],
    queryFn: async () => {
      const votesTotalBn = await AragonVoting.readContract('votesLength');
      const votesTotal = Number(votesTotalBn);
      if (!votesTotal) {
        return null;
      }

      const startId = votesTotal - 1 - (currentPage - 1) * PAGE_SIZE;
      const endId = Math.max(startId - PAGE_SIZE, 0);
      const ids = range(startId, endId, -1);

      const votesPromises: Promise<VoteResult>[] = ids.map((voteId) => {
        const fetch = async () => {
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

            let startEvent = {};

            if (client && vote.snapshotBlock) {
              const voteStartEvent = await getEventStartVote({
                address: AragonVoting.address,
                client,
                voteId: BigInt(voteId),
                block: vote.snapshotBlock,
                eventAbi: startVoteEventAbi,
              });
              startEvent = { ...voteStartEvent };
            }

            return {
              voteId,
              vote,
              canExecute,
              event: startEvent,
              state: getVoteStatus(vote, canExecute),
            };
          } catch (e) {
            console.error(e);
            return null;
          }
        };
        return fetch();
      });

      const votes = (await Promise.all(votesPromises)).filter(
        (v): v is NonNullable<VoteResult> => v !== null,
      );

      if (votes.length === 0) {
        return { votes: [] };
      }

      return {
        votes: showActive
          ? votes.filter(
              (vote) =>
                vote.state?.status === VoteStatus.ActiveMain ||
                vote.state?.status === VoteStatus.ActiveObjection,
            )
          : votes,
      };
    },
    staleTime: Infinity,
  });
};
