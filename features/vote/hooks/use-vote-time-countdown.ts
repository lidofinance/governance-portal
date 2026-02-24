import { useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

type VoteTimeData = {
  isPassed: boolean;
  diff: number;
  diffFormatted: string;
};

export const useVoteTimeCountdown = (startDate: number, duration: number) => {
  const getTimeLeft = useCallback((): VoteTimeData => {
    const now = Date.now() / 1000;
    const diff = startDate + duration - now;

    const durationObj = dayjs.duration(Math.abs(diff), 'seconds');
    const hours = Math.floor(durationObj.asHours()).toString().padStart(2, '0');
    const minutes = durationObj.minutes().toString().padStart(2, '0');
    const seconds = durationObj.seconds().toString().padStart(2, '0');

    return {
      isPassed: diff < 0,
      diff: diff,
      diffFormatted: `${hours}: ${minutes} : ${seconds}`,
    };
  }, [startDate, duration]);

  const [timeData, setTimeLeftState] = useState(getTimeLeft());
  const { isPassed, diffFormatted } = timeData;

  const setTimeLeft = useCallback(
    (nextTimeLeft: VoteTimeData) => {
      if (diffFormatted !== nextTimeLeft.diffFormatted) {
        setTimeLeftState(nextTimeLeft);
      }
    },
    [diffFormatted],
  );

  useEffect(() => {
    if (isPassed) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 250);
    return () => {
      clearInterval(interval);
    };
  }, [isPassed, getTimeLeft, setTimeLeft]);

  return timeData;
};
