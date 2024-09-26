import { ProposalsTitle, ProposalsWrapper } from './styles';
import { ProposalsList } from './proposals/proposals-list';

export const ProposalsSection = () => {
  return (
    <ProposalsWrapper>
      <ProposalsTitle>Active proposals</ProposalsTitle>
      <ProposalsList />
    </ProposalsWrapper>
  );
};
