import { useEstimateContractGas } from 'shared/blockchain/hooks/use-estimated-gas-cost';
import { useSupportFormDataContext } from './support-form-context';
import { useMemo } from 'react';
import { useTokenContractObject } from 'shared/blockchain/hooks/use-token-contract-object';
import { zeroAddress } from 'viem';

const LOCK_GAS_AMOUNT_MOCK = 100500n;

export const useLockTxGas = () => {
  const { networkData, activeToken, approveData } = useSupportFormDataContext();
  const tokenContractObject = useTokenContractObject(activeToken);

  // TODO: figure out how to estimate gas properly given the fact that escrow address is dynamic
  // const functionName = useMemo(() => {
  //   switch (activeToken) {
  //     case Token.stETH:
  //       return 'lockStETH';
  //     case Token.wstETH:
  //       return 'lockWstETH';
  //     case Token.unstETH:
  //       return 'lockUnstETH';
  //   }
  // }, [activeToken]);
  // const { data: lockGas, isLoading: isLockGasLoading } = useEstimateContractGas(
  //   {
  //     address: networkData.vetoSignallingAddress,
  //     abi: escrowAbi,
  //   },
  //   functionName,
  //   [69420n],
  // );

  const { data: approveGas, isLoading: isApproveGasLoading } =
    useEstimateContractGas(tokenContractObject, 'approve', [
      networkData.vetoSignallingAddress ?? zeroAddress,
      69420n,
    ]);

  const estimatedGas = useMemo(() => {
    const approveGasTocheck =
      approveGas != null && approveData.needsApprove ? approveGas : 0n;
    return LOCK_GAS_AMOUNT_MOCK + (approveGasTocheck ?? 0n);
  }, [approveData.needsApprove, approveGas]);

  return {
    estimatedGas,
    isLoading: networkData.isLoading || isApproveGasLoading,
  };
};
