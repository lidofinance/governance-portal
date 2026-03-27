import { Fragment, useMemo, useRef, useState } from 'react';
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
import { useEscrowBalances } from '@dg/hooks/use-escrow-balances';
import { formatEth } from 'shared/blockchain/utils';
import { TokenBalance } from 'shared/components/token-balance';
import { Text } from 'shared/components/text';
import { useEscrowContext } from 'providers/escrow';
import Link from 'next/link';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { useStETHConversion } from '@dg/hooks/use-steth-conversion';

export const HeaderVaultInfo = () => {
  const [isVaultInfoMenuOpen, setVaultInfoMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress, rageQuitAddress } = useEscrowContext();

  const vaultInfoRef = useRef(null);

  const { data, isLoading } = useEscrowBalances();

  const {
    data: totalConvertedStETHLockedShares,
    isLoading: isTotalConvertedStETHLockedSharesLoading,
  } = useStETHConversion(
    data?.totalLockedSharesInEscrows ? data.totalLockedSharesInEscrows : 0n,
  );

  // It's always 1 contract ATM
  const vetoSignallingEscrows = useMemo(() => {
    if (!vetoSignallingAddress || !data) {
      return [];
    }
    return [
      data.escrowBalances.find(
        (escrowBalance) =>
          escrowBalance.escrowAddress.toLowerCase() ===
          vetoSignallingAddress.toLowerCase(),
      ),
    ];
  }, [data, vetoSignallingAddress]);

  const rageQuitEscrows = useMemo(() => {
    if (!vetoSignallingAddress || !data) {
      return [];
    }

    return data.escrowBalances.filter(
      (escrowBalance) =>
        escrowBalance.escrowAddress.toLowerCase() !==
        vetoSignallingAddress.toLowerCase(),
    );
  }, [data, vetoSignallingAddress]);

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
        {isLoading || isTotalConvertedStETHLockedSharesLoading ? (
          <VaultInfoLoader />
        ) : (
          `${formatEth(totalConvertedStETHLockedShares || data?.totalLockedSharesInEscrows || 0n)} stETH`
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
          {vetoSignallingEscrows[0] &&
            vetoSignallingEscrows[0].totalLockedShares > 0n && (
              <>
                <VaultInfoSubtitle>
                  Tokens in VetoSignalling
                  <Link
                    target="_blank"
                    href={getEtherscanAddressLink(
                      chainId,
                      vetoSignallingEscrows[0].escrowAddress,
                    )}
                  >
                    {' contract '}
                    <ExternalLinkIcon />
                  </Link>
                </VaultInfoSubtitle>
                <TokensList>
                  <TokenBalance
                    token={Token.stETH}
                    balance={vetoSignallingEscrows[0].stETHLockedShares}
                    showZeroBalance={false}
                    shouldConvertShares={true}
                  />
                  <TokenBalance
                    token={Token.unstETH}
                    balance={vetoSignallingEscrows[0].unstETHLockedShares}
                    showZeroBalance={false}
                    shouldConvertShares={true}
                  />
                </TokensList>
              </>
            )}
          {rageQuitEscrows.length > 0 &&
            rageQuitEscrows.map((escrowBalance) => (
              <Fragment key={escrowBalance.escrowAddress}>
                {escrowBalance.totalLockedShares > 0n ? (
                  <>
                    <VaultInfoSubtitle>
                      Tokens in RageQuit
                      {rageQuitAddress ? (
                        <Link
                          target="_blank"
                          href={getEtherscanAddressLink(
                            chainId,
                            escrowBalance.escrowAddress,
                          )}
                        >
                          {' contract '}
                          <ExternalLinkIcon />
                        </Link>
                      ) : (
                        'contract'
                      )}
                    </VaultInfoSubtitle>
                    <TokensList>
                      <TokenBalance
                        token={Token.stETH}
                        balance={escrowBalance.stETHLockedShares}
                        showZeroBalance={false}
                        shouldConvertShares={true}
                      />
                      <TokenBalance
                        token={Token.unstETH}
                        balance={escrowBalance.unstETHLockedShares}
                        showZeroBalance={false}
                        shouldConvertShares={true}
                      />
                    </TokensList>
                  </>
                ) : null}
              </Fragment>
            ))}
        </StyledPopupMenu>
      ) : null}
    </>
  );
};
