import { useMemo, useState } from 'react';

import { Wrap, ListRow, ListRowCell, ShowMoreBtn } from './style';

import { Text, useBreakpoint } from '@lidofinance/lido-ui';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { VoteEvent } from 'shared/votes/types';
import { VoterItem } from './voter-item';

type Props = {
  voteEvents: VoteEvent[];
};

const INITIAL_PAGE_SIZE = 5;

export const VotersList = ({ voteEvents }: Props) => {
  const { data: tokenData } = useGovernanceToken();
  const isMobile = useBreakpoint('md');

  // const votersAddresses = useMemo(() => {
  //   const result = new Set<string>();
  //   voteEvents.forEach(({ voter, delegatedVotes }) => {
  //     result.add(voter);
  //     delegatedVotes?.forEach(({ voter: delegatedVoter }) => {
  //       result.add(delegatedVoter);
  //     });
  //   });
  //   return Array.from(result);
  // }, [voteEvents]);

  // TODO: refactor ENS names hook for using new web3 connector
  // const { data: ensMap } = useEnsNames(votersAddresses);
  const ensMap = undefined;

  const [limit, setLimit] = useState(INITIAL_PAGE_SIZE);

  const votersCount = useMemo(() => {
    return new Set(voteEvents.map((event) => event.voter)).size;
  }, [voteEvents]);

  return (
    <Wrap>
      <ListRow>
        <ListRowCell>
          <Text size="xxs" strong>
            Voter &nbsp;
          </Text>
          <Text data-testid="votersAmount" size="xxs" color="secondary">
            {votersCount}
          </Text>
        </ListRowCell>
        <ListRowCell>
          <Text size="xxs" strong>
            Vote
          </Text>
        </ListRowCell>
        <ListRowCell>
          <Text size="xxs" strong>
            {isMobile ? `VP (${tokenData?.symbol})` : 'Voting Power'}
          </Text>
        </ListRowCell>
      </ListRow>
      {voteEvents.slice(0, limit).map((event, i) => (
        <VoterItem
          voteEvent={event}
          governanceTokenSymbol={tokenData?.symbol || ''}
          ensMap={ensMap}
          isMobile={isMobile}
          key={`${event.voter}-${i}`}
        />
      ))}
      {voteEvents.length > limit && (
        <ShowMoreBtn
          data-testid="showMoreBtn"
          onClick={() => setLimit(voteEvents.length)}
        >
          Show all
        </ShowMoreBtn>
      )}
    </Wrap>
  );
};
