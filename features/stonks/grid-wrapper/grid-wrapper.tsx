import { Button } from '@lidofinance/lido-ui';
import { useStonksDataMap } from '@stonks/hooks/use-stonks-data-map';
import { useConnect } from 'reef-knot/core-react';
import { useAccount } from 'wagmi';
import { StonksGrid } from './grid';
import { STONKS_MAP } from '@stonks/addresses';
import { useLidoSDK } from 'providers/lido-sdk';
import { useMemo } from 'react';

export const StonksGridWrapper = () => {
  const { chainId } = useLidoSDK();
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { data: stonksDataMap } = useStonksDataMap();

  const stonksData = useMemo(() => {
    const list = STONKS_MAP[chainId] ?? [];
    if (!stonksDataMap) {
      return list;
    }

    return list.map((stonks) => ({
      ...stonks,
      currentBalance: stonksDataMap[stonks.address]?.currentBalance,
      expectedOutput: stonksDataMap[stonks.address]?.expectedOutput,
    }));
  }, [chainId, stonksDataMap]);

  if (!isConnected) {
    return (
      <Button type="submit" fullwidth onClick={connect}>
        Connect wallet to proceed
      </Button>
    );
  }

  return <StonksGrid stonksData={stonksData} />;
};
