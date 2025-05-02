import { useCallback, useRef, useState } from 'react';
import { RevokeStEthPopup } from './revoke-steth-popup';
import { Token } from 'shared/blockchain/types';
import invariant from 'tiny-invariant';
import { useRevokeTokensAction } from 'features/dual-governance/write-actions/revoke-tokens';
import { Text } from 'shared/components/text';
import { RevocableTokensList } from './style';
import { RevocableTokenItem } from './revocable-token-item';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useSelectUnstethModal } from 'features/dual-governance/modals/modal-manager';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { ExternalLinkIcon } from 'shared/components/icons';
import { useLidoSDK } from 'providers/lido-sdk';
import { useEscrowUnstethBalance } from '../../hooks/use-escrow-unsteth-balance';
import { CHAINS } from '@lido-sdk/constants';

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
  const { openModal } = useSelectUnstethModal();

  const { data } = useEscrowUnstethBalance();

  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress } = useDualGovernanceContext();

  const revokeTokens = useRevokeTokensAction({ onConfirm });

  const { timeFormatted: assetsLockCountdown, isFinished: isUnlockPossible } =
    useCountdown(assetUnlockTimestamp ?? 0);

  const handleRevokeTokens = useCallback(
    (token: Token) => async (selectedNftIds?: string[]) => {
      invariant(
        vetoSignallingAddress,
        'VetoSignalling address must be defined',
      );

      if (token === Token.unstETH) {
        invariant(selectedNftIds?.length, 'ids must be presented');

        await revokeTokens({
          token,
          selectedNftIds,
          escrowAddress: vetoSignallingAddress,
        });
      } else {
        setIsPopupOpen(false);

        const amount =
          token === Token.stETH ? stETHLockedShares : wstETHLockedShares;
        invariant(amount, 'Amount is not defined');

        await revokeTokens({
          amount,
          token,
          escrowAddress: vetoSignallingAddress,
        });
      }
    },
    [
      revokeTokens,
      stETHLockedShares,
      vetoSignallingAddress,
      wstETHLockedShares,
    ],
  );

  if (!totalLockedShares) {
    return null;
  }

  const isLocked = !isUnlockPossible;

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
      <Text>
        Tokens in VetoSignalling{' '}
        {vetoSignallingAddress ? (
          <Link
            href={getEtherscanAddressLink(
              chainId as unknown as CHAINS, // chains mismatch between @lido-sdk & lido-ethereum-sdk
              vetoSignallingAddress,
            )}
          >
            contract <ExternalLinkIcon />
          </Link>
        ) : (
          'contract'
        )}
      </Text>
      <RevocableTokensList>
        <RevocableTokenItem
          ref={popupAnchorRef}
          token={Token.stETH}
          amount={stETHLockedShares}
          onClick={() => setIsPopupOpen(true)}
          isLocked={isLocked}
          unlockCountdown={assetsLockCountdown}
          actionLabel="Revoke"
        />
        {data && (
          <RevocableTokenItem
            token={Token.unstETH}
            amount={unstETHLockedShares}
            onClick={() =>
              openModal({
                onConfirm: handleRevokeTokens(Token.unstETH),
                actionLabel: 'Revoke',
                unstETHRecords: data,
              })
            }
            isLocked={isLocked}
            unlockCountdown={assetsLockCountdown}
            amountLabel={`${unstETHIdsCount} NFT`}
            actionLabel="Revoke"
          />
        )}
      </RevocableTokensList>
    </>
  );
};
