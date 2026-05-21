import { Text, Tooltip } from '@lidofinance/lido-ui';
import { formatEther } from 'viem';
import { Vote } from 'shared/votes/types';
import { InfoIcon } from 'shared/components/icons';
import { getVoteDetailsFormatted } from '@vote/utils/get-vote-details-formatted';
import { formatVoteAmount } from '@vote/utils/format-vote-amount';
import { formatFloatPct } from '@vote/utils/format-float-pct';
import { VoteYesNoBar } from '../vote-yes-no-bar';
import {
  QuorumRow,
  QuorumLabel,
  QuorumValue,
  QuorumReachedWrap,
  QuorumReached,
  QuorumTooltipBody,
  QuorumTooltipRow,
  VoteTotalsRow,
} from './style';

type Props = {
  vote: Vote;
};

export const VoteQuorumPanel = ({ vote }: Props) => {
  const {
    nayPct,
    yeaPct,
    yeaNum,
    nayNum,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
  } = getVoteDetailsFormatted(vote);

  const quorumPct = formatFloatPct(Number(formatEther(vote.minAcceptQuorum)));
  const yeaNumFormatted = formatVoteAmount(yeaNum);
  const nayNumFormatted = formatVoteAmount(nayNum);

  const totalSupply = Number(formatEther(vote.votingPower));
  const quorumAmount = totalSupply * Number(formatEther(vote.minAcceptQuorum));

  return (
    <>
      <QuorumRow>
        <QuorumLabel>
          Quorum: <QuorumValue>{quorumPct}%</QuorumValue>
        </QuorumLabel>
        {vote.state.isQuorumReached && (
          <Tooltip
            title={
              <QuorumTooltipBody>
                To reach quorum, more than {quorumPct}% of the total LDO supply
                must vote for one option.
                <QuorumTooltipRow>
                  <span>Total Supply</span>
                  <span>{formatVoteAmount(totalSupply)} LDO</span>
                </QuorumTooltipRow>
                <QuorumTooltipRow>
                  <span>Quorum</span>
                  <span>{formatVoteAmount(quorumAmount)} LDO</span>
                </QuorumTooltipRow>
              </QuorumTooltipBody>
            }
          >
            <QuorumReachedWrap>
              <QuorumReached>Reached</QuorumReached>
              <InfoIcon />
            </QuorumReachedWrap>
          </Tooltip>
        )}
      </QuorumRow>
      <VoteYesNoBar
        yeaPct={yeaPct}
        nayPct={nayPct}
        yeaNum={yeaNum}
        nayNum={nayNum}
        yeaPctOfTotalSupply={yeaPctOfTotalSupplyFormatted}
        nayPctOfTotalSupply={nayPctOfTotalSupplyFormatted}
        showOnForeground
      />
      <VoteTotalsRow>
        <Text size="xxs" color="secondary">
          {yeaNumFormatted}
        </Text>
        <Text size="xxs" color="secondary">
          {nayNumFormatted}
        </Text>
      </VoteTotalsRow>
    </>
  );
};
