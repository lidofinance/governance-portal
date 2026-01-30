import { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';
import {
  ButtonIcon,
  Modal,
  Identicon,
  External,
  Copy,
  Address,
} from '@lidofinance/lido-ui';
import { useConnectorInfo, useDisconnect } from 'reef-knot/core-react';

import type { ModalComponentType } from 'providers/modal-provider';
import { useCopyToClipboard } from 'shared/hooks';
import {
  WalletModalContentStyle,
  WalletModalConnectedStyle,
  WalletModalConnectorStyle,
  WalletModalDisconnectStyle,
  WalletModalAccountStyle,
  WalletModalAddressStyle,
  WalletModalActionsStyle,
  WalletModalBalanceWrapper,
} from './styles';
import { openWindow } from 'utils/open-window';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { useGovernanceToken } from '../../hooks/use-governance-token';
import { Text } from 'shared/components/text';
import { FlexWrapper } from '../../styled-components';

export const WalletModal: ModalComponentType = ({ onClose, ...props }) => {
  const { address } = useAccount();
  const { connectorName } = useConnectorInfo();
  const { disconnect } = useDisconnect();
  const { chainId } = useLidoSDK();
  const { data: tokenData, isLoading: isTokenDataLoading } =
    useGovernanceToken();

  const handleDisconnect = useCallback(() => {
    disconnect?.();
    onClose?.();
  }, [disconnect, onClose]);

  const handleCopy = useCopyToClipboard(address ?? '');
  // const handleEtherscan = useEtherscanOpen(address ?? '', 'address');

  useEffect(() => {
    // Close the modal if a wallet was somehow disconnected while the modal was open
    if (address == null || address.length === 0) {
      onClose?.();
    }
  }, [address, onClose]);

  useEffect(() => {
    // Close the modal if a wallet was somehow disconnected while the modal was open
    if (address == null || address.length === 0) {
      onClose?.();
    }
  }, [address, onClose]);

  return (
    <Modal title="Account" onClose={onClose} {...props}>
      <WalletModalContentStyle>
        <WalletModalConnectedStyle>
          <FlexWrapper $flexDirection="column">
            {connectorName && (
              <WalletModalConnectorStyle data-testid="providerName">
                Connected with {connectorName}
              </WalletModalConnectorStyle>
            )}

            <WalletModalBalanceWrapper>
              <Text size={12}>
                {isTokenDataLoading ? 'Loading...' : 'Balance'}
              </Text>
              {tokenData ? (
                <Text size={12} data-testid="balance">
                  &nbsp;
                  {`${tokenData.balance} ${tokenData.symbol}`}
                </Text>
              ) : null}
            </WalletModalBalanceWrapper>
          </FlexWrapper>

          {disconnect && (
            <WalletModalDisconnectStyle
              size="xs"
              variant="outlined"
              onClick={handleDisconnect}
              data-testid="disconnectBtn"
            >
              Disconnect
            </WalletModalDisconnectStyle>
          )}
        </WalletModalConnectedStyle>

        <WalletModalAccountStyle>
          <Identicon address={address ?? ''} />
          <WalletModalAddressStyle>
            <Address
              data-testid="connectedAddress"
              address={address ?? ''}
              symbols={6}
            />
          </WalletModalAddressStyle>
        </WalletModalAccountStyle>

        <WalletModalActionsStyle>
          <ButtonIcon
            data-testid="copyAddressBtn"
            onClick={handleCopy}
            icon={<Copy />}
            size="xs"
            variant="ghost"
          >
            Copy address
          </ButtonIcon>
          <ButtonIcon
            data-testid="etherscanBtn"
            onClick={() =>
              openWindow(getEtherscanAddressLink(chainId, address ?? ''))
            }
            icon={<External />}
            size="xs"
            variant="ghost"
          >
            View on Etherscan
          </ButtonIcon>
        </WalletModalActionsStyle>
      </WalletModalContentStyle>
    </Modal>
  );
};
