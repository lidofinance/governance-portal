// RegisterTiersInOperatorGrid
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmRegisterTiersInOperatorsGridAbi } from 'abi/generated';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { convertSharesToStethString } from '@easy-track/vaults/utils/convert-shares-to-steth-string';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const VaultsRegisterTiersInOperatorGrid = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof evmRegisterTiersInOperatorsGridAbi>) => {
  const operatorGrid = useReadContract(OperatorGrid);
  const [nodeOperators, tiers] = callData;

  const { data: shareRate } = useShareRate();

  const { data: tiersCounts } = useQuery({
    queryKey: [`vaults-register-tiers-desc-${nodeOperators.join('-')}`],
    enabled: isOnChain,
    queryFn: () =>
      Promise.all(
        nodeOperators.map(async (nodeOperator) => {
          const group = await operatorGrid.readContract('group', [
            nodeOperator,
          ]);
          return group.tierIds.length;
        }),
      ),
  });

  return (
    <ol>
      {nodeOperators.map((nodeOperator, index) => {
        const tiersList = tiers[index];
        const s = tiersList.length > 1 ? 's' : '';
        const tiersCount = (tiersCounts ?? [])[index] ?? 0;

        return (
          <li key={index}>
            Tier{s} for a group with node operator{' '}
            <AddressPopInline address={nodeOperator} />:
            <br />
            {tiers[index].map((tier, tierIndex) => (
              <React.Fragment key={`${index}.${tierIndex}`}>
                <span>Tier #{tierIndex + tiersCount + 1}</span>
                <ul>
                  <li>
                    <b>Share limit: </b>
                    {formatVaultParam(tier.shareLimit)}
                    {convertSharesToStethString(tier.shareLimit, shareRate)};
                  </li>
                  <li>
                    <b>Reserve ratio: </b>
                    {formatVaultParam(tier.reserveRatioBP, true)};
                  </li>
                  <li>
                    <b>Forced rebalance threshold: </b>
                    {formatVaultParam(tier.forcedRebalanceThresholdBP, true)};
                  </li>
                  <li>
                    <b>Infra fee: </b>
                    {formatVaultParam(tier.infraFeeBP, true)};
                  </li>
                  <li>
                    <b>Liquidity fee: </b>
                    {formatVaultParam(tier.liquidityFeeBP, true)};
                  </li>
                  <li>
                    <b>Reservation liquidity fee: </b>
                    {formatVaultParam(tier.reservationFeeBP, true)}.
                  </li>
                </ul>
              </React.Fragment>
            ))}
          </li>
        );
      })}
    </ol>
  );
};
