import { StateInfo } from './state-info';
import { SupportInfo } from './support-info';
import { ProposalsInfo } from './proposals-info';
import styled from 'styled-components';

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
`;

export const DualGovernanceSummary = () => {
  return (
    <DualGovernanceSummaryWrapper>
      <StateInfo />
      <SupportInfo />
      <ProposalsInfo />
    </DualGovernanceSummaryWrapper>
  );
};
