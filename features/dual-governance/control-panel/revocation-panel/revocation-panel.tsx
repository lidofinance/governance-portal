import { useCallback, useRef, useState } from 'react';
import invariant from 'tiny-invariant';
import { Loader } from '@lidofinance/lido-ui';

import { NoTokensMessage, RevocableTokensList } from './style';
import { FlexWrapper } from 'shared/styled-components';
import { Token } from 'shared/blockchain/types';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { RevokeStEthPopup } from './revoke-steth-popup';
import { Text } from 'shared/components/text';
import { useRevocationPanelProcessor } from './use-revocation-panel-processor';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useRevokeUnstethModal } from 'features/dual-governance/modals/modal-manager';
import { useRevokeUnstethAction } from 'features/dual-governance/write-actions/revoke-unsteth';
import { RevocableTokenItem } from './revocable-token-item';
import { useCountdown } from 'shared/hooks/use-countdown';

export const RevocationPanel = () => {
  /**
   *  State
   */

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { openModal } = useRevokeUnstethModal();

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

  const { timeFormatted: assetsLockCountdown, isFinished: isUnlockPossible } =
    useCountdown(escrowBalances?.assetUnlockTimestamp ?? 0);

  /**
   *  Handlers
   */
  const updateDualGovernanceState = useCallback(async () => {
    await Promise.allSettled([
      refetchDualGovernanceState(),
      refetchEscrowBalances(),
    ]);
  }, [refetchDualGovernanceState, refetchEscrowBalances]);

  const revokeUnsteth = useRevokeUnstethAction({
    onConfirm: updateDualGovernanceState,
  });

  const revokeStEthOrWstEth = useRevocationPanelProcessor({
    onConfirm: updateDualGovernanceState,
  });

  const handleRevokeTokens = useCallback(
    (token: Token) => async () => {
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
        <>
          <FlexWrapper $justifyContent="space-between">
            <Text>Tokens in VetoSignalling contract</Text>
            {/* <ContractLink onClick={() => console.log('claim nft')}>
              Claim custom NFT
            </ContractLink> */}
          </FlexWrapper>
          <RevocableTokensList>
            <RevocableTokenItem
              ref={popupAnchorRef}
              token={Token.stETH}
              amount={escrowBalances.vetoSignallingBalance.stETHLockedShares}
              onClick={() => setIsPopupOpen(true)}
              isLocked={!isUnlockPossible}
              unlockCountdown={assetsLockCountdown}
            />
            <RevocableTokenItem
              token={Token.unstETH}
              amount={escrowBalances.vetoSignallingBalance.unstETHLockedShares}
              onClick={() => openModal({ onRevoke: revokeUnsteth })}
              isLocked={!isUnlockPossible}
              unlockCountdown={assetsLockCountdown}
              addOnText={`${escrowBalances.vetoSignallingBalance.unstETHIdsCount} NFT`}
            />
          </RevocableTokensList>
          {/* <Button fullwidth>Revoke all</Button> */}
        </>
      )}
      {Boolean(escrowBalances.rageQuitBalance.totalLockedShares) && (
        <>
          <FlexWrapper $justifyContent="space-between">
            <Text>Tokens in RageQuit contract</Text>
          </FlexWrapper>
          <RevocableTokensList>
            <RevocableTokenItem
              token={Token.stETH}
              amount={escrowBalances.rageQuitBalance.stETHLockedShares}
            />
            <RevocableTokenItem
              token={Token.unstETH}
              amount={escrowBalances.rageQuitBalance.unstETHLockedShares}
              addOnText={`${escrowBalances.rageQuitBalance.unstETHIdsCount} NFT`}
            />
          </RevocableTokensList>
        </>
      )}
    </div>
  );
};
