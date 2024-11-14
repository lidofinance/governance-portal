import { escrowAbi } from 'abi/ts';
import { useEstimateContractGas } from 'shared/blockchain/hooks/use-estimated-gas-cost';
import { useSupportFormDataContext } from './support-form-context';
import { useMemo } from 'react';
import { Token } from 'shared/blockchain/types';
import { useTokenContractObject } from 'shared/blockchain/hooks/use-token-contract-object';
import { zeroAddress } from 'viem';

export const useLockTxGas = () => {
  const { networkData, activeToken, approveData } = useSupportFormDataContext();
  const tokenContractObject = useTokenContractObject(activeToken);

  const functionName = useMemo(() => {
    switch (activeToken) {
      case Token.stETH:
        return 'lockStETH';
      case Token.wstETH:
        return 'lockWstETH';
      case Token.unstETH:
        return 'lockUnstETH';
    }
  }, [activeToken]);

  const { data: lockGas, isLoading: isLockGasLoading } = useEstimateContractGas(
    {
      address: networkData.vetoSignallingAddress,
      abi: escrowAbi,
    },
    functionName,
    [69420n],
  );

  const { data: approveGas, isLoading: isApproveGasLoading } =
    useEstimateContractGas(tokenContractObject, 'approve', [
      networkData.vetoSignallingAddress ?? zeroAddress,
      69420n,
    ]);

  const estimatedGas = useMemo(() => {
    const approveGasTocheck =
      approveGas != null && approveData.needsApprove ? approveGas : 0n;
    return (lockGas ?? 0n) + (approveGasTocheck ?? 0n);
  }, [approveData.needsApprove, approveGas, lockGas]);

  return {
    estimatedGas,
    isLoading: networkData.isLoading || isLockGasLoading || isApproveGasLoading,
  };
};
