import { aragonVotingAbi } from 'abi/generated';
import {
  VoteEvent,
  VoteCastEventLog,
  VoteCastEventLogArgs,
  AttemptCastVoteAsDelegateEventLog,
} from 'shared/votes/types';
import type { Address, PublicClient } from 'viem';
import { findAbiItem } from 'utils/find-abi-item';

const GET_LOGS__HALF_RANGE = 2499n;

type VoteInfo = Pick<VoteCastEventLog, 'blockNumber' | 'transactionIndex'> &
  VoteCastEventLogArgs;

type VotesMap = Record<
  string,
  Pick<VoteCastEventLog, 'blockNumber' | 'transactionIndex'> &
    VoteCastEventLogArgs
>;

const isVoteMoreRecentThan = (
  newVote: VoteCastEventLog,
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

export const getVoteEvents = async (
  votingContractAddress: Address,
  client: PublicClient,
  voteId: bigint,
  block: bigint,
): Promise<VoteEvent[]> => {
  const castVoteEvents = (await client.getLogs({
    address: votingContractAddress,
    event: castVoteEventAbi,
    args: {
      voteId: BigInt(voteId),
    },
    fromBlock: block - GET_LOGS__HALF_RANGE,
    toBlock: block + GET_LOGS__HALF_RANGE,
  })) as unknown as VoteCastEventLog[];

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
        stake: event.args.stake as unknown as bigint,
        voteId: event.args.voteId,
      };
    }
  }

  const castVoteAsDelegateEvents = (await client.getLogs({
    address: votingContractAddress,
    event: attemptCastVoteAsDelegateAbi,
    args: {
      voteId: BigInt(voteId),
    },
    fromBlock: block - GET_LOGS__HALF_RANGE,
    toBlock: block + GET_LOGS__HALF_RANGE,
  })) as unknown as AttemptCastVoteAsDelegateEventLog[];

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
