import { Button } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { useRecoverOrderAction } from '@stonks/write-actions/recover-order/action';
import { Address } from 'viem';
import { ConnectWalletButton } from 'shared/wallet';

type Props = {
  orderAddress: Address;
  onFinish?: () => void;
};

export const StonksOrderCardRecoverButton = ({
  orderAddress,
  onFinish,
}: Props) => {
  const { isConnected } = useAccount();

  const recoverOrder = useRecoverOrderAction({
    orderAddress,
    onConfirm: () => {
      onFinish?.();
    },
  });

  if (!isConnected) {
    return <ConnectWalletButton />;
  }

  return (
    <Button size="sm" variant="outlined" onClick={recoverOrder}>
      Recover funds
    </Button>
  );
};
