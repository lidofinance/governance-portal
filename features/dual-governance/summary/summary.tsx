import { StateInfo as StateInfoEmergencyGovernance } from './state-info-emergency-governance';

import { StateInfo } from './state-info';
import { SupportInfo } from './support-info';
import { ProposalsInfo } from './proposals-info';
import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';
import { useIsEmergencyGovernanceActive } from '../hooks/use-is-emergency-governance-active';

const DualGovernanceSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px;
  width: 40%;
  flex-shrink: 0;
  background-color: #ffffffb2;

  border-right: 1px solid var(--border-color-fog);
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;

  @media ${devicesHeaderMedia.tablet} {
    width: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-right-radius: inherit;
    border-right: none;

    border-bottom: 1px solid var(--border-color-fog);
  }
`;

export const DualGovernanceSummary = () => {
  const { isEmergencyGovernanceActive, isLoading } =
    useIsEmergencyGovernanceActive();

  return (
    <DualGovernanceSummaryWrapper>
      {isEmergencyGovernanceActive && !isLoading && (
        <StateInfoEmergencyGovernance />
      )}
      {/*{isEmergencyGovernanceActive && !isLoading && (*/}
      {/*  <SupportInfoEmergencyGovernance />*/}
      {/*)}*/}
      {!isEmergencyGovernanceActive && !isLoading && <StateInfo />}
      {!isEmergencyGovernanceActive && !isLoading && <SupportInfo />}
      <ProposalsInfo />
    </DualGovernanceSummaryWrapper>
  );
};
