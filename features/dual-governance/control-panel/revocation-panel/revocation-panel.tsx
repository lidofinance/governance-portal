import { useCallback } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { Address } from 'viem';

import { NoTokensMessage, RevocableTokenItemStyled } from './style';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { Text } from 'shared/components/text';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VetoSignallingTokens } from './veto-signalling-tokens';
import { RageQuitTokens } from './rage-quit-tokens';
import { useClaimCustomNftAction } from '../../write-actions/claim-custom-nft';
import { useClaimCustomNftModal } from '../../modals/modal-manager';
import { Button } from 'shared/components/button';
import { FlexWrapper } from 'shared/styled-components';
import { Box } from 'shared/components/box';
import { VisibleGovernanceState } from '../../types';

export const RevocationPanel = () => {
  const {
    isLoading: isDualGovernanceStateLoading,
    refetch: refetchDualGovernanceState,
    visibleState,
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
        {visibleState === VisibleGovernanceState.BlockedRageQuit && (
          <Box marginBottom="20px">
            <RevocableTokenItemStyled>
              <FlexWrapper
                $alignItems="center"
                $justifyContent="space-between"
                $width="100%"
              >
                <Text size={22} weight={600}>
                  Claim Non-Owned NFT by ID
                </Text>
                <Button
                  onClick={() =>
                    openCustomNftModal({
                      claimNFTs,
                    })
                  }
                  size="sm"
                >
                  Claim
                </Button>
              </FlexWrapper>
            </RevocableTokenItemStyled>
          </Box>
        )}
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
    <>
      {visibleState === VisibleGovernanceState.BlockedRageQuit && (
        <Box marginBottom="20px">
          <RevocableTokenItemStyled>
            <FlexWrapper
              $alignItems="center"
              $justifyContent="space-between"
              $width="100%"
            >
              <Text size={22} weight={600}>
                Claim Non-Owned NFT by ID
              </Text>
              <Button
                onClick={() =>
                  openCustomNftModal({
                    claimNFTs,
                  })
                }
                size="sm"
              >
                Claim
              </Button>
            </FlexWrapper>
          </RevocableTokenItemStyled>
        </Box>
      )}
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
    </>
  );
};
