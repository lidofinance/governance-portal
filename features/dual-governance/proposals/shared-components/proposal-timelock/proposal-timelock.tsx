import { Text } from '@lidofinance/lido-ui';
import { ProposalStatus } from 'features/dual-governance/proposals/types';
import { useProposalTimelock } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useCountdown } from 'shared/hooks/use-countdown';
import { TimeLockWrapper } from 'features/dual-governance/proposals/shared-components/proposal-timelock/style';

type Props = {
  proposalStatus: ProposalStatus;
  submittedAt: number;
  scheduledAt: number;
};

type TimelockInfoProps = {
  proposalStatus: ProposalStatus;
  timeFormatted: string;
  isCountdownFinished: boolean;
};

// TODO: add link
const emergencyCommitteeLinkText = (
  <span>
    Only <a href="#">Emergency Committee</a> can stop the execution
  </span>
);

const getTimelockInfo = ({
  proposalStatus,
  timeFormatted,
  isCountdownFinished,
}: TimelockInfoProps) => {
  switch (proposalStatus) {
    case ProposalStatus.Submitted:
      if (isCountdownFinished) {
        return null;
      }
      return (
        <Text>
          Veto possible for <b>{timeFormatted}</b>
        </Text>
      );
    case ProposalStatus.Scheduled:
      if (isCountdownFinished) {
        return <Text>{emergencyCommitteeLinkText}</Text>;
      }
      return (
        <Text>
          {emergencyCommitteeLinkText} for <b>{timeFormatted}</b>
        </Text>
      );
    default:
      return null;
  }
};

export const ProposalTimelock = ({
  proposalStatus,
  submittedAt,
  scheduledAt,
}: Props) => {
  const proposalTimelock = useProposalTimelock({
    proposalStatus,
    submittedAt,
    scheduledAt,
  });

  const { timeFormatted, isFinished: isCountdownFinished } = useCountdown(
    proposalTimelock?.targetTime ?? 0,
  );

  if (!proposalStatus) {
    return null;
  }

  const timelockInfo = getTimelockInfo({
    proposalStatus,
    timeFormatted,
    isCountdownFinished,
  });

  if (!timelockInfo) return null;

  return (
    <>
      <TimeLockWrapper>{timelockInfo}</TimeLockWrapper>
    </>
  );
};
