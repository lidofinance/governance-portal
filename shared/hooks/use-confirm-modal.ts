import { useCallback, useState } from 'react';
import { useModal } from 'providers/modal-provider';
import {
  ConfirmModal,
  ConfirmModalProps,
} from 'shared/components/confirm-modal';

type ModalProps = Omit<ConfirmModalProps, 'onCancel' | 'onConfirm'>;

export const useConfirmModal = () => {
  const [open, setOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const modalActions = useModal(ConfirmModal);

  const confirm = useCallback(
    ({
      title = 'Are you sure?',
      description = '',
      confirmText = 'Yes',
      cancelText = 'No',
    }: ModalProps) => {
      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
        setOpen(true);

        const { closeModal } = modalActions.openModal({
          title,
          description,
          confirmText,
          cancelText,
          onConfirm: () => {
            closeModal();
            resolve(true);
          },
          onCancel: () => {
            closeModal();
            resolve(false);
          },
        });
      });
    },
    [modalActions],
  );

  const onClose = useCallback(() => {
    setOpen(false);
    if (resolvePromise) resolvePromise(false);
  }, [resolvePromise]);

  return {
    open,
    confirm,
    onClose,
    openModal: modalActions.openModal,
    closeModal: modalActions.closeModal,
  };
};
