import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmSetLiabilitySharesTargetInVaultHubAbi } from 'abi/generated';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { convertSharesToStethString } from '@easy-track/vaults/utils/convert-shares-to-steth-string';
import { AddressPopInline } from 'shared/components/address-pop-inline';

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
            Set liability shares target for vault{' '}
            <AddressPopInline address={vault} trim={4} />
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
