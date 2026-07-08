import { Text } from 'shared/components/text';
import { formatVoteAmount } from '@vote/utils/format-vote-amount';
import {
  SupplyText,
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
      {formatVoteAmount(yeaNum)} (<SupplyText>{yeaPctOfTotalSupply}</SupplyText>
      %)
    </span>
  ) : (
    <span>
      <VoteYeaNayText $variant="success">Yes</VoteYeaNayText>{' '}
      <SupplyText>{yeaPctOfTotalSupply}%</SupplyText>
    </span>
  );

  const nayInfo = showNumber ? (
    <span>
      {formatVoteAmount(nayNum)} (<SupplyText>{nayPctOfTotalSupply}</SupplyText>
      %) <VoteYeaNayText $variant="error">No</VoteYeaNayText>
    </span>
  ) : (
    <span>
      <SupplyText>{nayPctOfTotalSupply}% </SupplyText>
      <VoteYeaNayText $variant="error">No</VoteYeaNayText>
    </span>
  );

  return (
    <>
      <VotesTitleWrap>
        <Text size={14}>
          <Text as="span" size={14} data-testid="votesYes">
            <span>{yeaInfo}</span>
          </Text>
        </Text>
        <Text size={14}>
          <Text data-testid="votesNo" as="span" size={14}>
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
