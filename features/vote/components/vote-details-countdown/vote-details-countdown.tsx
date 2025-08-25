import { useCountdown } from 'shared/hooks/use-countdown';

type Props = {
  voteTime: number;
  isEndedBeforeTime: boolean;
  children?: (diff: string) => React.ReactNode;
};

export const VoteDetailsCountdown = ({
  voteTime,
  isEndedBeforeTime,
  children,
}: Props) => {
  const timeDelta = useCountdown(voteTime);

  if (timeDelta.isFinished || isEndedBeforeTime) {
    return null;
  }

  return (
    <>
      {children ? children(timeDelta.timeFormatted) : timeDelta.timeFormatted}
    </>
  );
};
