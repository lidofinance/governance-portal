import { aragonVotingAbi } from 'abi/generated';
import { RawVote, Vote, VoteStatus } from '../types';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { ContractFunctionParameters, PublicClient } from 'viem';
import { parseVote } from './parse-vote';
import { EventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { EventExecuteVote } from './get-event-execute-vote';
import { getEventsExecuteVote } from './get-events-execute-vote';
import { getEventsStartVote } from './get-events-start-vote';

type VotingContract = ReturnType<
  typeof useReadContract<typeof aragonVotingAbi>
>;

type FetchArgs = {
  votingContract: VotingContract;
  limit: number;
  offset?: number;
  client: PublicClient;
  onlyActive?: boolean;
};

type VoteResult = Vote & {
  startEvent: EventStartVote | null;
  executeEvent: EventExecuteVote | null;
};

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

  const contractConfig = {
    address: votingContract.address,
    abi: aragonVotingAbi,
  } as const;

  const getVotesBatch = async (voteIds: number[]) => {
    const voteCalls: ContractFunctionParameters[] = voteIds.map((id) => ({
      ...contractConfig,
      functionName: 'getVote',
      args: [id],
    }));

    const executeCalls: ContractFunctionParameters[] = voteIds.map((id) => ({
      ...contractConfig,
      functionName: 'canExecute',
      args: [id],
    }));

    const results = await client.multicall({
      contracts: [...voteCalls, ...executeCalls],
    });

    const voteResults = results.slice(0, voteIds.length);
    const executeResults = results.slice(voteIds.length);

    return voteIds.map((id, index) => {
      return parseVote(
        id,
        voteResults[index].result as RawVote,
        executeResults[index].result as boolean,
      );
    });
  };

  const allVotes = await getVotesBatch(voteIds);

  const votesToProcess = onlyActive ? allVotes.filter(isVoteActive) : allVotes;

  if (votesToProcess.length === 0) {
    return [];
  }

  const voteArgs = {
    votes: votesToProcess.map((v) => ({
      id: v.id,
      snapshotBlock: v.snapshotBlock,
    })),
    address: votingContract.address,
    client,
  };

  const [executeEvents, startEvents] = await Promise.all([
    !onlyActive
      ? getEventsExecuteVote(voteArgs)
      : Promise.resolve({} as Record<string, EventExecuteVote | null>),
    getEventsStartVote(voteArgs),
  ]);

  return votesToProcess
    .map((v) => ({
      ...v,
      executeEvent: executeEvents[v.id.toString()] || null,
      startEvent: startEvents[v.id.toString()],
    }))
    .filter((vote): vote is VoteResult => !!vote);
};
