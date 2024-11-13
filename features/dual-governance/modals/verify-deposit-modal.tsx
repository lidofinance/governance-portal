import { Modal, ModalProps, Text } from '@lidofinance/lido-ui';
import { Button } from 'shared/components/button';
import { FlexWrapper } from 'shared/styled-components';

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
        <Button size="md">Proceed</Button>
        <Button onClick={closeModal}>Close</Button>
      </FlexWrapper>
    </Modal>
  );
};
