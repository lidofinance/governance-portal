import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmAlterTiersInOperatorGridAbi } from 'abi/generated';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { useShareRate } from '@easy-track/vaults/hooks/use-share-rate';
import { useQuery } from '@tanstack/react-query';
import { AddressPop } from 'shared/components/address-pop';
import { renderVaultParamUpdate } from '@easy-track/vaults/utils/render-vault-param-update';

// Copies of original types without array part
type TierParamsStructOutputCopy = {
  shareLimit: bigint;
  reserveRatioBP: bigint;
  forcedRebalanceThresholdBP: bigint;
  infraFeeBP: bigint;
  liquidityFeeBP: bigint;
  reservationFeeBP: bigint;
};

type TierStructOutputCopy = {
  operator: string;
  shareLimit: bigint;
  liabilityShares: bigint;
  reserveRatioBP: number;
  forcedRebalanceThresholdBP: number;
  infraFeeBP: number;
  liquidityFeeBP: number;
  reservationFeeBP: number;
};

// AlterTiersInOperatorGrid
export const VaultsAlterTiersInOperatorGrid = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof evmAlterTiersInOperatorGridAbi>) => {
  const operatorGrid = useReadContract(OperatorGrid);
  const { data: shareRate } = useShareRate();
  const [tierIds, tierParamsUpdates] = callData;

  const { data, isLoading } = useQuery({
    queryKey: [
      'vaults-alter-tiers-desc',
      tierIds.map((t) => t.toString()).join('-'),
      isOnChain,
    ],
    queryFn: async () => {
      const tiersData = await Promise.all(
        tierIds.map(async (tierId) =>
          operatorGrid.readContract('tier', [tierId]),
        ),
      );

      return tiersData.reduce(
        (acc, tierData, index) => {
          const value = {
            tierId: tierIds[index].toString(),
            before: isOnChain ? tierData : undefined,
            after: tierParamsUpdates[index],
          };
          if (!acc[tierData.operator]) {
            acc[tierData.operator] = [value];
          } else {
            acc[tierData.operator]?.push(value);
          }
          return acc;
        },
        {} as Record<
          string,
          | {
              tierId: string;
              before: TierStructOutputCopy | undefined;
              after: TierParamsStructOutputCopy;
            }[]
          | undefined
        >,
      );
    },
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!data) {
    return <>No data</>;
  }

  return (
    <>
      <ol>
        {Object.entries(data).map(([operator, tiers]) => {
          if (!tiers) return null;

          const s = tiers.length > 1 ? 's' : '';
          return (
            <li key={operator}>
              Alter tier{s} for a group with node operator{' '}
              <AddressPop address={operator} />:
              <br />
              {tiers.map((tier, index) => (
                <React.Fragment key={index}>
                  <span>Tier with global tierId {tier.tierId.toString()}:</span>
                  <ul>
                    <li>
                      <b>Share limit: </b>
                      {renderVaultParamUpdate(
                        tier.before?.shareLimit,
                        tier.after.shareLimit,
                        false,
                        shareRate,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Reserve ratio: </b>
                      {renderVaultParamUpdate(
                        tier.before?.reserveRatioBP,
                        tier.after.reserveRatioBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Forced rebalance threshold: </b>
                      {renderVaultParamUpdate(
                        tier.before?.forcedRebalanceThresholdBP,
                        tier.after.forcedRebalanceThresholdBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Infra fee: </b>
                      {renderVaultParamUpdate(
                        tier.before?.infraFeeBP,
                        tier.after.infraFeeBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Liquidity fee:</b>{' '}
                      {renderVaultParamUpdate(
                        tier.before?.liquidityFeeBP,
                        tier.after.liquidityFeeBP,
                        true,
                      )}
                      ;
                    </li>
                    <li>
                      <b>Reservation liquidity fee:</b>{' '}
                      {renderVaultParamUpdate(
                        tier.before?.reservationFeeBP,
                        tier.after.reservationFeeBP,
                        true,
                      )}
                      .
                    </li>
                  </ul>
                </React.Fragment>
              ))}
            </li>
          );
        })}
      </ol>
    </>
  );
};
