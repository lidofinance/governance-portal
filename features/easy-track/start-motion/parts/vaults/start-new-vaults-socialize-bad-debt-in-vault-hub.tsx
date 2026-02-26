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
} from '@easy-track/start-motion/parts/create-motion-form-part';
import { MotionType } from '@easy-track/motion-types';
import { Address, Hex } from 'viem';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { SocializeBadDebtInVaultHub } from 'shared/blockchain/contracts';
import { useVaultsDataMap } from '@easy-track/vaults/hooks/use-vaults-data-map';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { VaultAddressInputHookForm } from '@easy-track/vaults/ui/vault-address-input-hook-form';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { validateEtherValue } from 'utils/validate-ether-value';

type VaultInput = {
  address: string;
  acceptorAddress: string;
  maxShareToSocialize: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SocializeBadDebtInVaultHub,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    vaults: VaultInput[];
  }>) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'address[]', 'uint256[]'],
      [
        formData.vaults.map((vault) => utils.getAddress(vault.address)),
        formData.vaults.map((vault) => utils.getAddress(vault.acceptorAddress)),
        formData.vaults.map((vault) =>
          utils.parseEther(vault.maxShareToSocialize),
        ),
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
        acceptorAddress: '',
        maxShareToSocialize: '',
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SocializeBadDebtInVaultHub);

    const { vaultsDataMap, getVaultData } = useVaultsDataMap({
      includeBadDebt: true,
    });

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults });

    const { watch } = useFormContext();
    const vaultsInputs: VaultInput[] = watch(fieldNames.vaults);

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        acceptorAddress: '',
        maxShareToSocialize: '',
      } as VaultInput);

    if (isTrustedCallerLoading) {
      return <Loader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        {vaultsFieldArray.fields.map((item, fieldIndex) => {
          const vaultData =
            vaultsDataMap[vaultsInputs[fieldIndex]?.address.toLowerCase()];

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
                <>
                  {vaultData?.badDebtEth && (
                    <MotionInfoBox>
                      Current vault debt:{' '}
                      {formatVaultParam(vaultData.badDebtEth)}
                    </MotionInfoBox>
                  )}
                </>

                <Fieldset>
                  <VaultAddressInputHookForm
                    vaultsFieldName={fieldNames.vaults}
                    fieldIndex={fieldIndex}
                    getVaultData={getVaultData}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.acceptorAddress`}
                    label="Acceptor address"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const vaultAddress = vaultsInputs[fieldIndex]?.address;
                        if (
                          vaultAddress &&
                          value.toLowerCase() === vaultAddress.toLowerCase()
                        ) {
                          return 'Acceptor address cannot be the same as vault address';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.vaults}.${fieldIndex}.maxShareToSocialize`}
                    label="Max share to socialize"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const amountError = validateEtherValue(value);
                        if (amountError) {
                          return amountError;
                        }

                        const parsedValue = utils.parseEther(value);
                        if (parsedValue.isZero()) {
                          return 'Amount must be greater than 0';
                        }

                        if (vaultData?.badDebtEth) {
                          if (parsedValue.gt(vaultData.badDebtEth)) {
                            return `Amount exceeds current vault debt (${formatVaultParam(
                              vaultData.badDebtEth,
                            )})`;
                          }
                        }

                        return true;
                      },
                    }}
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
