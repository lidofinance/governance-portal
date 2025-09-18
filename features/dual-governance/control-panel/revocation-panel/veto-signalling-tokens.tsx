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
import { useEscrowContext } from 'providers/escrow';
import { Link } from '@lidofinance/lido-ui';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { ExternalLinkIcon } from 'shared/components/icons';
import { useLidoSDK } from 'providers/lido-sdk';
import { useEscrowUnstethBalance } from '../../hooks/use-escrow-unsteth-balance';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { Address } from 'viem';

type Props = {
  escrowBalance: {
    unstETHIdsCount: bigint;
    stETHLockedShares: bigint;
    unstETHLockedShares: bigint;
    lastAssetsLockTimestamp: number;
    totalLockedShares: bigint;
  };
  escrowAddress: Address;
  assetUnlockTimestamp: number | undefined;
  onConfirm: () => Promise<void>;
};

export const VetoSignallingTokens = ({
  escrowBalance,
  escrowAddress,
  assetUnlockTimestamp,
  onConfirm,
}: Props) => {
  const isSupportedChain = useIsSupportedChain();
  const {
    totalLockedShares,
    stETHLockedShares,
    unstETHLockedShares,
    unstETHIdsCount,
  } = escrowBalance;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupAnchorRef = useRef<HTMLDivElement>(null);
  const { openModal } = useSelectUnstethModal();

  const { data } = useEscrowUnstethBalance(escrowAddress);

  const { chainId } = useLidoSDK();

  const { vetoSignallingAddress } = useEscrowContext();

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

        const amount = stETHLockedShares;
        invariant(amount, 'Amount is not defined');

        await revokeTokens({
          amount,
          token,
          escrowAddress: vetoSignallingAddress,
        });
      }
    },
    [revokeTokens, stETHLockedShares, vetoSignallingAddress],
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
        onClose={() => setIsPopupOpen(false)}
        onRevoke={handleRevokeTokens}
      />
      <Text>
        Tokens in{' '}
        {escrowAddress.toLowerCase() === vetoSignallingAddress?.toLowerCase()
          ? 'VetoSignalling '
          : 'RageQuit '}
        {escrowAddress ? (
          <Link href={getEtherscanAddressLink(chainId, escrowAddress)}>
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
          isLocked={isLocked || !isSupportedChain}
          unlockCountdown={assetsLockCountdown}
          actionLabel="Revoke"
        />
        {data && data.length > 0 && (
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
            isLocked={isLocked || !isSupportedChain}
            unlockCountdown={assetsLockCountdown}
            amountLabel={`${unstETHIdsCount} NFT`}
            actionLabel="Revoke"
          />
        )}
      </RevocableTokensList>
    </>
  );
};
