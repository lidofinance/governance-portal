import { Fragment } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';

import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
} from '../style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from '@easy-track/start-motion/parts/create-motion-form-part';
import { MotionType } from '@easy-track/motion-types';
import {
  encodeAbiParameters,
  getAddress,
  parseAbiParameters,
  parseEther,
} from 'viem';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { SetLiabilitySharesTargetInVaultHub } from 'shared/blockchain/contracts';
import { useVaultsDataMap } from '@easy-track/vaults/hooks/use-vaults-data-map';
import { VaultAddressInputHookForm } from '@easy-track/vaults/ui/vault-address-input-hook-form';
import { validateEtherValue } from 'utils/validate-ether-value';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';

type VaultInput = {
  address: string;
  liabilitySharesTargets: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SetLiabilitySharesTargetInVaultHub,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    vaults: VaultInput[];
  }>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('address[], uint256[]'),
      [
        formData.vaults.map((vault) => getAddress(vault.address)),
        formData.vaults.map((vault) =>
          parseEther(vault.liabilitySharesTargets),
        ),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    vaults: [
      {
        address: '',
        liabilitySharesTargets: '',
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SetLiabilitySharesTargetInVaultHub);

    const { getVaultData } = useVaultsDataMap();

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults });

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        liabilitySharesTargets: '',
      } as VaultInput);

    if (isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        {vaultsFieldArray.fields.map((item, fieldIndex) => (
          <Fragment key={item.id}>
            <FieldsWrapper>
              <FieldsHeader>
                {vaultsFieldArray.fields.length > 1 && (
                  <FieldsHeaderDesc>Update #{fieldIndex + 1}</FieldsHeaderDesc>
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

              <Fieldset>
                <InputNumberHookForm
                  fieldName={`${fieldNames.vaults}.${fieldIndex}.liabilitySharesTargets`}
                  label="Liability Shares Target"
                  rules={{
                    required: 'Field is required',
                    validate: (value) => {
                      const amountError = validateEtherValue(value);
                      if (amountError) {
                        return amountError;
                      }

                      return true;
                    },
                  }}
                />
              </Fieldset>
            </FieldsWrapper>
          </Fragment>
        ))}

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
