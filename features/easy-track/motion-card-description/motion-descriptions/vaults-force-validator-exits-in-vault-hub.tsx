// ForceValidatorExitsInVaultHub
import { AddressPop } from 'shared/components/address-pop';
import { MotionDescriptionProps } from '../types';
import { evmForceValidatorExitsInVaultHubAbi } from 'abi/generated';

export const VaultsForceValidatorExitsInVaultHub = ({
  callData,
}: MotionDescriptionProps<typeof evmForceValidatorExitsInVaultHubAbi>) => {
  const [vaults, pubkeys] = callData;
  return (
    <ul>
      {vaults.map((vault, index) => {
        return (
          <li key={index}>
            Force validator exit: vault <AddressPop address={vault} />, pubkey{' '}
            {pubkeys[index]};
          </li>
        );
      })}
    </ul>
  );
};
