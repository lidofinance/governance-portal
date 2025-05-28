import { FC } from 'react';
import { useAccount } from 'wagmi';
import { ButtonProps } from '@lidofinance/lido-ui';

import { AddressBadge } from '../address-badge/address-badge';
import { useWalletModal } from '../wallet-modal/use-wallet-modal';

import { WalledButtonWrapperStyle } from './styles';

export const WalletButton: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;

  const { address } = useAccount();

  const { openModal } = useWalletModal();

  return (
    <WalledButtonWrapperStyle onClick={() => openModal({})} {...rest}>
      <AddressBadge address={address as `0x${string}`} />
    </WalledButtonWrapperStyle>
  );
};
