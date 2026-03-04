import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmUpdateGroupsShareLimitAbi } from 'abi/generated';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { useQuery } from '@tanstack/react-query';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { convertSharesToStethString } from '@easy-track/vaults/utils/convert-shares-to-steth-string';
import { AddressPopInline } from 'shared/components/address-pop-inline';

// UpdateGroupsShareLimit
export const VaultsUpdateGroupsShareLimit = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof evmUpdateGroupsShareLimitAbi>) => {
  const operatorGrid = useReadContract(OperatorGrid);
  const [nodeOperators, newShareLimits] = callData;

  const { data: shareRate } = useShareRate();

  const { data } = useQuery({
    queryKey: [
      `vaults-update-groups-share-limit-desc-${nodeOperators.join('-')}`,
    ],
    enabled: isOnChain,
    queryFn: () =>
      Promise.all(
        nodeOperators.map(async (nodeOperator) => {
          const group = await operatorGrid.readContract('group', [
            nodeOperator,
          ]);
          return group.shareLimit;
        }),
      ),
  });

  const currentShareLimits = data ?? [];

  return (
    <ul>
      {nodeOperators.map((nodeOperator, index) => {
        const currentShareLimit = currentShareLimits[index];
        const newShareLimit = newShareLimits[index];
        return (
          <li key={index}>
            Update share limit of group with node operator{' '}
            <AddressPopInline address={nodeOperator} />{' '}
            {isOnChain && data
              ? ` from ${formatVaultParam(currentShareLimit)} `
              : ''}
            {`to ${formatVaultParam(newShareLimit)}${convertSharesToStethString(
              newShareLimit,
              shareRate,
            )}`}
          </li>
        );
      })}
    </ul>
  );
};
