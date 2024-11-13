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
import { Button } from 'shared/components/button';
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
        disabled={!data?.totalSum}
      >
        <VaultIcon />
        {isLoading ? (
          <VaultInfoLoader />
        ) : data ? (
          `${formatEth(data.totalSum)} stETH`
        ) : (
          'ERROR'
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
            <Button>Manage</Button>
          </VaultInfoPopupTitle>
          {data?.vetoSignalingSum && data.vetoSignalingSum > 0 ? (
            <>
              <VaultInfoSubtitle>
                Tokens in VetoSignaling contract
              </VaultInfoSubtitle>
              <TokensList>
                <TokenBalance
                  token={Token.stETH}
                  balance={data.vetoSignalBalance.stETHLockedShares}
                />
                <TokenBalance
                  token={Token.unstETH}
                  balance={data.vetoSignalBalance.unstETHLockedShares}
                />
              </TokensList>
            </>
          ) : null}
          {data?.rageQuitSum && data.rageQuitSum > 0 ? (
            <>
              <VaultInfoSubtitle>Tokens in RageQuit contract</VaultInfoSubtitle>
              <TokensList>
                <TokenBalance
                  token={Token.stETH}
                  balance={data.rageQuitBalance.stETHLockedShares}
                />
                <TokenBalance
                  token={Token.unstETH}
                  balance={data.rageQuitBalance.unstETHLockedShares}
                />
              </TokensList>
            </>
          ) : null}
        </StyledPopupMenu>
      ) : null}
    </>
  );
};
