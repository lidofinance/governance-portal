import { Modal, ModalProps, Text } from '@lidofinance/lido-ui';
import { FlexWrapper } from 'shared/styled-components';
import { ActionButton } from 'shared/components/action-button';

type Props = {
  closeModal: () => void;
} & ModalProps;

export const VerifyDepositModal = ({ closeModal, ...modalProps }: Props) => {
  const Title = () => {
    return (
      <Text strong size="md">
        Verify Your Deposit{' '}
      </Text>
    );
  };
  return (
    <Modal
      {...modalProps}
      title={<Title />}
      subtitle="You are about to deposit a significant amount of stETH into the Dual Governance vault. Please confirm that you are certain of this decision."
    >
      <br />
      <FlexWrapper $flexDirection="column" $gap="10px">
        <ActionButton type="primary" size="md">
          Proceed
        </ActionButton>
        <ActionButton type="secondary" onClick={closeModal}>
          Close
        </ActionButton>
      </FlexWrapper>
    </Modal>
  );
};
