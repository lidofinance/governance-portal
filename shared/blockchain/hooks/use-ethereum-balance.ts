import { useQueryClient } from '@tanstack/react-query';
import { useAccount, useBalance, useBlockNumber } from 'wagmi';
import { config } from 'config';
import { useEffect } from 'react';

export const useEthereumBalance = () => {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({
    watch: {
      poll: true,
      pollingInterval: config.PROVIDER_POLLING_INTERVAL,
      enabled: !!address,
    },
    cacheTime: config.PROVIDER_POLLING_INTERVAL,
  });

  const queryData = useBalance({
    address,
    query: {
      // because we subscribe to block
      staleTime: Infinity,
      enabled: !!address,
    },
  });

  useEffect(() => {
    void queryClient.invalidateQueries(
      { queryKey: queryData.queryKey },
      // this tells RQ to not force another refetch if this query is already revalidating
      // dedups rpc requests
      { cancelRefetch: false },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  return queryData;
};
