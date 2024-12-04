import { ProposalInfo } from 'features/dual-governance/proposals/proposal-info';

// TODO: it seems to be redundant so far, consider removing it or keeping for the future adjustments
export const ProposalPage = ({ id }: { id: number }) => {
  return <ProposalInfo id={id} />;
};
