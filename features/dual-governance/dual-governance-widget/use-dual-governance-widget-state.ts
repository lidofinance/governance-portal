import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EmergencyProtectedTimelock } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { ProposalStatus } from '../proposals/types';
import { GovernanceState, VisibleGovernanceState } from '../types';
import { getAmountUntilVetoSignalling } from '../utils/get-amount-till-vetosignalling';
import { useDualGovernanceStateContext } from 'providers/dual-governance-state';
import { useEscrowContext } from 'providers/escrow';
import { useDualGovernanceConfig } from '../hooks/use-dual-governance-config';
import { useMemo } from 'react';

export type DualGovernanceWidgetState = {
  status: GovernanceState;
  nextStatus: GovernanceState;
  visibleStatus: VisibleGovernanceState;
  totalStEthInEscrow: bigint;
  totalSupply: bigint;
  activeProposalsCount: number;
  secondSealRageQuitSupport: bigint;
  amountUntilVetoSignalling: { percentage: string; value: string } | null;
};

type Result = {
  data: DualGovernanceWidgetState;
  isLoading: boolean;
};

export const useDualGovernanceWidgetState = (): Result => {
  const { chainId } = useLidoSDK();
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const { data: dgConfig, isLoading: isConfigLoading } =
    useDualGovernanceConfig();
  const {
    visibleState,
    detailedState,
    isLoading: isStateContextLoading,
  } = useDualGovernanceStateContext();
  const {
    totalStEthInEscrow,
    stEthTotalSupply,
    isLoading: isEscrowContextLoading,
  } = useEscrowContext();

  const { data, isLoading } = useQuery({
    queryKey: ['dg-widget-active-proposals-count', chainId],
    queryFn: async () => {
      const proposalsCount =
        await emergencyProtectedTimelock.readContract('getProposalsCount');

      const proposalIds = Array.from(
        { length: Number(proposalsCount) },
        (_, i) => BigInt(i + 1),
      );

      const proposals = await Promise.all(
        proposalIds.map((id) =>
          emergencyProtectedTimelock.readContract('getProposal', [id]),
        ),
      );

      return proposals.filter(
        (proposal) =>
          proposal[0].status === ProposalStatus.Submitted ||
          proposal[0].status === ProposalStatus.Scheduled,
      ).length;
    },
  });

  const amountUntilVetoSignalling = useMemo(() => {
    if (
      detailedState.persistedState !==
        GovernanceState.VetoSignallingDeactivation ||
      !dgConfig ||
      !stEthTotalSupply
    ) {
      return null;
    }
    return getAmountUntilVetoSignalling(
      detailedState,
      dgConfig,
      stEthTotalSupply,
    );
  }, [detailedState, dgConfig, stEthTotalSupply]);

  return {
    data: {
      visibleStatus: visibleState,
      status: detailedState.persistedState,
      nextStatus: detailedState.effectiveState,
      activeProposalsCount: data ?? 0,
      totalStEthInEscrow,
      amountUntilVetoSignalling,
      totalSupply: stEthTotalSupply ?? 0n,
      secondSealRageQuitSupport: dgConfig?.secondSealRageQuitSupport ?? 0n,
    },
    isLoading:
      isConfigLoading ||
      isStateContextLoading ||
      isEscrowContextLoading ||
      isLoading,
  };
};
