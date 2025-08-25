import dayjs from 'dayjs';
import { useMemo } from 'react';

type Props = {
  date: number;
  format: string;
};

export const FormattedDate = ({ date, format }: Props) => {
  const formatted = useMemo(() => dayjs(date).format(format), [date, format]);

  return <>{formatted}</>;
};
