import React from 'react';
import { MotionDescriptionProps } from '@easy-track/motion-card-description/types';
import { evmUpdateVaultsFeesInOperatorGridAbi } from 'abi/generated';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { OperatorGrid } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { AddressPop } from 'shared/components/address-pop';
import { renderVaultParamUpdate } from '@easy-track/vaults/utils/renderVaultParamUpdate';

// UpdateVaultsFeesInOperatorGrid
export const VaultsUpdateVaultsFeesInOperatorGrid = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof evmUpdateVaultsFeesInOperatorGridAbi>) => {
  const [vaults, infraFeesBP, liquidityFeesBP, reservationFeesBP] = callData;

  const operatorGrid = useReadContract(OperatorGrid);

  const { data } = useQuery({
    queryKey: [`desc-vaults-fee-updates-${vaults.join('-')}`],
    queryFn: async () => {
      if (!isOnChain) {
        return null;
      }

      return Promise.all(
        vaults.map(async (vault) =>
          operatorGrid.readContract('vaultTierInfo', [vault]),
        ),
      );
    },
  });

  return (
    <ul>
      {vaults.map((vault, index) => {
        const prevValues = data ? data[index] : null;
        const updatedInfraFeeBP = infraFeesBP[index];
        const updatedLiquidityFeeBP = liquidityFeesBP[index];
        const updatedReservationFeeBP = reservationFeesBP[index];
        return (
          <li key={index}>
            Update vault <AddressPop address={vault} /> fees to: <br />
            <ul>
              <li>
                <b>Infra fee: </b>
                {renderVaultParamUpdate(
                  prevValues?.[5], // infraFeeBP index 5
                  updatedInfraFeeBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Liquidity fee:</b>{' '}
                {renderVaultParamUpdate(
                  prevValues?.[6], // liquidityFeeBP index 6
                  updatedLiquidityFeeBP,
                  true,
                )}
                ;
              </li>
              <li>
                <b>Reservation liquidity fee:</b>{' '}
                {renderVaultParamUpdate(
                  prevValues?.[7], // reservationFeeBP index 7
                  updatedReservationFeeBP,
                  true,
                )}
                .
              </li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
};
