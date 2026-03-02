import { Text } from 'shared/components/text';
import { InlineLoaderStyled, ProposalsInfoStyled } from './style';
import { useActiveProposals } from '../../hooks/use-active-proposals';
import { useProposalsCount } from '../../hooks/use-proposals-count';
import { useVotes } from 'shared/votes/hooks/use-votes';
import { useMemo } from 'react';

const VOTES_LIMIT = 15;

export const ProposalsInfo = () => {
  const { data: proposalsCount } = useProposalsCount();
  const { data: votesData, isFetching: isVotesFetching } = useVotes({
    limit: VOTES_LIMIT,
    shouldGetActive: true,
  });
  const { data: activeProposals, isLoading: isActiveProposalsFetching } =
    useActiveProposals({
      proposalsCount,
    });

  const totalActiveCount = useMemo(() => {
    const votesCount = votesData?.votes?.length || 0;
    const proposalsCount = activeProposals?.length || 0;
    return votesCount + proposalsCount;
  }, [votesData?.votes?.length, activeProposals?.length]);

  const isLoading = isVotesFetching || isActiveProposalsFetching;

  return (
    <ProposalsInfoStyled>
      <>
        <Text color="secondary">Active Proposals</Text>
        {isLoading ? <InlineLoaderStyled /> : <Text>{totalActiveCount}</Text>}
      </>
    </ProposalsInfoStyled>
  );
};
