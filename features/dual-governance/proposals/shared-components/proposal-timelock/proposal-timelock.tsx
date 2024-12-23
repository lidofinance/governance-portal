import { Text } from '@lidofinance/lido-ui';
import { ProposalStatus } from 'features/dual-governance/proposals/types';
import { useProposalTimelock } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useCountdown } from 'shared/hooks/use-countdown';

type Props = {
  proposalStatus: ProposalStatus;
  submittedAt: number;
  scheduledAt: number;
  hideOnCountdownFinish?: boolean;
};

type TimelockInfoProps = {
  proposalStatus: ProposalStatus;
  timeFormatted: string;
  isCountdownFinished: boolean;
};

// TODO: add link
const emergencyCommitteeLinkText = (
  <span>
    Only <b>Emergency Committee</b> can stop the execution
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
  hideOnCountdownFinish,
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

  if (hideOnCountdownFinish && isCountdownFinished) {
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
      <span>{timelockInfo}</span>
    </>
  );
};
