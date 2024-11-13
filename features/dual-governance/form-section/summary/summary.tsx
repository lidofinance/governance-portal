import { StateInfo } from './state-info';
import { SummaryWrapper } from './style';
import { useDualGovernanceState } from 'features/dual-governance/hooks/use-dual-governance-state';
import { SupportInfo } from './support-info';
import { ProposalsInfo } from './proposals-info';
import { BackgroundGradient } from 'shared/components';

export const Summary = () => {
  const { data: dualGovernanceState, isLoading } = useDualGovernanceState();

  // TODO: add view state
  if (isLoading) {
    return <SummaryWrapper />;
  }

  // TODO: add view state
  if (!dualGovernanceState) {
    return <SummaryWrapper />;
  }

  return (
    <SummaryWrapper>
      {/* TODO: move BackgroundGradient up the tree after introducing context */}
      <BackgroundGradient
        state={dualGovernanceState.visibleState}
        width={1700}
        height={800}
      />
      <StateInfo state={dualGovernanceState.visibleState} />
      <SupportInfo dualGovernanceState={dualGovernanceState} />
      <ProposalsInfo />
    </SummaryWrapper>
  );
};
