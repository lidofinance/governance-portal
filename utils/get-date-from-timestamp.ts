export const getDateFromTimestamp = ({
  timestamp,
  showYear,
}: {
  timestamp: number;
  showYear?: boolean;
}): { date: string; tz: string; hasPassed: boolean } => {
  const targetDate = new Date(timestamp * 1000);
  const now = new Date();

  const hasPassed = now.getTime() > targetDate.getTime();

  const options: Intl.DateTimeFormatOptions = {
    year: showYear ? 'numeric' : undefined,
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  const tz = new Intl.DateTimeFormat('en-US', {
    timeZoneName: 'short',
  })
    .format(targetDate)
    .split(' ')[1];

  return {
    date: targetDate.toLocaleDateString('en-US', options),
    tz,
    hasPassed,
  };
};
