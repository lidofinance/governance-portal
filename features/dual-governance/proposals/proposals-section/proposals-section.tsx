import {
  ProposalsTitle,
  ProposalsWrapper,
  SeeAll,
} from 'features/dual-governance/proposals/proposals-section/style';
import { ProposalsList } from 'features/dual-governance/proposals/proposals-section/proposals/proposals-list';
import { usePrefixedPush } from 'shared/hooks/use-prefixed-history';
import { PROPOSALS_PATH } from 'constants/urls';

export const ProposalsSection = () => {
  const push = usePrefixedPush();

  const handleClick = () => push(PROPOSALS_PATH);

  return (
    <ProposalsWrapper>
      <ProposalsTitle>
        Active proposals <SeeAll onClick={handleClick}>See all</SeeAll>
      </ProposalsTitle>
      <ProposalsList />
    </ProposalsWrapper>
  );
};
