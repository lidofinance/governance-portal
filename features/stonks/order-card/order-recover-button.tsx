import { Button } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { useRecoverOrderAction } from '@stonks/write-actions/recover-order/action';
import { Address } from 'viem';
import { ConnectWalletButton } from 'shared/wallet';
import { useIsStonksManager } from '@stonks/hooks/use-is-stonks-manager';

type Props = {
  orderAddress: Address;
  onFinish?: () => Promise<void>;
};

export const StonksOrderCardRecoverButton = ({
  orderAddress,
  onFinish,
}: Props) => {
  const { isConnected } = useAccount();
  const { data: isStonksManagerConnected } = useIsStonksManager(orderAddress);

  const recoverOrder = useRecoverOrderAction({
    orderAddress,
    onConfirm: async () => {
      await onFinish?.();
    },
  });

  if (!isConnected) {
    return <ConnectWalletButton buttonStyleVersion="default" />;
  }

  return (
    <Button
      disabled={!isStonksManagerConnected}
      size="sm"
      variant="outlined"
      onClick={recoverOrder}
    >
      {isStonksManagerConnected === false
        ? 'Only Stonks manager can recover orders'
        : 'Recover Order'}
    </Button>
  );
};
