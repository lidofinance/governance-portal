import { Token } from 'shared/blockchain/types';
import { formatEthFull } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';

type Props = {
  amount: bigint;
  token: Token | 'ETH';
};

export const TxAmount = ({ amount, token }: Props) => (
  <Text as="span" size={24}>
    {token === Token.unstETH ? amount.toString() : formatEthFull(amount)}&nbsp;
    {token}
  </Text>
);
