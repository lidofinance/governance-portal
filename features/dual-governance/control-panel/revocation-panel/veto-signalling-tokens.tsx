import { useCallback, useRef, useState } from 'react';
import { RevokeStEthPopup } from './revoke-steth-popup';
import { Token } from 'shared/blockchain/types';
import invariant from 'tiny-invariant';
import { useRevokeTokensAction } from 'features/dual-governance/write-actions/revoke-tokens';
import { Text } from 'shared/components/text';
import { RevocableTokensList } from './style';
import { RevocableTokenItem } from './revocable-token-item';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useRevokeUnstethModal } from 'features/dual-governance/modals/modal-manager';

type Props = {
  vetoSignallingBalance: {
    unstETHIdsCount: bigint;
    stETHLockedShares: bigint;
    unstETHLockedShares: bigint;
    lastAssetsLockTimestamp: number;
    totalLockedShares: bigint;
    wstETHLockedShares: bigint;
  };
  assetUnlockTimestamp: number | undefined;
  onConfirm: () => Promise<void>;
};

export const VetoSignallingTokens = ({
  vetoSignallingBalance,
  assetUnlockTimestamp,
  onConfirm,
}: Props) => {
  const {
    totalLockedShares,
    stETHLockedShares,
    wstETHLockedShares,
    unstETHLockedShares,
    unstETHIdsCount,
  } = vetoSignallingBalance;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupAnchorRef = useRef<HTMLDivElement>(null);
  const { openModal } = useRevokeUnstethModal();

  const revokeTokens = useRevokeTokensAction({ onConfirm });

  const { timeFormatted: assetsLockCountdown, isFinished: isUnlockPossible } =
    useCountdown(assetUnlockTimestamp ?? 0);

  const handleRevokeTokens = useCallback(
    (token: Token) => async (selectedNftIds?: string[]) => {
      if (token === Token.unstETH) {
        invariant(selectedNftIds?.length, 'ids must be presented');

        await revokeTokens({ token, ids: selectedNftIds });
      } else {
        setIsPopupOpen(false);

        const amount =
          token === Token.stETH ? stETHLockedShares : wstETHLockedShares;
        invariant(amount, 'Amount is not defined');

        await revokeTokens({ amount, token });
      }
    },
    [revokeTokens, stETHLockedShares, wstETHLockedShares],
  );

  if (!totalLockedShares) {
    return null;
  }

  return (
    <>
      <RevokeStEthPopup
        anchorRef={popupAnchorRef}
        isOpen={isPopupOpen}
        stEthAmount={stETHLockedShares}
        wstEthAmount={wstETHLockedShares}
        onClose={() => setIsPopupOpen(false)}
        onRevoke={handleRevokeTokens}
      />
      <Text>Tokens in VetoSignalling contract</Text>
      <RevocableTokensList>
        <RevocableTokenItem
          ref={popupAnchorRef}
          token={Token.stETH}
          amount={stETHLockedShares}
          onClick={() => setIsPopupOpen(true)}
          isLocked={!isUnlockPossible}
          unlockCountdown={assetsLockCountdown}
        />
        <RevocableTokenItem
          token={Token.unstETH}
          amount={unstETHLockedShares}
          onClick={() =>
            openModal({ onRevoke: handleRevokeTokens(Token.unstETH) })
          }
          isLocked={!isUnlockPossible}
          unlockCountdown={assetsLockCountdown}
          addOnText={`${unstETHIdsCount} NFT`}
        />
      </RevocableTokensList>
    </>
  );
};
