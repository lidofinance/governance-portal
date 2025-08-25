import { formatNumber } from 'shared/blockchain/utils';
import { Vote } from 'shared/votes/types';
import { formatFloatPct } from './format-float-pct';

export const getVoteDetailsFormatted = (vote: Vote) => {
  const totalSupply = Number(vote.votingPower);
  const totalSupplyFormatted = formatNumber({ value: totalSupply });
  const nayNum = Number(vote.nay);
  const yeaNum = Number(vote.yea);
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
