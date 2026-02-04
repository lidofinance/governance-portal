import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmSetJailStatusInOperatorGridAbi } from 'abi/generated';
import { AddressPop } from 'shared/components/address-pop';

// SetJailStatusInOperatorGrid
export const VaultsSetJailStatusInOperatorGrid = ({
  callData,
}: MotionDescriptionProps<typeof evmSetJailStatusInOperatorGridAbi>) => {
  const [vaults, jailStatuses] = callData;

  return (
    <ul>
      {vaults.map((vault, index) => {
        return (
          <li key={index}>
            Set vault <AddressPop address={vault} /> jail status to{' '}
            <b>{jailStatuses[index] ? 'true' : 'false'}</b>;
          </li>
        );
      })}
    </ul>
  );
};
