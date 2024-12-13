import { Token } from 'shared/blockchain/types';
import { formatEthFull } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';

type Props = {
  amount: bigint;
  token: Token;
};

export const TxAmount = ({ amount, token }: Props) => (
  <Text>
    {token === Token.unstETH ? amount.toString() : formatEthFull(amount)}{' '}
    {token}
  </Text>
);
