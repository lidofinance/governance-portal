import Link from 'next/link';
import { PROPOSALS_PATH } from 'constants/urls';

import { ProposalsColumnList } from 'features/dual-governance/proposals/proposals-column-list';

import {
  ProposalsTitle,
  ProposalsWrapper,
  SeeAll,
} from 'features/dual-governance/proposals/proposals-section/style';

export const ProposalsSection = () => {
  return (
    <ProposalsWrapper>
      <ProposalsTitle>
        Active proposals{' '}
        <SeeAll>
          <Link href={PROPOSALS_PATH}>View all Proposals</Link>
        </SeeAll>
      </ProposalsTitle>
      <ProposalsColumnList />
    </ProposalsWrapper>
  );
};
