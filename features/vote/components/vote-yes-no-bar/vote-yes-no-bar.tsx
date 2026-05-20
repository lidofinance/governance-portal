import { Text } from '@lidofinance/lido-ui';
import { formatVoteAmount } from '@vote/utils/format-vote-amount';
import {
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
  VoteYeaNayText,
} from './style';

type Props = {
  yeaPct: number;
  nayPct: number;
  yeaNum: number;
  nayNum: number;
  yeaPctOfTotalSupply: React.ReactNode;
  nayPctOfTotalSupply: React.ReactNode;
  showOnForeground?: boolean;
  showNumber?: boolean;
};

export const VoteYesNoBar = ({
  yeaPct,
  nayPct,
  yeaNum,
  nayNum,
  yeaPctOfTotalSupply,
  nayPctOfTotalSupply,
  showOnForeground,
  showNumber,
}: Props) => {
  const yeaInfo = showNumber ? (
    <span>
      <VoteYeaNayText $variant="success">Yes</VoteYeaNayText>{' '}
      {formatVoteAmount(yeaNum)} ({yeaPctOfTotalSupply}%)
    </span>
  ) : (
    <span>
      <VoteYeaNayText $variant="success">Yes</VoteYeaNayText>{' '}
      {yeaPctOfTotalSupply}%
    </span>
  );

  const nayInfo = showNumber ? (
    <span>
      {formatVoteAmount(nayNum)} ({nayPctOfTotalSupply}%){' '}
      <VoteYeaNayText $variant="error">No</VoteYeaNayText>
    </span>
  ) : (
    <span>
      {nayPctOfTotalSupply}%{' '}
      <VoteYeaNayText $variant="error">No</VoteYeaNayText>
    </span>
  );

  return (
    <>
      <VotesTitleWrap>
        <Text size="xxs">
          <Text as="span" size="xxs" data-testid="votesYes">
            <span>{yeaInfo}</span>
          </Text>
        </Text>
        <Text size="xxs">
          <Text data-testid="votesNo" as="span" size="xxs">
            <span>{nayInfo}</span>
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap
        data-testid="votesYesNoBar"
        showOnForeground={showOnForeground}
      >
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
        <VotesBarNay style={{ width: `${nayPct}%` }} />
      </VotesBarWrap>
    </>
  );
};
