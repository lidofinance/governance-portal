import { Button, Modal, Warning } from '@lidofinance/lido-ui';
import { getUseModal, ModalProps } from 'providers/modal-provider';
import { ModalButtonGroup } from './style';

const ConfirmReDelegateModal = ({
  onAlternative,
  onSubmit,
  subtitle,
  ...props
}: ModalProps<{
  onSubmit?: () => void;
  onAlternative?: () => void;
  subtitle?: React.ReactNode;
}>) => {
  const handleRedelegate = () => {
    onSubmit?.();
    props.onClose?.();
  };
  const handleCustomize = () => {
    onAlternative?.();
    props.onClose?.();
  };

  return (
    <Modal
      title="Notice"
      subtitle={subtitle ?? 'You are about to redelegate'}
      titleIcon={<Warning />}
      center
      {...props}
    >
      <ModalButtonGroup>
        <Button onClick={handleRedelegate}>Redelegate</Button>
        <Button variant="outlined" onClick={handleCustomize}>
          Customize
        </Button>
      </ModalButtonGroup>
    </Modal>
  );
};

export const useConfirmReDelegateModal = getUseModal(ConfirmReDelegateModal);
