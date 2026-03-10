import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmSocializeBadDebtInVaultHubAbi } from 'abi/generated';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { convertSharesToStethString } from '@easy-track/vaults/utils/convert-shares-to-steth-string';
import { AddressPopInline } from 'shared/components/address-pop-inline';

// SocializeBadDebtInVaultHub
export const VaultsSocializeBadDebtInVaultHub = ({
  callData,
}: MotionDescriptionProps<typeof evmSocializeBadDebtInVaultHubAbi>) => {
  const [vaults, acceptorAddresses, maxSharesToSocialize] = callData;

  const { data: shareRate } = useShareRate();

  return (
    <ul>
      {vaults.map((vault, index) => {
        const acceptorAddress = acceptorAddresses[index];
        const maxShareToSocialize = maxSharesToSocialize[index];
        return (
          <li key={index}>
            Socialize bad debt in vault <AddressPopInline address={vault} />:{' '}
            <b>
              {formatVaultParam(maxShareToSocialize)}
              {convertSharesToStethString(maxShareToSocialize, shareRate)}
            </b>{' '}
            to acceptor <AddressPopInline address={acceptorAddress} />
          </li>
        );
      })}
    </ul>
  );
};
