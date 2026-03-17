import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Address, formatUnits, Hex } from 'viem';
import { useLidoSDK } from 'providers/lido-sdk';
import { Motion, RawMotionSubgraph } from '@easy-track/types';
import { MotionType } from '@easy-track/motion-types';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import {
  MOTION_TYPE_ABI_MAP,
  decodeEvmScriptCallData,
} from '@easy-track/hooks/use-decode-evm-script-call-data';
import { useMotionTokenData } from '@easy-track/hooks/use-motion-token-data';
import { ETH_DECIMALS } from 'shared/blockchain/constants';
import { topUpWithLimitsAbi } from 'abi/generated/TopUpWithLimits';
import { topUpWithLimitsStablesAbi } from 'abi/generated/TopUpWithLimitsStables';
import { topUpAllowedRecipientsAbi } from 'abi/generated/TopUpAllowedRecipients';

// viem returns a positional tuple at runtime, not named properties.
// topUpWithLimitsStablesAbi: [token, recipients, amounts]
// all other top-up ABIs:     [recipients, amounts]
// Non-top-up ABIs (e.g. SetJailStatus) have bool[] at index 1 — never extract amounts from those.
const isTopUpMotion = (motionType: MotionType) => {
  const motionAbi = MOTION_TYPE_ABI_MAP[motionType];
  return (
    motionAbi === topUpWithLimitsAbi ||
    motionAbi === topUpAllowedRecipientsAbi ||
    motionAbi === topUpWithLimitsStablesAbi
  );
};

const isStablesTopUp = (motionType: MotionType) =>
  MOTION_TYPE_ABI_MAP[motionType] === topUpWithLimitsStablesAbi;

const getTopUpAmount = (
  amounts: bigint[] | undefined,
  tokenDecimals = ETH_DECIMALS,
): number => {
  if (!Array.isArray(amounts) || amounts.length === 0) {
    return 0;
  }
  const amountsSum = amounts.reduce((acc, amount) => acc + amount, 0n);
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

  const tuple = callData as readonly unknown[] | null;
  const isTopUp = motionType !== EvmUnrecognized && isTopUpMotion(motionType);
  const stables = isTopUp && isStablesTopUp(motionType);

  const amounts = (
    isTopUp ? (stables ? tuple?.[2] : tuple?.[1]) : undefined
  ) as bigint[] | undefined;
  const token = (stables ? tuple?.[0] : undefined) as Address | undefined;

  const { data: tokenData } = useMotionTokenData(token);

  const motionTopUpAmount = useMemo(
    () => getTopUpAmount(amounts, tokenData?.decimals),
    [amounts, tokenData],
  );

  return {
    callData,
    motionTopUpAmount,
    motionTopUpToken: tokenData?.label,
  };
};
