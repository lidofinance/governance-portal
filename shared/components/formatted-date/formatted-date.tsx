import dayjs from 'dayjs';
import { useMemo } from 'react';

type Props = {
  date: number;
  format: string;
};

export const FormattedDate = ({ date, format }: Props) => {
  const formatted = useMemo(() => {
    // If timestamp is in seconds (10 digits), convert to milliseconds
    const timestamp = date < 10000000000 ? date * 1000 : date;
    return dayjs(timestamp).format(format);
  }, [date, format]);

  return <>{formatted}</>;
};
