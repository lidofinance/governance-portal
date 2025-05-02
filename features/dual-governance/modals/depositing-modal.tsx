import {
  Loader,
  Text,
  Modal,
  ModalProps,
  Success,
  Error,
} from '@lidofinance/lido-ui';

import { TransactionState } from 'features/dual-governance/types';

type Props = {
  amount: string; // TODO: use real type when it's defined
  state: TransactionState;
} & ModalProps;

export const DepositingModal = ({ amount, state, ...modalProps }: Props) => {
  const Title = () => {
    return (
      <Text strong size="md">
        You are depositing {amount} stETH
      </Text>
    );
  };

  const TitleIcon = () => {
    switch (state) {
      case TransactionState.PENDING:
        return <Loader size="large" />;
      case TransactionState.SUCCESS:
        return (
          <Success
            color="green"
            height={64}
            width={64}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        );
      case TransactionState.ERROR:
        return (
          <Error
            color="red"
            height={64}
            width={64}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
        );
    }
  };
  return (
    <>
      <Modal
        {...modalProps}
        title={<Title />}
        center
        subtitle="Some label"
        titleIcon={<TitleIcon />}
      >
        <Text color="secondary" size="xxs">
          Confirm this transaction in your wallet
        </Text>
      </Modal>
    </>
  );
};
