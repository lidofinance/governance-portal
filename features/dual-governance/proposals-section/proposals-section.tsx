import { ProposalsTitle, ProposalsWrapper } from './style';
import { ProposalsList } from './proposals/proposals-list';

export const ProposalsSection = () => {
  return (
    <ProposalsWrapper>
      <ProposalsTitle>Active proposals</ProposalsTitle>
      <ProposalsList />
    </ProposalsWrapper>
  );
};
