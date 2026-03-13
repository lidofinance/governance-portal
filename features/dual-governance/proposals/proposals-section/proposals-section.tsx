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
import { ProposalFlowBanner } from '../proposal-flow-banner';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useEffect, useState } from 'react';
import { useIsEmergencyGovernanceActive } from '../../hooks/use-is-emergency-governance-active';

const MAX_SCREEN_WIDTH_PROPOSAL_FLOW = 1270;

export const ProposalsSection = () => {
  const router = useRouter();
  const { isEmergencyModeActive } = useDualGovernanceStateContext();
  const { isEmergencyGovernanceActive } = useIsEmergencyGovernanceActive();
  const [showBanner, setShowBanner] = useState(true);

  const proposalId = Array.isArray(router.query.proposalId)
    ? router.query.proposalId[0]
    : router.query.proposalId;

  useEffect(() => {
    const handleResize = () => {
      setShowBanner(window.innerWidth >= MAX_SCREEN_WIDTH_PROPOSAL_FLOW);
    };

    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ProposalsWrapper>
      <FlexWrapper $alignItems="center" $justifyContent="space-between">
        <ProposalsDisclaimerWrapper>
          <FlexWrapper $flexDirection="column" $alignItems="flex-start">
            <ProposalsTitle>Proposals</ProposalsTitle>

            <ProposalsDisclaimer>
              <b>Disclaimer:</b> Description provided by the proposal author;{' '}
              <br />
              may include items not under Dual Governance
            </ProposalsDisclaimer>
          </FlexWrapper>
          <SearchInput />
        </ProposalsDisclaimerWrapper>
      </FlexWrapper>
      {!isEmergencyModeActive && !isEmergencyGovernanceActive && showBanner && (
        <ProposalFlowBanner />
      )}
      {proposalId ? <ProposalSearchItem id={proposalId} /> : <ProposalsList />}
    </ProposalsWrapper>
  );
};
