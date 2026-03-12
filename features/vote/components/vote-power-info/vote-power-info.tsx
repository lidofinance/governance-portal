import { Text } from '@lidofinance/lido-ui';
import { InfoWrap, VotingPower, Amount } from './style';
import { formatBalance } from 'utils/format-balance';
import { useVoteContext } from 'features/vote/providers/vote-context';
import { KnownToken } from 'shared/blockchain/tokens';

export const VotePowerInfo = () => {
  const { voterDaoTokenBalance, totalDelegatedVotingPower } = useVoteContext();

  return (
    <InfoWrap>
      <VotingPower>
        <Text as="span" color="secondary" size="xxs">
          Your voting power
        </Text>
        <Amount data-testid="myVPAmount">
          {formatBalance(voterDaoTokenBalance ?? 0n)} {KnownToken.LDO.symbol}
        </Amount>
      </VotingPower>
      {totalDelegatedVotingPower > 0n && (
        <VotingPower>
          <Text as="span" color="secondary" size="xxs">
            Total delegated voting power
          </Text>
          <Amount data-testid="delegatedVPAmount">
            {formatBalance(totalDelegatedVotingPower)} {KnownToken.LDO.symbol}
          </Amount>
        </VotingPower>
      )}
    </InfoWrap>
  );
};
