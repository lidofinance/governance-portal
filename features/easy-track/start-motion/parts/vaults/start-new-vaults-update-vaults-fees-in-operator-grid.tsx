import { utils } from 'ethers';

import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Loader } from '@lidofinance/lido-ui';

import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  MotionInfoBox,
} from '../style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from '../create-motion-form-part';
import { MotionType } from '@easy-track/motion-types';
import { Address, Hex } from 'viem';
import { useVaultsDataMap } from '@easy-track/vaults/hooks/use-vaults-data-map';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { UpdateVaultsFeesInOperatorGrid } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { MAX_FEE_BP } from '@easy-track/constants';
import { VaultAddressInputHookForm } from '@easy-track/vaults/ui/vault-address-input-hook-form';
import { validateUintValue } from '@easy-track/utils/validate-uint-value';
import { BpValueFormatted } from '@easy-track/vaults/ui/bp-value-formatted';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';

type VaultFeesInput = {
  address: string;
  infraFeeBP: string;
  liquidityFeeBP: string;
  reservationFeeBP: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.UpdateVaultsFeesInOperatorGrid,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{ vaults: VaultFeesInput[] }>) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'uint256[]', 'uint256[]', 'uint256[]'],
      [
        formData.vaults.map((vault) => utils.getAddress(vault.address)),
        formData.vaults.map((vault) => Number(vault.infraFeeBP)),
        formData.vaults.map((vault) => Number(vault.liquidityFeeBP)),
        formData.vaults.map((vault) => Number(vault.reservationFeeBP)),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory as Address, encodedCallData as Hex],
    });
  },
  getDefaultFormData: () => ({
    vaults: [
      {
        address: '',
        infraFeeBP: '',
        liquidityFeeBP: '',
        reservationFeeBP: '',
      },
    ] as VaultFeesInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();

    const { vaultsDataMap, getVaultData } = useVaultsDataMap();

    const factoryContract = useReadContract(UpdateVaultsFeesInOperatorGrid);

    const { data: factoryData, isLoading: isFactoryDataLoading } = useQuery({
      queryKey: ['update-vaults-fees-data', chainId],
      queryFn: async () => {
        const [maxLiquidityFeeBP, maxReservationFeeBP, maxInfraFeeBP] =
          await Promise.all([
            factoryContract.readContract('maxLiquidityFeeBP'),
            factoryContract.readContract('maxReservationFeeBP'),
            factoryContract.readContract('maxInfraFeeBP'),
          ]);

        return {
          maxLiquidityFeeBP: Number(maxLiquidityFeeBP),
          maxReservationFeeBP: Number(maxReservationFeeBP),
          maxInfraFeeBP: Number(maxInfraFeeBP),
        };
      },
    });

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(UpdateVaultsFeesInOperatorGrid);

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults });

    const { watch } = useFormContext();
    const vaultsInputs: VaultFeesInput[] = watch(fieldNames.vaults);

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        infraFeeBP: '',
        liquidityFeeBP: '',
        reservationFeeBP: '',
      } as VaultFeesInput);

    if (isFactoryDataLoading || !factoryData || isTrustedCallerLoading) {
      return <Loader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        <MotionInfoBox>
          Current factory-level maximum fees
          <br />
          Max infra fee (BP): {factoryData.maxInfraFeeBP}
          <br />
          Max liquidity fee (BP): {factoryData.maxLiquidityFeeBP}
          <br />
          Max reservation liquidity fee (BP): {factoryData.maxReservationFeeBP}
        </MotionInfoBox>
        {vaultsFieldArray.fields.map((item, fieldIndex) => {
          const vaultTierInfo =
            vaultsDataMap[vaultsInputs[fieldIndex]?.address.toLowerCase()];

          const maxInfraFeeBP = Math.min(
            factoryData.maxInfraFeeBP,
            vaultTierInfo ? vaultTierInfo.infraFeeBP : MAX_FEE_BP,
            MAX_FEE_BP,
          );
          const maxLiquidityFeeBP = Math.min(
            factoryData.maxLiquidityFeeBP,
            vaultTierInfo ? vaultTierInfo.liquidityFeeBP : MAX_FEE_BP,
            MAX_FEE_BP,
          );
          const maxReservationFeeBP = Math.min(
            factoryData.maxReservationFeeBP,
            vaultTierInfo ? vaultTierInfo.reservationFeeBP : MAX_FEE_BP,
            MAX_FEE_BP,
          );

          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {vaultsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {vaultsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => vaultsFieldArray.remove(fieldIndex)}
                    >
                      Remove update {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <VaultAddressInputHookForm
                    vaultsFieldName={fieldNames.vaults}
                    fieldIndex={fieldIndex}
                    getVaultData={getVaultData}
                    extraValidateFn={(vaultData) => {
                      if (vaultData.isPendingDisconnect) {
                        return 'Vault is pending disconnect in the Operator Grid';
                      }
                    }}
                  />
                </Fieldset>

                {vaultTierInfo && (
                  <MotionInfoBox>
                    Current vault fees
                    <br />
                    Infra fee (BP): {vaultTierInfo.infraFeeBP}
                    <br />
                    Liquidity fee (BP): {vaultTierInfo.liquidityFeeBP}
                    <br />
                    Reservation liquidity fee (BP):{' '}
                    {vaultTierInfo.reservationFeeBP}
                  </MotionInfoBox>
                )}

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.infraFeeBP`}
                    label="Infra fee (BP)"
                    disabled={!vaultTierInfo}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }

                        if (Number(value) > maxInfraFeeBP) {
                          return `Value must be less than or equal to ${maxInfraFeeBP}`;
                        }

                        return true;
                      },
                    }}
                  />
                  <BpValueFormatted
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.infraFeeBP`}
                    label="Infra fee"
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.liquidityFeeBP`}
                    label="Liquidity fee (BP)"
                    disabled={!vaultTierInfo}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }

                        if (Number(value) > maxLiquidityFeeBP) {
                          return `Value must be less than or equal to ${maxLiquidityFeeBP}`;
                        }

                        return true;
                      },
                    }}
                  />
                  <BpValueFormatted
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.liquidityFeeBP`}
                    label="Liquidity fee"
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.reservationFeeBP`}
                    label="Reservation liquidity fee (BP)"
                    disabled={!vaultTierInfo}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }

                        if (Number(value) > maxReservationFeeBP) {
                          return `Value must be less than or equal to ${maxReservationFeeBP}`;
                        }

                        return true;
                      },
                    }}
                  />
                  <BpValueFormatted
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.reservationFeeBP`}
                    label="Reservation liquidity fee"
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          );
        })}

        <Fieldset>
          <ButtonIcon
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddUpdate}
            icon={<Plus />}
            color="secondary"
          >
            One more update
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    );
  },
});
