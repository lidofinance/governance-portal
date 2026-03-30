import { createContext, FC, useCallback, useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { useVote } from '../hooks/use-vote';
import {
  EventExecuteVote,
  Vote,
  VoteEvent,
  VoterState,
} from 'shared/votes/types';
import { EventStartVote } from 'shared/votes/utils/get-event-start-vote';
import { useVoterState } from '../hooks/use-voter-state';
import { useCastVoteEvents } from '../hooks/use-cast-vote-events';
import { useVotingConfig } from '../hooks/use-voting-config';
import { InlineVoteCardLoader } from '../styles';
import { Box, Container } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { useVoteDelegators } from '../hooks/use-vote-delegators';
import { EligibleDelegator, VoterInfo } from '../types';
import { ProposalStatus } from '@dg/proposals/types';
import { useVoteDualGovernanceStatus } from '../hooks/use-vote-dual-governance-status';
import { useVotePassedCallback } from '../hooks/use-vote-passed-callback';

type Value = {
  vote: Vote;
  canExecute: boolean;
  eventStart: EventStartVote | undefined;
  eventExecute: EventExecuteVote | null | undefined;
  voteEvents: VoteEvent[];
  voterState: VoterState | undefined;
  voterDaoTokenBalance: bigint | undefined;
  voteTime: number;
  objectionPhaseTime: number;
  eligibleDelegators: EligibleDelegator[];
  eligibleDelegatedVotingPower: bigint;
  totalDelegatedVotingPower: bigint;
  delegatorsVotedThemselves: VoterInfo[];
  dgProposal:
    | {
        proposalId: number;
        proposalStatus: ProposalStatus;
      }
    | null
    | undefined;
  isLoading: boolean;
  refetchers: {
    refetchVote: ReturnType<typeof useVote>['refetch'];
    refetchVoteEvents: ReturnType<typeof useCastVoteEvents>['refetch'];
    refetchVoterState: ReturnType<typeof useVoterState>['refetch'];
    refetchDelegatorsData: ReturnType<typeof useVoteDelegators>['refetch'];
  };
};

const VoteContext = createContext<Value | null>(null);

export const useVoteContext = () => {
  const value = useContext(VoteContext);
  invariant(value, 'useVoteContext was used outside the VoteContext provider');
  return value;
};

type Props = {
  voteId: string;
  children?: React.ReactNode;
};

export const VoteProvider: FC<Props> = ({ voteId, children }) => {
  const { data: votingConfig, isLoading: isVotingConfigLoading } =
    useVotingConfig();

  const {
    data: voteData,
    isLoading: isVoteDataLoading,
    refetch: refetchVote,
  } = useVote(Number(voteId), votingConfig?.voteTime);

  const {
    data: voteEvents,
    isLoading: isCastVoteEventsDataLoading,
    refetch: refetchVoteEvents,
  } = useCastVoteEvents(
    voteData?.vote,
    voteData?.eventExecute?.event.blockNumber,
  );

  const {
    data: voterState,
    isLoading: isVoterStateLoading,
    refetch: refetchVoterState,
  } = useVoterState(voteData?.vote.id, voteData?.vote.snapshotBlock);

  const { data: dgProposal, isLoading: isProposalDataLoading } =
    useVoteDualGovernanceStatus({
      voteId: voteData?.vote.id,
      eventExecuteVote: voteData?.eventExecute,
    });

  const {
    data: delegatorsData,
    isLoading: isDelegatorsDataLoading,
    refetch: refetchDelegatorsData,
  } = useVoteDelegators(voteData?.vote.id);

  const refetchers = useMemo(
    () => ({
      refetchVote,
      refetchVoteEvents,
      refetchVoterState,
      refetchDelegatorsData,
    }),
    [refetchVote, refetchVoteEvents, refetchVoterState, refetchDelegatorsData],
  );

  const isLoading =
    isVotingConfigLoading ||
    isVoteDataLoading ||
    isCastVoteEventsDataLoading ||
    isVoterStateLoading ||
    isDelegatorsDataLoading ||
    isProposalDataLoading;

  const value = useMemo(() => {
    if (!voteData?.vote) {
      return null;
    }

    return {
      vote: voteData.vote,
      canExecute: voteData.canExecute,
      eventStart: voteData.eventStart,
      eventExecute: voteData.eventExecute,
      voterState: voterState?.voterState,
      voterDaoTokenBalance: voterState?.voterDaoTokenBalance,
      voteEvents: voteEvents ?? [],
      voteTime: votingConfig?.voteTime ?? 0,
      objectionPhaseTime: votingConfig?.objectionPhaseTime ?? 0,
      eligibleDelegators: delegatorsData?.eligibleDelegatedVoters ?? [],
      eligibleDelegatedVotingPower:
        delegatorsData?.eligibleDelegatedVotingPower ?? 0n,
      totalDelegatedVotingPower:
        delegatorsData?.totalDelegatedVotingPower ?? 0n,
      delegatorsVotedThemselves:
        delegatorsData?.delegatedVotersVotedThemselves ?? [],
      dgProposal,
      isLoading,
      refetchers,
    };
  }, [
    delegatorsData?.delegatedVotersVotedThemselves,
    delegatorsData?.eligibleDelegatedVoters,
    delegatorsData?.eligibleDelegatedVotingPower,
    delegatorsData?.totalDelegatedVotingPower,
    dgProposal,
    isLoading,
    refetchers,
    voteData,
    voteEvents,
    voterState?.voterDaoTokenBalance,
    voterState?.voterState,
    votingConfig?.objectionPhaseTime,
    votingConfig?.voteTime,
  ]);

  const handlePass = useCallback(() => {
    setTimeout(() => refetchVote(), 1200);
  }, [refetchVote]);

  useVotePassedCallback({
    startDate: Number(voteData?.vote.startDate ?? 0),
    voteTime: votingConfig?.voteTime ?? 0,
    onPass: handlePass,
  });

  useVotePassedCallback({
    startDate: Number(voteData?.vote.startDate ?? 0),
    voteTime:
      votingConfig?.voteTime != null && votingConfig?.objectionPhaseTime != null
        ? votingConfig.voteTime - votingConfig.objectionPhaseTime
        : undefined,
    onPass: handlePass,
  });

  if (isVotingConfigLoading || isVoteDataLoading) {
    return <InlineVoteCardLoader />;
  }

  if (!value) {
    return (
      <Container as="main" size="tight" key={voteId}>
        <Box textAlign="center">
          <Text size={18} strong>
            No results found for vote #{voteId}
          </Text>
          <Text size={14} color="secondary">
            Sorry, we weren&#39;t able to find any votes for your search. Try
            another search.
          </Text>
        </Box>
      </Container>
    );
  }

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
};
