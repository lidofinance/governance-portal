import { useEstimateContractGas } from 'shared/blockchain/hooks/use-estimated-gas-cost';
import { useSupportFormDataContext } from './support-form-context';
import { useMemo, useState, useEffect } from 'react';
import { useTokenContractObject } from 'shared/blockchain/hooks/use-token-contract-object';
import { zeroAddress } from 'viem';
import { useEscrowContext } from 'providers/escrow';
import { Token } from 'shared/blockchain/types';
import { escrowAbi } from 'abi/generated';

// Fallbacks
const GAS_ESTIMATES = {
  lockStETH: 200000n,
  lockWstETH: 220000n,
  lockUnstETH: 250000n,
  approve: 60000n,
};

export const useLockTxGas = () => {
  const { networkData, selectedToken, approveData } =
    useSupportFormDataContext();
  const { vetoSignallingAddress } = useEscrowContext();
  const tokenContractObject = useTokenContractObject(selectedToken);

  const functionName = useMemo(() => {
    switch (selectedToken) {
      case Token.stETH:
        return 'lockStETH';
      case Token.wstETH:
        return 'lockWstETH';
      case Token.unstETH:
        return 'lockUnstETH';
    }
  }, [selectedToken]);

  const shouldEstimateLockGas =
    !approveData.needsApprove ||
    (approveData.allowance && approveData.allowance > 0n);

  const formAmount =
    approveData.allowance && approveData.allowance > 0n
      ? approveData.allowance
      : 1000000000000000n;

  const { data: lockGas, isLoading: isLockGasLoading } = useEstimateContractGas(
    {
      address: networkData.vetoSignallingAddress,
      abi: escrowAbi,
    },
    functionName,
    [formAmount],
  );

  const effectiveLockGasLoading = shouldEstimateLockGas
    ? isLockGasLoading
    : false;

  const { data: approveGas, isLoading: isApproveGasLoading } =
    useEstimateContractGas(tokenContractObject, 'approve', [
      vetoSignallingAddress ?? zeroAddress,
      69420n,
    ]);

  const estimatedGas = useMemo(() => {
    const approveGasToUse =
      approveGas != null && approveData.needsApprove ? approveGas : 0n;

    let lockGasToUse: bigint;
    if (lockGas != null) {
      lockGasToUse = lockGas;
    } else {
      switch (selectedToken) {
        case Token.stETH:
          lockGasToUse = GAS_ESTIMATES.lockStETH;
          break;
        case Token.wstETH:
          lockGasToUse = GAS_ESTIMATES.lockWstETH;
          break;
        case Token.unstETH:
          lockGasToUse = GAS_ESTIMATES.lockUnstETH;
          break;
        default:
          lockGasToUse = GAS_ESTIMATES.lockStETH;
      }
    }

    // Add a 10% buffer
    return ((lockGasToUse + approveGasToUse) * 110n) / 100n;
  }, [approveData.needsApprove, approveGas, lockGas, selectedToken]);

  const [useEstimatedGas, setUseEstimatedGas] = useState(true);

  useEffect(() => {
    if (effectiveLockGasLoading || isApproveGasLoading) {
      const timer = setTimeout(() => {
        setUseEstimatedGas(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [effectiveLockGasLoading, isApproveGasLoading]);

  const fallbackGas = useMemo(() => {
    const approveGasToUse = approveData.needsApprove
      ? GAS_ESTIMATES.approve
      : 0n;

    let lockGasToUse: bigint;
    switch (selectedToken) {
      case Token.stETH:
        lockGasToUse = GAS_ESTIMATES.lockStETH;
        break;
      case Token.wstETH:
        lockGasToUse = GAS_ESTIMATES.lockWstETH;
        break;
      case Token.unstETH:
        lockGasToUse = GAS_ESTIMATES.lockUnstETH;
        break;
      default:
        lockGasToUse = GAS_ESTIMATES.lockStETH;
    }

    return ((lockGasToUse + approveGasToUse) * 110n) / 100n; // Add 10% buffer
  }, [selectedToken, approveData.needsApprove]);

  return {
    estimatedGas: useEstimatedGas ? estimatedGas : fallbackGas,
    isLoading:
      useEstimatedGas &&
      (networkData.isLoading || isApproveGasLoading || effectiveLockGasLoading),
  };
};
