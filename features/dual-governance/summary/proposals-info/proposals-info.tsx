import { Text } from 'shared/components/text';
import { ProposalsInfoStyled } from './style';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';
import { VisibleGovernanceState } from 'features/dual-governance/types';
import { useProposalTimelock } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useDualGovernanceState } from 'features/dual-governance/hooks';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';

const getTimelockInfo = ({
  visibleGovernanceState,
  timestamp,
}: {
  visibleGovernanceState?: VisibleGovernanceState;
  timestamp?: number;
}) => {
  if (!visibleGovernanceState || !timestamp) {
    return null;
  }

  const dateObj = getDateFromTimestamp({ timestamp });

  const dateString = (
    <span>
      <b>{dateObj.date}</b> {dateObj.tz}
    </span>
  );

  const hasPassed = dateObj.hasPassed;

  if (hasPassed) {
    return null;
  }

  switch (visibleGovernanceState) {
    case VisibleGovernanceState.Normal:
    case VisibleGovernanceState.Warning:
      return (
        <>
          <Text color="secondary">Veto possible until</Text>
          <Text>{dateString}</Text>
        </>
      );
    case VisibleGovernanceState.BlockedVetoSignalling:
      return (
        <>
          <Text color="secondary">Executable if:</Text>
          <Text>
            stETH veto support: <b>{'<1%'}</b>
          </Text>
        </>
      );
    case VisibleGovernanceState.BlockedRageQuit:
      return (
        <>
          <Text color="secondary">Executable if:</Text>
          <Text>
            RageQuit: <b>{'100%'}</b>
          </Text>
          <Text>
            stETH veto support: <b>{'<1%'}</b>
          </Text>
        </>
      );
    case VisibleGovernanceState.BlockedDeactivation:
      return (
        <>
          <Text color="secondary">Executable on</Text>
          <Text>{dateString}</Text>
        </>
      );
    case VisibleGovernanceState.Cooldown:
      return (
        <>
          <Text color="secondary">Executable until</Text>
          <Text>{dateString}</Text>
        </>
      );
  }
};

export const ProposalsInfo = () => {
  const { activeProposals, isLoading } = useDualGovernanceProposalsContext();
  const { data: stateData } = useDualGovernanceState({
    vetoSignallingAddress: undefined,
  });

  const firstProposal = activeProposals.sort((a, b) => a.id - b.id)[0];

  const timelockData = useProposalTimelock({
    proposalStatus: firstProposal?.proposalDetails.status || null,
    submittedAt: firstProposal?.proposalDetails.submittedAt || 0,
    scheduledAt: firstProposal?.proposalDetails.scheduledAt || 0,
  });

  // TODO: add a loading state
  if (isLoading || !activeProposals) {
    return null;
  }

  return (
    <ProposalsInfoStyled>
      <div>
        <Text color="secondary">Active Proposals</Text>
        <Text>{activeProposals.length}</Text>
      </div>
      <div>
        {getTimelockInfo({
          visibleGovernanceState: stateData?.visibleState,
          timestamp: timelockData?.targetTime,
        })}
      </div>
    </ProposalsInfoStyled>
  );
};
