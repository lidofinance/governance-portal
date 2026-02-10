import { Button } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';
import { Card, Grid } from './style';
import { Text } from 'shared/components/text';
import { formatToken } from 'shared/blockchain/utils';
import { stonksInstancePage } from 'constants/urls';
import { StonksMetadata } from '@stonks/types';

type StonksData = StonksMetadata & {
  currentBalance?: bigint;
  expectedOutput?: bigint;
};

type Props = {
  stonksData: StonksData[];
};

export const StonksGrid = ({ stonksData }: Props) => {
  const router = useRouter();

  return (
    <Grid>
      {stonksData.map((stonks) => {
        const isZero = stonks.currentBalance === 0n;
        return (
          <Card key={stonks.address}>
            <Text size={14} weight={800}>
              {stonks.tokenFrom.symbol}
              {'->'}
              {stonks.tokenTo.symbol}
            </Text>
            <Text size={12} color="secondary">
              Balance:{' '}
              {formatToken({
                amount: stonks.currentBalance ?? 0n,
                decimals: stonks.tokenFrom.decimals,
              })}{' '}
              {stonks.tokenFrom.symbol}
            </Text>
            <Button
              size="xs"
              variant={isZero ? 'outlined' : 'filled'}
              onClick={() => router.push(stonksInstancePage(stonks.address))}
            >
              {isZero ? 'Inspect' : 'Create Order'}
            </Button>
          </Card>
        );
      })}
    </Grid>
  );
};
