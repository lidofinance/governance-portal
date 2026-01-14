import { GovernanceState, VisibleGovernanceState } from '../types';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import invariant from 'tiny-invariant';
import { useDualGovernanceConfig } from './use-dual-governance-config';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { dgEscrowAbi } from 'abi/generated';
import { useCurrentVetoSignallingAddress } from './use-current-veto-signalling-address';

const NORMAL_WARNING_STATE_THRESHOLD_PERCENT = 33n;

type Props = {
  persistedState: GovernanceState;
  isEmergencyModeActive: boolean | undefined;
  isEmergencyModeActiveLoading: boolean;
};

export const useDualGovernanceVisibleState = ({
  persistedState,
  isEmergencyModeActive,
  isEmergencyModeActiveLoading,
}: Props) => {
  invariant(persistedState !== undefined, 'Persisted state must be provided');

  const { data: currentVetoSignallingAddress } =
    useCurrentVetoSignallingAddress();

  const { data: dualGovernanceConfig } = useDualGovernanceConfig();

  const { chainId } = useLidoSDK();

  const readEscrowGetter = useReadContractGetter(dgEscrowAbi);
  const readVetoSignalling = currentVetoSignallingAddress
    ? readEscrowGetter(currentVetoSignallingAddress)
    : null;

  const { data: currentRageQuitSupport } = useQuery<bigint>({
    queryKey: ['currentRageQuitSupport', chainId],
    staleTime: 5000,
    enabled:
      !isEmergencyModeActiveLoading &&
      !!currentVetoSignallingAddress &&
      !!readVetoSignalling,
    queryFn: async () => {
      if (!readVetoSignalling) {
        return 0n;
      }

      try {
        return await readVetoSignalling('getRageQuitSupport');
      } catch (e) {
        console.error(`Couldn't get RageQuitSupport:`, e);
        return 0n;
      }
    },
  });

  const warningStateThreshold = dualGovernanceConfig
    ? (dualGovernanceConfig.firstSealRageQuitSupport *
        NORMAL_WARNING_STATE_THRESHOLD_PERCENT) /
      100n
    : null;

  let visibleState: VisibleGovernanceState = 'Loading';

  if (isEmergencyModeActive) {
    visibleState = 'Emergency';
  } else {
    switch (persistedState) {
      case GovernanceState.Normal:
        if (
          warningStateThreshold &&
          currentRageQuitSupport &&
          currentRageQuitSupport >= warningStateThreshold
        ) {
          visibleState = 'Warning';
        } else {
          visibleState = 'Normal';
        }
        break;
      case GovernanceState.VetoSignalling:
        visibleState = 'BlockedVetoSignalling';
        break;
      case GovernanceState.VetoSignallingDeactivation:
        visibleState = 'BlockedDeactivation';
        break;
      case GovernanceState.RageQuit:
        visibleState = 'BlockedRageQuit';
        break;
      case GovernanceState.VetoCooldown:
        visibleState = 'Cooldown';
        break;
      case GovernanceState.Unset:
        visibleState = 'Unset';
        break;
    }
  }

  return visibleState;
};
