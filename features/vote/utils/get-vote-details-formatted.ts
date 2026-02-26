import { formatNumber } from 'shared/blockchain/utils';
import { formatFloatPct } from './format-float-pct';
import { formatEther } from 'viem';

export const getVoteDetailsFormatted = (vote: any) => {
  const totalSupply = Number(formatEther(vote.votingPower || 0n));
  const totalSupplyFormatted = formatNumber({ value: totalSupply });
  const nayNum = Number(formatEther(vote.nay));
  const yeaNum = Number(formatEther(vote.yea));
  const total = nayNum + yeaNum;

  const nayPct = total > 0 ? formatFloatPct(nayNum / total) : 0;
  const yeaPct = total > 0 ? formatFloatPct(yeaNum / total) : 0;

  const nayPctOfTotalSupply = nayNum / totalSupply;
  const yeaPctOfTotalSupply = yeaNum / totalSupply;

  const nayPctOfTotalSupplyFormatted = totalSupply
    ? formatFloatPct(nayPctOfTotalSupply, { floor: true }).toFixed(2)
    : 0;
  const yeaPctOfTotalSupplyFormatted = totalSupply
    ? formatFloatPct(yeaPctOfTotalSupply, { floor: true }).toFixed(2)
    : 0;

  const startDate = Number(vote.startDate);

  return {
    totalSupply,
    totalSupplyFormatted,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupply,
    yeaPctOfTotalSupply,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    startDate,
  };
};
