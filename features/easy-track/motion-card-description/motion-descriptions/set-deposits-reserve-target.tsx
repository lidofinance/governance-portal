import { useQuery } from '@tanstack/react-query';
import { formatEther } from 'viem';
import { setDepositsReserveTargetAbi } from 'abi/generated';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';
import { MotionDescriptionProps } from '../types';
import { StETH } from 'shared/blockchain/contracts';

export const SetDepositsReserveTarget = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof setDepositsReserveTargetAbi>) => {
  const newDepositsReserveTarget = callData;

  const { chainId } = useLidoSDK();
  const stETH = useReadContract(StETH);

  const { data: currentDepositsReserveTarget } = useQuery({
    queryKey: ['set-deposits-reserve-target-current', chainId],
    enabled: isOnChain,
    staleTime: Infinity,
    queryFn: async () => stETH.readContract('getDepositsReserveTarget'),
  });

  return (
    <>
      Set deposits reserve target
      {isOnChain && typeof currentDepositsReserveTarget === 'bigint' && (
        <>
          {' '}
          from <b>{formatEther(currentDepositsReserveTarget)} ETH</b>
        </>
      )}{' '}
      to <b>{formatEther(newDepositsReserveTarget)} ETH</b>
    </>
  );
};
