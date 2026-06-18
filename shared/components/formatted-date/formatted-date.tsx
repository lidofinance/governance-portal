import dayjs from 'dayjs';
import { useMemo } from 'react';

type Props = {
  date: number;
  format: string;
  withTimezone?: boolean;
};

const getTimezoneAbbr = (timestamp: number): string | undefined => {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
      .formatToParts(timestamp)
      .find((part) => part.type === 'timeZoneName')?.value;
  } catch {
    return undefined;
  }
};

export const FormattedDate = ({ date, format, withTimezone }: Props) => {
  const formatted = useMemo(() => {
    // If timestamp is in seconds (10 digits), convert to milliseconds
    const timestamp = date < 10000000000 ? date * 1000 : date;
    const formattedDate = dayjs(timestamp).format(format);

    if (!withTimezone) {
      return formattedDate;
    }

    const timezoneAbbr = getTimezoneAbbr(timestamp);
    return timezoneAbbr ? `${formattedDate} ${timezoneAbbr}` : formattedDate;
  }, [date, format, withTimezone]);

  return <>{formatted}</>;
};
