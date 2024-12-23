import { ProposalFullInfo } from 'features/dual-governance/proposals/proposal-full-info';

// TODO: it seems to be redundant so far, consider removing it or keeping for the future adjustments
export const ProposalPage = ({ id }: { id: number }) => {
  return <ProposalFullInfo id={id} />;
};
