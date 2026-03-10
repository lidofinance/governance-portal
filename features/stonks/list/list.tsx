import { AddressBadge, Loader } from '@lidofinance/lido-ui';
import { useStonksBalanceMap } from '@stonks/hooks/use-stonks-balance-map';
import { STONKS_MAP } from '@stonks/addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';
import { StonksMetadata } from '@stonks/types';
import { Card, CardTitle, ListStyled } from './style';
import { Text } from 'shared/components/text';
import { formatToken } from 'shared/blockchain/utils';
import { stonksInstancePage } from 'constants/urls';
import { AddressPop } from 'shared/components/address-pop';

type StonksData = StonksMetadata & {
  balance: bigint;
};

export const StonksList = () => {
  const { chainId } = useLidoSDK();
  const { data: stonksBalanceMap, isLoading } = useStonksBalanceMap();

  const stonksData: StonksData[] = useMemo(() => {
    const list = STONKS_MAP[chainId] ?? [];

    return list
      .map((stonks) => ({
        ...stonks,
        balance: stonksBalanceMap?.[stonks.address] ?? 0n,
      }))
      .sort((a, b) =>
        a.balance === b.balance ? 0 : a.balance > b.balance ? -1 : 1,
      );
  }, [chainId, stonksBalanceMap]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ListStyled>
      {stonksData.map((stonks) => {
        return (
          <Card
            key={stonks.address}
            target="_self"
            href={stonksInstancePage(stonks.address)}
            $empty={stonks.balance === 0n}
          >
            <CardTitle>
              <Text size={16}>
                {`${stonks.tokenFrom.symbol} -> ${stonks.tokenTo.symbol}`}
              </Text>
              <AddressPop address={stonks.address}>
                <AddressBadge address={stonks.address} />
              </AddressPop>
            </CardTitle>
            <Text size={14} color="secondary">
              {formatToken({
                amount: stonks.balance,
                decimals: stonks.tokenFrom.decimals,
              })}{' '}
              {stonks.tokenFrom.symbol}
            </Text>
          </Card>
        );
      })}
    </ListStyled>
  );
};
