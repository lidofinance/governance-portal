import { Link } from '@lidofinance/lido-ui';
import { PROPOSALS_PATH } from 'constants/urls';
import { InlineLoaderStyled, ProposalSearchItemWrapper } from './style';
import { ProposalsListItem } from './proposals-list-item';
import { useProposalDetails } from '../../hooks/use-proposal-details';

type Props = {
  proposalId: number;
};
export const ProposalSearchItem = ({ proposalId }: Props) => {
  const { data: proposalDetails, isLoading: isProposalDetailsLoading } =
    useProposalDetails(proposalId);

  if (isProposalDetailsLoading && !proposalId) {
    return <InlineLoaderStyled />;
  }
  if (!proposalDetails) {
    return (
      <ProposalSearchItemWrapper>
        <h1>No proposal found</h1>
      </ProposalSearchItemWrapper>
    );
  }

  if (proposalDetails) {
    return (
      <ProposalSearchItemWrapper>
        <Link
          href={`${PROPOSALS_PATH}/${proposalId}`}
          target="_self"
          key={proposalId}
        >
          <ProposalsListItem proposalId={proposalId} />
        </Link>
      </ProposalSearchItemWrapper>
    );
  }

  return null;
};
