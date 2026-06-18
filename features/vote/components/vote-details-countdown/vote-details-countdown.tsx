import { useCountdown } from 'shared/hooks/use-countdown';

type Props = {
  voteTime: number;
  isEndedBeforeTime: boolean;
};

const format = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const units = [
    { value: days, suffix: 'd' },
    { value: hours, suffix: 'h' },
    { value: minutes, suffix: 'm' },
    { value: seconds, suffix: 's' },
  ];

  const firstSignificant = units.findIndex((unit) => unit.value > 0);
  const startIndex =
    firstSignificant === -1 ? units.length - 1 : firstSignificant;

  return units
    .slice(startIndex)
    .map((unit) => `${unit.value}${unit.suffix}`)
    .join(' ');
};

export const VoteDetailsCountdown = ({
  voteTime,
  isEndedBeforeTime,
}: Props) => {
  const timeDelta = useCountdown(voteTime);

  if (timeDelta.isFinished || isEndedBeforeTime) {
    return null;
  }

  return <>{format(timeDelta.timeRemaining)}</>;
};
