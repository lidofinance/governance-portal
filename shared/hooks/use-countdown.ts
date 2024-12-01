import { useEffect, useState } from 'react';

type UseCountdownReturn = {
  timeFormatted: string;
  timeRemaining: number;
  isFinished: boolean;
};

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const calculateTimeRemaining = (targetTimestamp: number): number => {
  if (!targetTimestamp) return 0;
  const now = Date.now();
  const target = targetTimestamp * 1000;
  return Math.max(0, target - now);
};

export const useCountdown = (targetTimestamp: number): UseCountdownReturn => {
  const [timeRemaining, setTimeRemaining] = useState<number>(() =>
    calculateTimeRemaining(targetTimestamp),
  );

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining(targetTimestamp));

    const interval = setInterval(() => {
      setTimeRemaining(() => {
        const newTimeRemaining = calculateTimeRemaining(targetTimestamp);

        if (newTimeRemaining === 0) {
          clearInterval(interval);
        }

        return newTimeRemaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const isFinished = timeRemaining === 0;
  const formattedTime = isFinished ? '00:00:00' : formatTime(timeRemaining);

  return {
    timeFormatted: formattedTime,
    timeRemaining,
    isFinished,
  };
};
