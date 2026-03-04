import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Address, formatUnits, Hex } from 'viem';
import { useLidoSDK } from 'providers/lido-sdk';
import { Motion, RawMotionSubgraph } from '@easy-track/types';
import { MotionType } from '@easy-track/motion-types';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import { decodeEvmScriptCallData } from '@easy-track/hooks/use-decode-evm-script-call-data';
import { useMotionTokenData } from '@easy-track/hooks/use-motion-token-data';
import { ETH_DECIMALS } from 'shared/blockchain/constants';

type CallDataWithTopUp = {
  amounts?: bigint[];
  token?: Address;
};

const getTopUpAmount = (
  callData: CallDataWithTopUp | null | undefined,
  tokenDecimals = ETH_DECIMALS,
): number => {
  if (!callData?.amounts?.length) return 0;
  const amountsSum = callData.amounts.reduce((acc, amount) => acc + amount, 0n);
  return Number(formatUnits(amountsSum, tokenDecimals));
};

export const useMotionCallData = (
  motion: Motion | RawMotionSubgraph,
  motionType: MotionType | EvmUnrecognized,
) => {
  const { chainId } = useLidoSDK();

  const { data: callData } = useQuery({
    queryKey: ['call-data', chainId, String(motion.id)],
    queryFn: () =>
      decodeEvmScriptCallData(
        motionType as MotionType,
        motion.evmScriptCalldata as Hex,
      ),
    enabled: !!motion.evmScriptCalldata && motionType !== EvmUnrecognized,
  });

  const typedCallData = callData as CallDataWithTopUp | null;

  const { data: tokenData } = useMotionTokenData(
    typedCallData?.token ?? undefined,
  );

  const motionTopUpAmount = useMemo(
    () => getTopUpAmount(typedCallData, tokenData?.decimals ?? ETH_DECIMALS),
    [callData, tokenData], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    callData,
    motionTopUpAmount,
    motionTopUpToken: tokenData?.label,
  };
};
