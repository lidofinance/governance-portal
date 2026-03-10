import { CancelButton, Wrap } from './style';
import { TrashIcon } from 'shared/components/icons';
import { useMotionContext } from '@easy-track/providers/motion-detailed-context';

export const MotionCardDetailedCancelButton = () => {
  const { motion, handleCancel } = useMotionContext();

  return (
    <Wrap>
      <CancelButton onClick={() => handleCancel(BigInt(motion.id))}>
        <TrashIcon />
      </CancelButton>
    </Wrap>
  );
};
