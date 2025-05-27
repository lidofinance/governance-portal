import { Modal } from '@lidofinance/lido-ui';
import { Box } from 'shared/components/box';
import { Text } from '../text';
import { Button } from '../button';
import type { ModalComponentType } from 'providers/modal-provider';

export type ConfirmModalProps = {
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal: ModalComponentType<ConfirmModalProps> = ({
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  ...modalProps
}) => (
  <Modal {...modalProps} onClose={onCancel} title={title}>
    {description && (
      <Text size={14} color="primary">
        {description}
      </Text>
    )}
    <Box display="flex" flexDirection="column" gap={20} marginTop={30}>
      <Button onClick={onConfirm}>{confirmText}</Button>
      <Button onClick={onCancel} variant="outlined">
        {cancelText}
      </Button>
    </Box>
  </Modal>
);
