import { Text } from '@lidofinance/lido-ui';
import { InfoWrap, VotingPower, Amount } from './style';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { useDelegators } from '../../hooks/use-delegators';
import { formatEther } from 'viem';

interface Props {
  votePowerWei: bigint | null | undefined;
}

export const VotePowerInfo = ({ votePowerWei }: Props) => {
  const { data: tokenData } = useGovernanceToken();
  const {
    data: { nonZeroDelegators, totalVotingPower },
  } = useDelegators();

  return (
    <InfoWrap>
      <VotingPower>
        <Text as="span" color="secondary" size="xxs">
          My voting power
        </Text>
        <Amount data-testid="myVPAmount">
          {formatEther(votePowerWei || 0n)} {tokenData?.symbol}
        </Amount>
      </VotingPower>
      {nonZeroDelegators.length > 0 && (
        <VotingPower>
          <Text as="span" color="secondary" size="xxs">
            Delegated voting power
          </Text>
          <Amount data-testid="delegatedVPAmount">
            {formatEther(totalVotingPower)} {tokenData?.symbol}
          </Amount>
        </VotingPower>
      )}
    </InfoWrap>
  );
};
