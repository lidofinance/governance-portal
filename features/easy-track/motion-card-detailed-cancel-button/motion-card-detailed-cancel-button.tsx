import { CancelButton, Wrap } from './style';
import { useCallback } from 'react';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { easyTrackAbi } from 'abi/generated';
import { Motion, RawMotionSubgraph } from '../types';
import { EasyTrack } from 'shared/blockchain/contracts';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';
import { TrashIcon } from 'shared/components/icons';

type Props = {
  motion: Motion | RawMotionSubgraph;
};

export const MotionCardDetailedCancelButton = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();
  const writeEasyTrackContract = useWriteContract(easyTrackAbi);
  const easyTrackAddress = getContractAddress(EasyTrack, chainId);

  const populateCancel = useCallback(async () => {
    try {
      return await writeEasyTrackContract({
        address: easyTrackAddress,
        functionName: 'cancelMotion',
        args: [BigInt(motion.id)],
      });
    } catch (error) {
      console.error('Error populating cancel motion transaction:', error);
    }
  }, [writeEasyTrackContract, easyTrackAddress, motion.id]);

  return (
    <Wrap>
      <CancelButton onClick={populateCancel}>
        <TrashIcon />
      </CancelButton>
    </Wrap>
  );
};
