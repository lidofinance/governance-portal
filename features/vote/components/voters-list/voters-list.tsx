import { useMemo, useState } from 'react';

import { Wrap, ListRow, ListRowCell, ShowMoreBtn } from './style';

import { Text, useBreakpoint } from '@lidofinance/lido-ui';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { VoterItem } from './voter-item';
import { useEnsNames } from 'shared/hooks/use-ens-names';
import { Address } from 'viem';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { ONE_LDO } from 'features/vote/constants';

const INITIAL_PAGE_SIZE = 5;

export const VotersList = () => {
  const { vote, voteEvents } = useVoteContext();
  const { data: tokenData } = useGovernanceToken();
  const isMobile = useBreakpoint('md');

  const votersAddressesForEns = useMemo(() => {
    // Load only for addresses with >= 1 LDO to avoid spam RPC calls
    const result = new Set<Address>();
    voteEvents.forEach(({ voter, delegatedVotes, stake }) => {
      if (stake >= ONE_LDO) {
        result.add(voter);
      }
      delegatedVotes?.forEach(
        ({ voter: delegatedVoter, stake: delegatedStake }) => {
          if (delegatedStake >= ONE_LDO) {
            result.add(delegatedVoter);
          }
        },
      );
    });
    return Array.from(result);
  }, [voteEvents]);

  const votersCount = useMemo(() => {
    return new Set(voteEvents.map((event) => event.voter)).size;
  }, [voteEvents]);

  const { data: ensMap } = useEnsNames(votersAddressesForEns, vote.id);

  const [limit, setLimit] = useState(INITIAL_PAGE_SIZE);

  if (voteEvents.length === 0) {
    return null;
  }

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
