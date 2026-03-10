// ForceValidatorExitsInVaultHub
import { MotionDescriptionProps } from '../types';
import { evmForceValidatorExitsInVaultHubAbi } from 'abi/generated';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const VaultsForceValidatorExitsInVaultHub = ({
  callData,
}: MotionDescriptionProps<typeof evmForceValidatorExitsInVaultHubAbi>) => {
  const [vaults, pubkeys] = callData;
  return (
    <ul>
      {vaults.map((vault, index) => {
        return (
          <li key={index}>
            Force validator exit: vault <AddressPopInline address={vault} />,
            pubkey {pubkeys[index]};
          </li>
        );
      })}
    </ul>
  );
};
