import { AddressBadge, Button } from '@lidofinance/lido-ui';
import { useStonksBalanceMap } from '@stonks/hooks/use-stonks-balance-map';
import { STONKS_MAP } from '@stonks/addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';
import { StonksMetadata } from '@stonks/types';
import { Card, CardTitle, ListStyled } from './style';
import { Text } from 'shared/components/text';
import { formatToken } from 'shared/blockchain/utils';
import { useRouter } from 'next/router';
import { stonksInstancePage } from 'constants/urls';
import { AddressPop } from 'shared/components/address-pop';

type StonksData = StonksMetadata & {
  balance?: bigint;
};

export const StonksList = () => {
  const router = useRouter();
  const { chainId } = useLidoSDK();
  const { data: stonksBalanceMap } = useStonksBalanceMap();

  const stonksData: StonksData[] = useMemo(() => {
    const list = STONKS_MAP[chainId] ?? [];

    return list.map((stonks) => ({
      ...stonks,
      balance: stonksBalanceMap?.[stonks.address] ?? undefined,
    }));
  }, [chainId, stonksBalanceMap]);

  return (
    <ListStyled>
      {stonksData.map((stonks) => {
        const isBalanceLoading = stonks.balance === undefined;
        const isZero = isBalanceLoading || stonks.balance === 0n;
        return (
          <Card key={stonks.address}>
            <CardTitle>
              <Text size={14}>
                {`${stonks.tokenFrom.symbol} -> ${stonks.tokenTo.symbol}`}
              </Text>
              <AddressPop address={stonks.address}>
                <AddressBadge address={stonks.address} />
              </AddressPop>
            </CardTitle>
            <Text size={12} color="secondary">
              Balance:{' '}
              {isBalanceLoading
                ? 'Loading...'
                : `${formatToken({
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    amount: stonks.balance!,
                    decimals: stonks.tokenFrom.decimals,
                  })} ${stonks.tokenFrom.symbol}`}
            </Text>
            <Button
              size="xs"
              variant={isZero ? 'outlined' : 'filled'}
              disabled={isBalanceLoading}
              onClick={() => router.push(stonksInstancePage(stonks.address))}
            >
              {isBalanceLoading
                ? 'Loading...'
                : isZero
                  ? 'Inspect'
                  : 'Create order'}
            </Button>
          </Card>
        );
      })}
    </ListStyled>
  );
};
