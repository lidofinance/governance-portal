export const getDateFromTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  };

  return date.toLocaleDateString('en-US', options);
};
