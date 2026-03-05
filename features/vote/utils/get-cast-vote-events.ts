import { aragonVotingAbi } from 'abi/generated';
import { VoteEvent } from 'shared/votes/types';
import type { Address, GetLogsReturnType, PublicClient } from 'viem';
import { findAbiItem } from 'utils/find-abi-item';
import { fetchLogsInParallelChunks } from 'utils/fetch-logs-in-parallel';

const castVoteEventAbi = findAbiItem({
  abi: aragonVotingAbi,
  name: 'CastVote',
  type: 'event',
});

const attemptCastVoteAsDelegateAbi = findAbiItem({
  abi: aragonVotingAbi,
  name: 'AttemptCastVoteAsDelegate',
  type: 'event',
});

type CastVoteLog = GetLogsReturnType<
  typeof castVoteEventAbi,
  [typeof castVoteEventAbi],
  true
>[number];

type AttemptCastVoteAsDelegateLog = GetLogsReturnType<
  typeof attemptCastVoteAsDelegateAbi,
  [typeof attemptCastVoteAsDelegateAbi],
  true
>[number];

type VoteInfo = Pick<CastVoteLog, 'blockNumber' | 'transactionIndex'> &
  CastVoteLog['args'];

type VotesMap = Record<string, VoteInfo>;

const isVoteMoreRecentThan = (
  newVote: CastVoteLog,
  existingVote: VoteInfo,
): boolean => {
  if (!existingVote) {
    return true;
  }

  if (
    !newVote.blockNumber ||
    !existingVote.blockNumber ||
    !newVote.transactionIndex ||
    !existingVote.transactionIndex
  ) {
    return false;
  }

  if (newVote.blockNumber > existingVote.blockNumber) {
    return true;
  }

  if (
    newVote.blockNumber &&
    existingVote.blockNumber &&
    newVote.blockNumber === existingVote.blockNumber
  ) {
    return newVote.transactionIndex > existingVote.transactionIndex;
  }

  return false;
};

type Args = {
  votingContractAddress: Address;
  client: PublicClient;
  voteId: bigint;
  fromBlock: bigint;
  toBlock: bigint;
};

export const getCastVoteEvents = async ({
  votingContractAddress,
  client,
  voteId,
  fromBlock,
  toBlock,
}: Args): Promise<VoteEvent[]> => {
  const [castVoteEvents, castVoteAsDelegateEvents] = await Promise.all([
    fetchLogsInParallelChunks<CastVoteLog>({
      client,
      address: votingContractAddress,
      event: castVoteEventAbi,
      args: { voteId },
      fromBlock,
      toBlock,
    }),
    fetchLogsInParallelChunks<AttemptCastVoteAsDelegateLog>({
      client,
      address: votingContractAddress,
      event: attemptCastVoteAsDelegateAbi,
      args: { voteId },
      fromBlock,
      toBlock,
    }),
  ]);

  if (castVoteEvents.length === 0) {
    return [];
  }

  const votesMap: VotesMap = {};

  for (const event of castVoteEvents) {
    const key = event.args.voter.toLowerCase();

    if (isVoteMoreRecentThan(event, votesMap[key])) {
      votesMap[key] = {
        blockNumber: event.blockNumber,
        transactionIndex: event.transactionIndex ?? 0,
        voter: event.args.voter,
        supports: event.args.supports,
        stake: event.args.stake,
        voteId: event.args.voteId,
      };
    }
  }

  // ${delegateAddress}-${supports} -> VoteEvent
  const delegatedVotesMap: Record<string, VoteEvent | undefined> = {};

  for (const delegateEvent of castVoteAsDelegateEvents) {
    const nestedVotes: VoteEvent[] = [];

    for (const voter of delegateEvent.args.voters) {
      const key = voter.toLowerCase();
      const voteEvent = votesMap[key];

      if (!voteEvent) {
        continue;
      }

      if (
        voteEvent.blockNumber === delegateEvent.blockNumber &&
        voteEvent.transactionIndex === delegateEvent.transactionIndex
      ) {
        // If there is a vote happening at the same block and transaction index,
        // we can consider it as a delegated vote.
        nestedVotes.push({
          stake: voteEvent.stake,
          voter: voteEvent.voter,
          supports: voteEvent.supports,
        });

        delete votesMap[key];
      }
    }

    if (nestedVotes.length > 0) {
      const delegateSupports = nestedVotes[0].supports;
      const delegateKey = `${delegateEvent.args.delegate.toLowerCase()}-${delegateSupports}`;
      const existingDelegatedVote = delegatedVotesMap[delegateKey];

      let delegatedVotes = nestedVotes;
      // If there is an existing delegated vote with the same `supports` value,
      // we need to merge two delegated votes.
      if (existingDelegatedVote) {
        const nestedVotesMap = new Map<string, VoteEvent>();

        [
          ...(existingDelegatedVote.delegatedVotes ?? []),
          ...nestedVotes,
        ].forEach((v) => {
          nestedVotesMap.set(v.voter.toLowerCase(), v);
        });

        delegatedVotes = Array.from(nestedVotesMap.values());
      }

      const delegatedStake = delegatedVotes.reduce(
        (acc, v) => acc + v.stake,
        BigInt(0),
      );

      const sortedVotes = delegatedVotes.sort((a, b) => {
        return a.stake > b.stake ? -1 : 1;
      });

      delegatedVotesMap[delegateKey] = {
        voter: delegateEvent.args.delegate,
        delegatedVotes: sortedVotes,
        supports: delegateSupports,
        stake: delegatedStake,
      };
    }
  }

  return [
    ...(Object.values(votesMap) as VoteEvent[]),
    ...(Object.values(delegatedVotesMap) as VoteEvent[]),
  ].sort((a, b) => {
    return a.stake > b.stake ? -1 : 1;
  });
};
