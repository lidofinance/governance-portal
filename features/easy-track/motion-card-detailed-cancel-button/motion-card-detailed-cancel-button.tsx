import { CancelButton, Wrap } from './style';
import { useCallback, useState } from 'react';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { easyTrackAbi } from 'abi/generated';
import { Motion, RawMotionSubgraph } from '../types';
import { EasyTrack } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { TrashIcon } from 'shared/components/icons';
import { Loader, ToastError, ToastInfo } from '@lidofinance/lido-ui';

type Props = {
  motion: Motion | RawMotionSubgraph;
};

export const MotionCardDetailedCancelButton = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();
  const writeEasyTrackContract = useWriteContract(easyTrackAbi);
  const easyTrackAddress = getContractAddress(EasyTrack, chainId);
  const [isSubmitting, setSubmitting] = useState(false);

  const populateCancel = useCallback(async () => {
    try {
      ToastInfo('Confirm transaction in your wallet');
      setSubmitting(true);

      await writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'cancelMotion',
        args: [BigInt(motion.id)],
      });
    } catch (error) {
      console.error('Error cancelling motion:', error);
      ToastError('Transaction was rejected or failed');
    } finally {
      setSubmitting(false);
    }
  }, [writeEasyTrackContract, easyTrackAddress, motion.id]);

  return (
    <Wrap>
      <CancelButton onClick={populateCancel}>
        {isSubmitting ? <Loader size="small" /> : <TrashIcon />}
      </CancelButton>
    </Wrap>
  );
};
