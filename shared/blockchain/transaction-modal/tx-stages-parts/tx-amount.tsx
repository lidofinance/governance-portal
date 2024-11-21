import { formatEthFull } from 'shared/blockchain/utils';
import { Text } from 'shared/components/text';

type Props = {
  amount: bigint;
  symbol: string;
};

// TODO: add on the component
export const TxAmount = ({ amount, symbol }: Props) => (
  <Text>
    {formatEthFull(amount)} {symbol}
  </Text>
);
