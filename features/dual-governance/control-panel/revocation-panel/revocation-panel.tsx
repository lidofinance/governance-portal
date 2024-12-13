import { useCallback, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { Loader } from '@lidofinance/lido-ui';
import { RevokeIcon } from 'shared/components/icons';

import {
  ContractLink,
  NoTokensMessage,
  RevocableTokenItem,
  RevocableTokensList,
  RevokePopupButton,
} from './style';
import { FlexWrapper } from 'shared/styled-components';
import { Token } from 'shared/blockchain/types';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { RevokeStEthPopup } from './revoke-steth-popup';
import { RevocableToken } from './types';
import { TokenBalance } from 'shared/components/token-balance';
import { Text } from 'shared/components/text';
import { Button } from 'shared/components/button';
import { useRevocationPanelProcessor } from './use-revocation-panel-processor';
import { useDualGovernanceContext } from 'providers/dual-governance';

export const RevocationPanel = () => {
  /**
   *  State
   */

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  /**
   *  Refs
   */

  const popupAnchorRef = useRef<HTMLDivElement>(null);

  /**
   *  Hooks data
   */
  const {
    isLoading: isDualGovernanceStateLoading,
    refetch: refetchDualGovernanceState,
  } = useDualGovernanceContext();
  const {
    data: escrowBalances,
    isLoading: isEscrowBalanceDataLoading,
    refetch: refetchEscrowBalances,
  } = useEscrowBalances();

  /**
   *  Handlers
   */
  const updateDualGovernanceState = useCallback(async () => {
    await Promise.allSettled([
      refetchDualGovernanceState(),
      refetchEscrowBalances(),
    ]);
  }, [refetchDualGovernanceState, refetchEscrowBalances]);

  const revokeStEthOrWstEth = useRevocationPanelProcessor({
    onConfirm: updateDualGovernanceState,
  });

  const handleRevokeTokens = useCallback(
    (token: RevocableToken) => async () => {
      const amount =
        token === Token.stETH
          ? escrowBalances?.vetoSignallingBalance.stETHLockedShares
          : escrowBalances?.vetoSharesInWstEth;

      invariant(amount, 'Amount is not defined');

      setIsPopupOpen(false);

      await revokeStEthOrWstEth({ amount, token });
    },
    [
      escrowBalances?.vetoSharesInWstEth,
      escrowBalances?.vetoSignallingBalance.stETHLockedShares,
      revokeStEthOrWstEth,
    ],
  );

  const isLoading = isDualGovernanceStateLoading || isEscrowBalanceDataLoading;

  if (isLoading) {
    return <Loader />;
  }

  if (!escrowBalances?.lockedSharesInEscrow) {
    return (
      <NoTokensMessage>
        <Text color="secondary" size={22} weight={600}>
          You have no tokens in Dual Governance
        </Text>
      </NoTokensMessage>
    );
  }

  return (
    <div>
      <RevokeStEthPopup
        anchorRef={popupAnchorRef}
        isOpen={isPopupOpen}
        stEthAmount={escrowBalances.vetoSignallingBalance.stETHLockedShares}
        wstEthAmount={escrowBalances.vetoSharesInWstEth}
        onClose={() => setIsPopupOpen(false)}
        onRevoke={handleRevokeTokens}
      />
      {Boolean(escrowBalances.vetoSignallingBalance.totalLockedShares) && (
        <div>
          <FlexWrapper $justifyContent="space-between">
            <Text>Tokens in VetoSignalling contract</Text>
            <ContractLink onClick={() => console.log('claim nft')}>
              Claim custom NFT
            </ContractLink>
          </FlexWrapper>
          <RevocableTokensList>
            {Boolean(
              escrowBalances.vetoSignallingBalance.stETHLockedShares,
            ) && (
              <RevocableTokenItem ref={popupAnchorRef}>
                <TokenBalance
                  token={Token.stETH}
                  balance={
                    escrowBalances.vetoSignallingBalance.stETHLockedShares
                  }
                />
                <RevokePopupButton onClick={() => setIsPopupOpen(true)}>
                  <Text size={14} color="secondary">
                    Revoke
                  </Text>
                  <RevokeIcon />
                </RevokePopupButton>
              </RevocableTokenItem>
            )}
            {Boolean(escrowBalances.vetoSignallingBalance.unstETHIdsCount) && (
              <RevocableTokenItem>
                <TokenBalance
                  token={Token.unstETH}
                  balance={
                    escrowBalances.vetoSignallingBalance.unstETHLockedShares
                  }
                  addOnText={`${escrowBalances.vetoSignallingBalance.unstETHIdsCount} NFT`}
                />
                <RevokePopupButton onClick={() => setIsPopupOpen(true)}>
                  <Text size={14} color="secondary">
                    Revoke
                  </Text>
                  <RevokeIcon />
                </RevokePopupButton>
              </RevocableTokenItem>
            )}
          </RevocableTokensList>
          <Button fullwidth>Revoke all</Button>
        </div>
      )}
      {Boolean(escrowBalances.rageQuitBalance.totalLockedShares) && (
        <Text>Tokens in RageQuit contract</Text>
      )}
    </div>
  );
};
