import { ProposalsList } from 'features/dual-governance/proposals/proposals-list';
import { FlexWrapper } from 'shared/styled-components';
import {
  ProposalsDisclaimer,
  ProposalsTitle,
  ProposalsWrapper,
  ProposalsDisclaimerWrapper,
} from 'features/dual-governance/proposals/proposals-section/style';
import { SearchInput } from './search-input';
import { useRouter } from 'next/router';
import { ProposalSearchItem } from 'features/dual-governance/proposals/proposals-list/proposal-search-item';

export const ProposalsSection = () => {
  const router = useRouter();

  const proposalId = Array.isArray(router.query.proposalId)
    ? router.query.proposalId[0]
    : router.query.proposalId;

  return (
    <ProposalsWrapper>
      <FlexWrapper $alignItems="center" $justifyContent="space-between">
        <ProposalsDisclaimerWrapper>
          <FlexWrapper $flexDirection="column" $alignItems="flex-start">
            <ProposalsTitle>Proposals</ProposalsTitle>

            <ProposalsDisclaimer>
              <b>Disclaimer:</b> Description provided by the Aragon proposal
              author; <br />
              may include items not under Dual Governance
            </ProposalsDisclaimer>
          </FlexWrapper>
          <SearchInput />
        </ProposalsDisclaimerWrapper>
      </FlexWrapper>
      {proposalId ? <ProposalSearchItem id={proposalId} /> : <ProposalsList />}
    </ProposalsWrapper>
  );
};
