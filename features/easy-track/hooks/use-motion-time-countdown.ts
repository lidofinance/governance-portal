import { useState, useCallback, useEffect } from 'react';
import { Motion, RawMotionSubgraph } from '../types';

export type MotionTimeData = {
  isPassed: boolean;
  diff: number;
  diffFormatted: string;
};

const DEFAULT_TIME_DATA: MotionTimeData = {
  isPassed: false,
  diff: 0,
  diffFormatted: '0m',
};

export const useMotionTimeCountdown = (
  motion: Motion | RawMotionSubgraph | null,
) => {
  const getTimeLeft = useCallback((): MotionTimeData => {
    if (!motion) {
      return DEFAULT_TIME_DATA;
    }

    const now = Date.now() / 1000;
    const diff = Number(motion.startDate) + Number(motion.duration) - now;
    return {
      isPassed: diff < 0,
      diff: diff,
      diffFormatted: (() => {
        const secs = Math.abs(diff);
        const totalMinutes = Math.max(1, Math.floor(secs / 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        return parts.length === 0 ? `1m` : parts.join(' ');
      })(),
    };
  }, [motion]);

  const [timeData, setTimeLeftState] = useState(getTimeLeft());
  const { isPassed, diffFormatted } = timeData;

  const setTimeLeft = useCallback(
    (nextTimeLeft: MotionTimeData) => {
      if (diffFormatted !== nextTimeLeft.diffFormatted) {
        setTimeLeftState(nextTimeLeft);
      }
    },
    [diffFormatted],
  );

  useEffect(() => {
    if (!motion || isPassed) return;
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 10000);
    return () => {
      clearInterval(interval);
    };
  }, [motion, isPassed, getTimeLeft, setTimeLeft]);

  return timeData;
};
