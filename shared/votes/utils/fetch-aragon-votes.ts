import { votingAbi } from 'abi/ts';
import { Vote, VoteStatus } from '../types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { PublicClient } from 'viem';
import { parseVote } from './parse-vote';
import {
  getEventStartVote,
  StartVoteEventArgs,
} from 'shared/votes/utils/get-event-start-vote';

type VotingContract = ReturnType<typeof useReadContract<typeof votingAbi>>;

type FetchArgs = {
  votingContract: VotingContract;
  limit: number;
  offset?: number;
  client: PublicClient | undefined;
  onlyActive?: boolean;
};

type VoteResult = Vote & { startEvent: StartVoteEventArgs | null };

const isVoteActive = (vote: Vote) => {
  if (
    vote.state.status === VoteStatus.ActiveObjection &&
    !vote.state.isQuorumReached
  ) {
    return false;
  }
  return (
    vote.state.status === VoteStatus.ActiveMain ||
    vote.state.status === VoteStatus.ActiveObjection ||
    vote.canExecute
  );
};

export const fetchAragonVotes = async ({
  votingContract,
  limit,
  offset = 0,
  client,
  onlyActive = true,
}: FetchArgs): Promise<VoteResult[]> => {
  const votesLengthBn = await votingContract.readContract('votesLength');
  const votesLength = Number(votesLengthBn);

  if (votesLength === 0) {
    return [];
  }

  const startId = votesLength - 1 - offset;
  const endId = Math.max(startId - limit + 1, 0);

  const voteIds = Array.from(
    { length: startId - endId + 1 },
    (_, i) => startId - i,
  );

  const votes = await Promise.all(
    voteIds.map((voteId) =>
      fetchAragonVote({
        votingContract,
        voteId,
        client,
      }),
    ),
  );

  return votes.filter(
    (vote): vote is VoteResult =>
      !!vote && (onlyActive ? isVoteActive(vote) : true),
  );
};

type FetchVoteArgs = {
  votingContract: VotingContract;
  voteId: number;
  client: PublicClient | undefined;
};

export const fetchAragonVote = async ({
  votingContract,
  voteId,
  client,
}: FetchVoteArgs) => {
  try {
    const voteIdBigInt = BigInt(voteId);

    const [rawVote, canExecute] = await Promise.all([
      votingContract.readContract('getVote', [voteIdBigInt]),
      votingContract.readContract('canExecute', [voteIdBigInt]),
    ]);

    const vote = parseVote(voteId, rawVote, canExecute);

    let startEvent: StartVoteEventArgs | null = null;

    if (client && vote.snapshotBlock) {
      startEvent = await getEventStartVote({
        address: votingContract.address,
        client,
        voteId: voteIdBigInt,
        block: vote.snapshotBlock,
      });
    }

    return {
      ...vote,
      startEvent,
    };
  } catch (e) {
    console.error(`Error fetching vote ${voteId}:`, e);
    return null;
  }
};
