const formatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
});

export const formatVoteAmount = (value: number) => formatter.format(value);
