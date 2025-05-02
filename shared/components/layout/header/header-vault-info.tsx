import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { ExternalLinkIcon, VaultIcon } from 'shared/components/icons';
import { StyledPopupMenu } from 'shared/styled-components';
import {
  TokensList,
  VaultInfoButton,
  VaultInfoLoader,
  VaultInfoPopupTitle,
  VaultInfoSubtitle,
} from './style';
import { Token } from 'shared/blockchain/types';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { formatEth } from 'shared/blockchain/utils';
import { TokenBalance } from 'shared/components/token-balance';
import { Text } from 'shared/components/text';
import { useDualGovernanceContext } from 'providers/dual-governance';
import Link from 'next/link';
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { useLidoSDK } from 'providers/lido-sdk';
import { CHAINS } from '@lido-sdk/constants';

export const HeaderVaultInfo = () => {
  const [isVaultInfoMenuOpen, setVaultInfoMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress, rageQuitAddress } = useDualGovernanceContext();

  const vaultInfoRef = useRef(null);

  const { data, isLoading } = useEscrowBalances();

  if (!isConnected) {
    return null;
  }

  return (
    <>
      <VaultInfoButton
        ref={vaultInfoRef}
        onClick={() => setVaultInfoMenuOpen(true)}
      >
        <VaultIcon />
        {isLoading || !data ? (
          <VaultInfoLoader />
        ) : (
          `${formatEth(data.totalLockedSharesInEscrows)} stETH`
        )}
      </VaultInfoButton>
      {data ? (
        <StyledPopupMenu
          open={isVaultInfoMenuOpen}
          onClose={() => setVaultInfoMenuOpen(false)}
          anchorRef={vaultInfoRef}
          placement="bottomRight"
        >
          <VaultInfoPopupTitle>
            <Text size={28} weight={500}>
              {data.totalLockedSharesInEscrows > 0
                ? 'Your tokens in DG'
                : 'You have no tokens in DG'}
            </Text>
          </VaultInfoPopupTitle>
          {data?.vetoSignallingBalance.totalLockedShares ? (
            <>
              <VaultInfoSubtitle>
                Tokens in VetoSignalling{' '}
                {vetoSignallingAddress ? (
                  <Link
                    target="_blank"
                    href={getEtherscanAddressLink(
                      chainId as unknown as CHAINS,
                      vetoSignallingAddress,
                    )}
                  >
                    {'contract '}
                    <ExternalLinkIcon />
                  </Link>
                ) : (
                  'contract'
                )}
              </VaultInfoSubtitle>
              <TokensList>
                <TokenBalance
                  token={Token.stETH}
                  balance={data.vetoSignallingBalance.stETHLockedShares}
                  showZeroBalance={false}
                />
                <TokenBalance
                  token={Token.unstETH}
                  balance={data.vetoSignallingBalance.unstETHLockedShares}
                  showZeroBalance={false}
                />
              </TokensList>
            </>
          ) : null}
          {data.rageQuitsBalance.totalLockedShares ? (
            <>
              <VaultInfoSubtitle>
                Tokens in RageQuit contract{' '}
                {rageQuitAddress ? (
                  <Link
                    target="_blank"
                    href={getEtherscanAddressLink(
                      chainId as unknown as CHAINS,
                      rageQuitAddress,
                    )}
                  >
                    {'contract '}
                    <ExternalLinkIcon />
                  </Link>
                ) : (
                  'contract'
                )}
              </VaultInfoSubtitle>
              <TokensList>
                <TokenBalance
                  token={Token.stETH}
                  balance={
                    data.rageQuitsBalance
                      .totalStETHLockedSharesInRageQuitEscrows
                  }
                  showZeroBalance={false}
                />
                <TokenBalance
                  token={Token.unstETH}
                  balance={
                    data.rageQuitsBalance
                      .totalUnstETHLockedSharesInRageQuitEscrows
                  }
                  showZeroBalance={false}
                />
              </TokensList>
            </>
          ) : null}
        </StyledPopupMenu>
      ) : null}
    </>
  );
};
