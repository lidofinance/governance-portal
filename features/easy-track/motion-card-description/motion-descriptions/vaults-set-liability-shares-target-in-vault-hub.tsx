import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmSetLiabilitySharesTargetInVaultHubAbi } from 'abi/generated';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { convertSharesToStethString } from '@easy-track/vaults/utils/convert-shares-to-steth-string';
import { AddressPop } from 'shared/components/address-pop';

// SetLiabilitySharesTargetInVaultHub
export const VaultsSetLiabilitySharesTargetInVaultHub = ({
  callData,
}: MotionDescriptionProps<typeof evmSetLiabilitySharesTargetInVaultHubAbi>) => {
  const [vaults, liabilitySharesTargets] = callData;

  const { data: shareRate } = useShareRate();

  return (
    <ul>
      {vaults.map((vault, index) => {
        const liabilitySharesTarget = liabilitySharesTargets[index];
        return (
          <li key={index}>
            Set liability shares target for vault <AddressPop address={vault} />{' '}
            to{' '}
            <b>
              {formatVaultParam(liabilitySharesTarget)}
              {convertSharesToStethString(liabilitySharesTarget, shareRate)}
            </b>
          </li>
        );
      })}
    </ul>
  );
};
