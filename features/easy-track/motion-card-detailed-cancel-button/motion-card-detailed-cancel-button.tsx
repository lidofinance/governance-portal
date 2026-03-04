import { CancelButton, Wrap } from './style';
import { TrashIcon } from 'shared/components/icons';
import { useMotions } from '@easy-track/providers/motion-detailed-context';

export const MotionCardDetailedCancelButton = () => {
  const { motion, handleCancel } = useMotions();

  return (
    <Wrap>
      <CancelButton onClick={() => handleCancel(BigInt(motion.id))}>
        <TrashIcon />
      </CancelButton>
    </Wrap>
  );
};
