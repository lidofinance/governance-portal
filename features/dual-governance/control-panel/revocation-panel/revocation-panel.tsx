import React, { useCallback, useMemo } from 'react';
import { Loader } from '@lidofinance/lido-ui';

import {
  ClaimNftText,
  NoTokensMessage,
  RevocableTokenItemStyled,
} from './style';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { Text } from 'shared/components/text';
import { VetoSignallingTokens } from './veto-signalling-tokens';
import { RageQuitTokens } from './rage-quit-tokens';
import { useClaimCustomNftAction } from '../../write-actions/claim-custom-nft';
import { useClaimCustomNftModal } from '../../modals/modal-manager';
import { Button } from 'shared/components/button';
import { FlexWrapper } from 'shared/styled-components';
import { Box } from 'shared/components/box';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { WithdrawalQueue } from 'shared/blockchain/contracts';
import { useIsSupportedChain } from 'shared/hooks/use-is-supported-chain';
import { useEscrowContext } from 'providers/escrow';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';

export const RevocationPanel = () => {
  const {
    isLoading: isDualGovernanceStateLoading,
    refetch: refetchDualGovernanceState,
  } = useDualGovernanceStateContext();

  const { historicalEscrowAddresses, vetoSignallingAddress } =
    useEscrowContext();

  const isSupportedChain = useIsSupportedChain();
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

  const withdrawalQueueContract = useReadContract(WithdrawalQueue);

  const vetoSignallingEscrows = useMemo(() => {
    if (!vetoSignallingAddress || !escrowBalances) {
      return [];
    }
    return [
      escrowBalances.escrowBalances.find(
        (escrowBalance) =>
          escrowBalance.escrowAddress.toLowerCase() ===
          vetoSignallingAddress.toLowerCase(),
      ),
    ];
  }, [escrowBalances, vetoSignallingAddress]);

  const rageQuitEscrows = useMemo(() => {
    if (!vetoSignallingAddress || !escrowBalances) {
      return [];
    }

    return escrowBalances.escrowBalances.filter(
      (escrowBalance) =>
        escrowBalance.escrowAddress.toLowerCase() !==
        vetoSignallingAddress.toLowerCase(),
    );
  }, [escrowBalances, vetoSignallingAddress]);

  if (isLoading) {
    return <Loader />;
  }
  if (!escrowBalances || escrowBalances.totalLockedSharesInEscrows === 0n) {
    return (
      <>
        {historicalEscrowAddresses && historicalEscrowAddresses.length > 0 && (
          <Box marginBottom="20px">
            <RevocableTokenItemStyled>
              <FlexWrapper
                $alignItems="center"
                $justifyContent="space-between"
                $width="100%"
              >
                <ClaimNftText>Claim Non-Owned NFT by ID</ClaimNftText>
                <Button
                  onClick={() =>
                    openCustomNftModal({
                      claimNFTs,
                      historicalEscrowAddresses,
                    })
                  }
                  size="sm"
                  disabled={!isSupportedChain}
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

  return (
    <>
      {historicalEscrowAddresses && historicalEscrowAddresses.length > 0 && (
        <Box marginBottom="20px">
          <RevocableTokenItemStyled>
            <FlexWrapper
              $alignItems="center"
              $justifyContent="space-between"
              $width="100%"
            >
              <ClaimNftText>Claim Non-Owned NFT by ID</ClaimNftText>
              <Button
                onClick={() =>
                  openCustomNftModal({
                    claimNFTs,
                    historicalEscrowAddresses,
                  })
                }
                size="sm"
                disabled={!isSupportedChain}
              >
                Claim
              </Button>
            </FlexWrapper>
          </RevocableTokenItemStyled>
        </Box>
      )}
      {vetoSignallingEscrows[0] && (
        <VetoSignallingTokens
          key={vetoSignallingEscrows[0].escrowAddress}
          escrowAddress={vetoSignallingEscrows[0].escrowAddress}
          escrowBalance={vetoSignallingEscrows[0]}
          assetUnlockTimestamp={escrowBalances.assetUnlockTimestamp}
          onConfirm={updateDualGovernanceState}
        />
      )}
      {rageQuitEscrows.map((escrowBalance) => (
        <RageQuitTokens
          key={`revoke-item-${escrowBalance.escrowAddress}`}
          escrowBalance={escrowBalance}
          onConfirm={updateDualGovernanceState}
          claimNFTs={claimNFTs}
          withdrawalQueueContract={withdrawalQueueContract}
        />
      ))}
    </>
  );
};
