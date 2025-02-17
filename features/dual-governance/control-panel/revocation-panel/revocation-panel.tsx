import { useCallback } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { Address } from 'viem';

import { NftClaimTrigger, NoTokensMessage } from './style';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { Text } from 'shared/components/text';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VetoSignallingTokens } from './veto-signalling-tokens';
import { RageQuitTokens } from './rage-quit-tokens';
import { useClaimCustomNftAction } from '../../write-actions/claim-custom-nft';
import { useClaimCustomNftModal } from '../../modals/modal-manager';

export const RevocationPanel = () => {
  const {
    isLoading: isDualGovernanceStateLoading,
    refetch: refetchDualGovernanceState,
  } = useDualGovernanceContext();
  const {
    data: escrowBalances,
    isLoading: isEscrowBalanceDataLoading,
    refetch: refetchEscrowBalances,
  } = useEscrowBalances();

  const isLoading = isDualGovernanceStateLoading || isEscrowBalanceDataLoading;
  const claimNFTs = useClaimCustomNftAction();
  const { openModal: openCustomNftModal } = useClaimCustomNftModal();

  const updateDualGovernanceState = useCallback(async () => {
    await Promise.allSettled([
      refetchDualGovernanceState(),
      refetchEscrowBalances(),
    ]);
  }, [refetchDualGovernanceState, refetchEscrowBalances]);

  if (isLoading) {
    return <Loader />;
  }
  if (!escrowBalances || escrowBalances.totalLockedSharesInEscrows === 0n) {
    return (
      <>
        <NftClaimTrigger
          onClick={() =>
            openCustomNftModal({
              claimNFTs,
            })
          }
        >
          Claim custom nft
        </NftClaimTrigger>
        <NoTokensMessage>
          <Text color="secondary" size={22} weight={600}>
            You have no tokens in Dual Governance
          </Text>
        </NoTokensMessage>
      </>
    );
  }

  const rageQuitBalances = Object.keys(
    escrowBalances.rageQuitsBalance.historicalBalances,
  ) as Address[];

  const mappedRageQuitBalances = rageQuitBalances
    .map((rageQuitEscrowAddress) => ({
      rageQuitEscrowAddress,
      ...escrowBalances.rageQuitsBalance.historicalBalances[
        rageQuitEscrowAddress
      ],
    }))
    .filter((balanceRecord) => balanceRecord.totalLockedShares > 0);

  return (
    <div>
      <NftClaimTrigger
        onClick={() =>
          openCustomNftModal({
            claimNFTs,
          })
        }
      >
        Claim custom nft
      </NftClaimTrigger>
      <VetoSignallingTokens
        vetoSignallingBalance={escrowBalances.vetoSignallingBalance}
        assetUnlockTimestamp={escrowBalances.assetUnlockTimestamp}
        onConfirm={updateDualGovernanceState}
      />
      {mappedRageQuitBalances.map((balanceRecord) => (
        <RageQuitTokens
          key={balanceRecord.rageQuitEscrowAddress}
          rageQuitBalance={balanceRecord}
          onConfirm={updateDualGovernanceState}
          claimNFTs={claimNFTs}
        />
      ))}
    </div>
  );
};
