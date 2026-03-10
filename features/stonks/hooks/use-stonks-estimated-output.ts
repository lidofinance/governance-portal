import { ToastError } from '@lidofinance/lido-ui';
import { useQuery } from '@tanstack/react-query';
import { stonksV2Abi } from 'abi/generated';
import { useLidoSDK } from 'providers/lido-sdk';
import { useState } from 'react';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { Address } from 'viem';

export const useStonksEstimatedOutput = (
  stonksAddress: Address,
  amount: bigint | null | undefined,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { chainId } = useLidoSDK();
  const getStonksContract = useReadContractGetter(stonksV2Abi);
  const stonksContractReader = getStonksContract(stonksAddress);

  const fetchEstimatedOutput = async (value: bigint | null | undefined) => {
    if (!value) {
      return 0n;
    }
    setIsLoading(true);
    const result = await stonksContractReader('estimateTradeOutput', [value]);
    if (result === null) {
      ToastError(`Error while loading estimated output value`, {});
    }
    setIsLoading(false);

    return result ?? 0n;
  };

  const result = useQuery({
    queryKey: [
      'stonks-estimated-output',
      chainId,
      stonksAddress,
      amount?.toString(),
    ],
    queryFn: async () => fetchEstimatedOutput(amount),
  });

  return {
    ...result,
    isLoading: result.isLoading || isLoading,
    fetchEstimatedOutput,
  };
};
