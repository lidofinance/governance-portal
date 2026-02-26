import { createContext, FC, useContext } from 'react';
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

type Value = {
  vote: Vote;
  canExecute: boolean;
  eventStart: EventStartVote | undefined;
  eventExecute: EventExecuteVote | undefined;
  voteEvents: VoteEvent[];
  voterState: VoterState | undefined;
  voterDaoTokenBalance: bigint | undefined;
  voteTime: number;
  objectionPhaseTime: number;
  refetchVote: ReturnType<typeof useVote>['refetch'];
  refetchVoteEvents: ReturnType<typeof useCastVoteEvents>['refetch'];
};

const VoteContext = createContext<Value>({
  vote: {} as Vote,
  canExecute: false,
  eventStart: undefined,
  eventExecute: undefined,
  voteEvents: [],
  voterState: undefined,
  voterDaoTokenBalance: 0n,
  refetchVote: (() => {}) as any,
  refetchVoteEvents: (() => {}) as any,
  voteTime: 0,
  objectionPhaseTime: 0,
});

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
  } = useVote(voteId, votingConfig?.voteTime);

  const { data: voteEvents, refetch: refetchVoteEvents } = useCastVoteEvents(
    voteData?.vote,
    voteData?.eventExecute?.event.blockNumber,
  );

  const { data: voterStateData } = useVoterState(
    voteData?.vote.id,
    voteData?.vote.snapshotBlock,
  );

  if (isVotingConfigLoading || isVoteDataLoading) {
    return <InlineVoteCardLoader />;
  }

  if (!voteData) {
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

  return (
    <VoteContext.Provider
      value={{
        ...voteData,
        voterState: voterStateData?.voterState,
        voterDaoTokenBalance: voterStateData?.voterDaoTokenBalance,
        voteEvents: voteEvents ?? [],
        voteTime: votingConfig?.voteTime ?? 0,
        objectionPhaseTime: votingConfig?.objectionPhaseTime ?? 0,
        refetchVote,
        refetchVoteEvents,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};
