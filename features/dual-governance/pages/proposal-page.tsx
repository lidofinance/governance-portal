import { ProposalFullInfo } from 'features/dual-governance/proposals/proposal-full-info';
import { VisibleGovernanceState } from '../types';
import { BackgroundGradient } from 'shared/components';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';

export const ProposalPage = ({ id }: { id: number }) => {
  const { visibleState } = useDualGovernanceStateContext();

  return (
    <>
      {visibleState !== VisibleGovernanceState.Loading && (
        <BackgroundGradient state={visibleState} width={1700} height={800} />
      )}
      <ProposalFullInfo id={id} />
    </>
  );
};
