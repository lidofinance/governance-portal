import { useLidoSDK } from 'providers/lido-sdk';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import {
  DualGovernance,
  StETH,
  EmergencyProtectedTimelock,
} from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { dgConfigProviderAbi, dgEscrowAbi } from 'abi/generated';
import { ProposalStatus } from '../proposals/types';
import {
  DualGovernanceConfig,
  DualGovernanceDetailedState,
  GovernanceState,
  VisibleGovernanceState,
} from '../types';
import { getAmountUntilVetoSignalling } from '../utils/get-amount-till-vetosignalling';

const WARNING_STATE_THRESHOLD_PERCENT = 33n;

export type DualGovernanceWidgetState = {
  status: GovernanceState;
  nextStatus: GovernanceState;
  visibleStatus: VisibleGovernanceState;
  totalStEthInEscrow: bigint;
  totalSupply: bigint;
  rageQuitSupportPercent: bigint;
  activeProposalsCount: number;
  secondSealRageQuitSupport: bigint;
  config: DualGovernanceConfig;
  stateDetails: DualGovernanceDetailedState;
  amountUntilVetoSignalling: { percentage: string; value: string } | null;
  firstSealRageQuitSupport: bigint;
};

export const useDualGovernanceWidgetState = () => {
  const { chainId } = useLidoSDK();
  const dualGovernance = useReadContract(DualGovernance);
  const stEth = useReadContract(StETH);
  const emergencyProtectedTimelock = useReadContract(
    EmergencyProtectedTimelock,
  );

  const vetoSignallingEscrowGetter = useReadContractGetter(dgEscrowAbi);
  const dualGovernanceConfigProviderGetter =
    useReadContractGetter(dgConfigProviderAbi);

  return useQuery({
    queryKey: ['dual-governance-widget-data', chainId],
    queryFn: async () => {
      const [
        isEmergencyModeActive,
        vetoSignallingAddress,
        configAddress,
        stateDetails,
      ] = await Promise.all([
        emergencyProtectedTimelock.readContract('isEmergencyModeActive'),
        dualGovernance.readContract('getVetoSignallingEscrow'),
        dualGovernance.readContract('getConfigProvider'),
        dualGovernance.readContract('getStateDetails'),
      ]);

      const vetoSignallingEscrow = vetoSignallingEscrowGetter(
        vetoSignallingAddress,
      );

      const dualGovernanceConfigProvider =
        dualGovernanceConfigProviderGetter(configAddress);

      const [lockedAssets, rageQuitSupportPercent] = await Promise.all([
        vetoSignallingEscrow('getSignallingEscrowDetails'),
        vetoSignallingEscrow('getRageQuitSupport'),
      ]);

      const unfinalizedShares =
        lockedAssets.totalStETHLockedShares +
        lockedAssets.totalUnstETHUnfinalizedShares;

      const [totalSupply, pooledEthByShares] = await Promise.all([
        stEth.readContract('totalSupply'),
        stEth.readContract('getPooledEthByShares', [unfinalizedShares]),
      ]);

      const totalStEthInEscrow =
        pooledEthByShares + lockedAssets.totalUnstETHFinalizedETH;

      const [config, proposalsCount] = await Promise.all([
        dualGovernanceConfigProvider('getDualGovernanceConfig'),
        emergencyProtectedTimelock.readContract('getProposalsCount'),
      ]);

      const proposalIds = Array.from(
        { length: Number(proposalsCount) },
        (_, i) => BigInt(i + 1),
      );

      const proposals = await Promise.all(
        proposalIds.map((id) =>
          emergencyProtectedTimelock.readContract('getProposal', [id]),
        ),
      );

      const activeProposalsCount = proposals.filter(
        (proposal) =>
          proposal[0].status === ProposalStatus.Submitted ||
          proposal[0].status === ProposalStatus.Scheduled,
      ).length;

      const { firstSealRageQuitSupport, secondSealRageQuitSupport } = config;

      const warningStateThreshold =
        (firstSealRageQuitSupport * WARNING_STATE_THRESHOLD_PERCENT) / 100n;

      let visibleStatus: VisibleGovernanceState = VisibleGovernanceState.Normal;

      if (
        stateDetails.persistedState === GovernanceState.Normal &&
        rageQuitSupportPercent >= warningStateThreshold
      ) {
        visibleStatus = VisibleGovernanceState.Warning;
      }

      if (isEmergencyModeActive) {
        visibleStatus = VisibleGovernanceState.Emergency;
      }

      let amountUntilVetoSignalling: {
        percentage: string;
        value: string;
      } | null = null;
      if (
        stateDetails.persistedState ===
        GovernanceState.VetoSignallingDeactivation
      ) {
        amountUntilVetoSignalling = getAmountUntilVetoSignalling(
          stateDetails,
          config,
          totalSupply,
        );
      }
      return {
        visibleStatus,
        status: stateDetails.persistedState,
        nextStatus: stateDetails.effectiveState,
        totalStEthInEscrow,
        totalSupply,
        rageQuitSupportPercent,
        activeProposalsCount,
        config,
        stateDetails,
        amountUntilVetoSignalling,
        firstSealRageQuitSupport,
        secondSealRageQuitSupport,
      };
    },
  });
};
