import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { VaultIcon } from 'shared/components/icons';
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

export const HeaderVaultInfo = () => {
  const [isVaultInfoMenuOpen, setVaultInfoMenuOpen] = useState(false);
  const { isConnected } = useAccount();

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
        disabled={!data?.totalLockedSharesInEscrows}
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
              Your tokens in DG
            </Text>
          </VaultInfoPopupTitle>
          {data?.vetoSignallingBalance.totalLockedShares ? (
            <>
              <VaultInfoSubtitle>
                Tokens in VetoSignalling contract
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
              <VaultInfoSubtitle>Tokens in RageQuit contract</VaultInfoSubtitle>
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
