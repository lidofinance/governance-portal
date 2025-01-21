import { useCallback } from 'react';
import { Loader } from '@lidofinance/lido-ui';

import { NoTokensMessage } from './style';
import { useEscrowBalances } from 'features/dual-governance/hooks/use-escrow-balances';
import { Text } from 'shared/components/text';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { VetoSignallingTokens } from './veto-signalling-tokens';
import { RageQuitTokens } from './rage-quit-tokens';

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

  const updateDualGovernanceState = useCallback(async () => {
    await Promise.allSettled([
      refetchDualGovernanceState(),
      refetchEscrowBalances(),
    ]);
  }, [refetchDualGovernanceState, refetchEscrowBalances]);

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
      <VetoSignallingTokens
        vetoSignallingBalance={escrowBalances.vetoSignallingBalance}
        assetUnlockTimestamp={escrowBalances.assetUnlockTimestamp}
        onConfirm={updateDualGovernanceState}
      />
      <RageQuitTokens
        rageQuitBalance={escrowBalances.rageQuitBalance}
        onConfirm={updateDualGovernanceState}
      />
    </div>
  );
};
