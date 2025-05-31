import { useDynamicDualGovernance } from './use-dynamic-dual-governance';
import { useContractAddress } from 'shared/blockchain/hooks/use-contract-address';
import { EmergencyGovernance } from 'shared/blockchain/contracts';

export const useIsEmergencyGovernanceActive = () => {
  const {
    currentDualGovernanceAddress,
    isLoading: isCurrentGovernanceAddressLoading,
  } = useDynamicDualGovernance();
  const emergencyGovernanceAddress = useContractAddress(EmergencyGovernance);

  if (isCurrentGovernanceAddressLoading) {
    return { isEmergencyModeActive: false, isLoading: true };
  }

  if (!currentDualGovernanceAddress) {
    console.error('Unable to fetch currentDualGovernanceAddress');
    return { isEmergencyModeActive: false, isLoading: false };
  }

  if (!emergencyGovernanceAddress) {
    console.error('Unable to fetch emergencyGovernance address');
    return { isEmergencyModeActive: false, isLoading: false };
  }

  return {
    isEmergencyGovernanceActive:
      emergencyGovernanceAddress === currentDualGovernanceAddress,
    isLoading: false,
  };
};
