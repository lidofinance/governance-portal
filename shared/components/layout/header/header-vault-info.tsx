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
import { useEscrowContext } from 'providers/escrow';
import Link from 'next/link';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';

export const HeaderVaultInfo = () => {
  const [isVaultInfoMenuOpen, setVaultInfoMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress, rageQuitAddress } = useEscrowContext();

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
            {data.totalLockedSharesInEscrows > 0 && (
              <Text size={22} weight={500}>
                Your tokens in DG
              </Text>
            )}
            {data.totalLockedSharesInEscrows === 0n && (
              <Text size={22} weight={500}>
                You don’t have any assets <br /> in Dual Governance contracts
                yet
              </Text>
            )}
          </VaultInfoPopupTitle>
          {data?.vetoSignallingBalances?.length > 0 ? (
            <>
              {data.vetoSignallingBalances.map((balance) => {
                const hasLockedShares = balance.totalLockedShares > 0n;

                if (!hasLockedShares) return null;

                return (
                  <div key={balance.escrowAddress}>
                    <VaultInfoSubtitle>
                      Tokens in{' '}
                      {balance.escrowAddress.toLowerCase() ===
                      vetoSignallingAddress?.toLowerCase()
                        ? 'VetoSignalling '
                        : 'RageQuit '}
                      <Link
                        target="_blank"
                        href={getEtherscanAddressLink(
                          chainId,
                          balance.escrowAddress,
                        )}
                      >
                        {'contract '}
                        <ExternalLinkIcon />
                      </Link>
                    </VaultInfoSubtitle>
                    <TokensList>
                      <TokenBalance
                        token={Token.stETH}
                        balance={balance.stETHLockedShares}
                        showZeroBalance={false}
                      />
                      <TokenBalance
                        token={Token.unstETH}
                        balance={balance.unstETHLockedShares}
                        showZeroBalance={false}
                      />
                    </TokensList>
                  </div>
                );
              })}
            </>
          ) : null}
          {data.rageQuitsBalance.totalLockedShares ? (
            <>
              <VaultInfoSubtitle>
                Tokens in RageQuit contract{' '}
                {rageQuitAddress ? (
                  <Link
                    target="_blank"
                    href={getEtherscanAddressLink(chainId, rageQuitAddress)}
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
