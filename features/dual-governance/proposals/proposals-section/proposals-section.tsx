import { ProposalsList } from 'features/dual-governance/proposals/proposals-list';

import {
  ProposalsTitle,
  ProposalsWrapper,
} from 'features/dual-governance/proposals/proposals-section/style';

export const ProposalsSection = () => {
  return (
    <ProposalsWrapper>
      <ProposalsTitle>
        Proposals
      </ProposalsTitle>
      <ProposalsList />
    </ProposalsWrapper>
  );
};
