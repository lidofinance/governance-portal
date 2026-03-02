import { Text } from '@lidofinance/lido-ui';
import { InfoWrap, VotingPower, Amount } from './style';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { formatBalance } from 'utils/format-balance';
import { useVoteContext } from 'features/vote/providers/vote-context';

export const VotePowerInfo = () => {
  const { data: tokenData } = useGovernanceToken();
  const { voterDaoTokenBalance, totalDelegatedVotingPower } = useVoteContext();

  return (
    <InfoWrap>
      <VotingPower>
        <Text as="span" color="secondary" size="xxs">
          My voting power
        </Text>
        <Amount data-testid="myVPAmount">
          {formatBalance(voterDaoTokenBalance ?? 0n)} {tokenData?.symbol}
        </Amount>
      </VotingPower>
      {totalDelegatedVotingPower > 0n && (
        <VotingPower>
          <Text as="span" color="secondary" size="xxs">
            Delegated voting power
          </Text>
          <Amount data-testid="delegatedVPAmount">
            {formatBalance(totalDelegatedVotingPower)} {tokenData?.symbol}
          </Amount>
        </VotingPower>
      )}
    </InfoWrap>
  );
};
