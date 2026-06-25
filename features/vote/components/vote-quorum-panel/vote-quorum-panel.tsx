import { Text } from '@lidofinance/lido-ui';
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
  QuorumStatusWrap,
  QuorumStatus,
  QuorumTooltip,
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

  const isQuorumReached = vote.state.isQuorumReached;

  return (
    <>
      <QuorumRow>
        <QuorumLabel>
          Quorum: <QuorumValue>{quorumPct}%</QuorumValue>
        </QuorumLabel>
        <QuorumTooltip
          placement="bottomRight"
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
          <QuorumStatusWrap $reached={isQuorumReached}>
            <QuorumStatus $reached={isQuorumReached} data-testid="quorumStatus">
              {isQuorumReached ? 'Reached' : 'Not reached'}
            </QuorumStatus>
            <InfoIcon />
          </QuorumStatusWrap>
        </QuorumTooltip>
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
        <Text size="xxs" color="secondary" data-testid="totalYea">
          {yeaNumFormatted}
        </Text>
        <Text size="xxs" color="secondary" data-testid="totalNay">
          {nayNumFormatted}
        </Text>
      </VoteTotalsRow>
    </>
  );
};
