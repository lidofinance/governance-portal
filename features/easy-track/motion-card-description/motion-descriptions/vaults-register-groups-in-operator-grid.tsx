// RegisterGroupsInOperatorGrid
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmRegisterGroupsInOperatorsGridAbi } from 'abi/generated';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { AddressPop } from 'shared/components/address-pop';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { convertSharesToStethString } from '@easy-track/vaults/utils/convert-shares-to-steth-string';
import React from 'react';

export const VaultsRegisterGroupsInOperatorGrid = ({
  callData,
}: MotionDescriptionProps<typeof evmRegisterGroupsInOperatorsGridAbi>) => {
  const [nodeOperators, shareLimits, tiers] = callData;

  const { data: shareRate } = useShareRate();

  return (
    <ol>
      {nodeOperators.map((nodeOperator, index) => {
        const shareLimit = shareLimits[index];

        return (
          <li key={index}>
            Group with node operator <AddressPop address={nodeOperator} />,
            share limit{' '}
            <b>
              {formatVaultParam(shareLimit)}
              {convertSharesToStethString(shareLimit, shareRate)}
            </b>{' '}
            and tiers:
            <br />
            {tiers[index].map((tier, tierIndex) => {
              return (
                <React.Fragment key={`${index}.${tierIndex}`}>
                  <span>Tier #{tierIndex + 1}</span>
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
              );
            })}
          </li>
        );
      })}
    </ol>
  );
};
