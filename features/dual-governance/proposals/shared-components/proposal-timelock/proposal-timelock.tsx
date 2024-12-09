import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { ProposalStatus } from 'features/dual-governance/proposals/types';
import { useProposalTimelocks } from 'features/dual-governance/hooks/use-proposal-timelock';
import { useCountdown } from 'shared/hooks/use-countdown';
import { TimeLockWrapper } from 'features/dual-governance/proposals/shared-components/proposal-timelock/style';

type Timestamp = number;

type Props = {
  status: ProposalStatus;
  scheduledAt: Timestamp; // in seconds
  submittedAt: Timestamp; // in seconds
};

type TimelockInfoProps = {
  status: ProposalStatus;
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
  status,
  timeFormatted,
  isCountdownFinished,
}: TimelockInfoProps) => {
  switch (status) {
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
  status,
  submittedAt,
  scheduledAt,
}: Props) => {
  const { isLoading, afterSubmitDelay, afterScheduleDelay } =
    useProposalTimelocks();

  const targetTime = useMemo(() => {
    if (isLoading || !afterSubmitDelay || !afterScheduleDelay) return null;

    return status === ProposalStatus.Submitted
      ? submittedAt + afterSubmitDelay
      : scheduledAt + afterScheduleDelay;
  }, [
    status,
    submittedAt,
    scheduledAt,
    afterSubmitDelay,
    afterScheduleDelay,
    isLoading,
  ]);

  const { timeFormatted, isFinished: isCountdownFinished } = useCountdown(
    targetTime ?? 0,
  );

  if (isLoading || !targetTime) {
    return null;
  }

  const timelockInfo = getTimelockInfo({
    status,
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
