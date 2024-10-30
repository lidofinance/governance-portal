import { FC } from 'react';
import { useAccount } from 'wagmi';
import { ButtonProps } from '@lidofinance/lido-ui';

import { AddressBadge } from '../components/address-badge/address-badge';
import { useWalletModal } from '../wallet-modal/use-wallet-modal';

import { WalledButtonWrapperStyle, WalledButtonLoaderStyle } from './styles';
import { useEthereumBalance } from 'shared/hooks';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;

  const { address } = useAccount();

  const { openModal } = useWalletModal();
  const { isLoading } = useEthereumBalance();

  return (
    <WalledButtonWrapperStyle onClick={() => openModal({})} {...rest}>
      {isLoading && <WalledButtonLoaderStyle />}
      <AddressBadge address={address as `0x${string}`} />
    </WalledButtonWrapperStyle>
  );
};
