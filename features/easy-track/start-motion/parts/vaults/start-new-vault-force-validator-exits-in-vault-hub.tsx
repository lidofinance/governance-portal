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
} from '../create-motion-form-part';
import { encodeAbiParameters, getAddress, parseAbiParameters } from 'viem';
import { ForceValidatorExitsInVaultHub } from 'shared/blockchain/contracts';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { useVaultsDataMap } from '@easy-track/vaults/hooks/use-vaults-data-map';
import { VaultAddressInputHookForm } from '@easy-track/vaults/ui/vault-address-input-hook-form';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { MotionType } from '@easy-track/motion-types';

type VaultInput = {
  address: string;
  pubkey: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.ForceValidatorExitsInVaultHub,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    vaults: VaultInput[];
  }>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('address[], bytes[]'),
      [
        formData.vaults.map((vault) => getAddress(vault.address)),
        formData.vaults.map((vault) => vault.pubkey as `0x${string}`),
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
        pubkey: '',
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(ForceValidatorExitsInVaultHub);

    const { getVaultData } = useVaultsDataMap();

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults });

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        pubkey: '',
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
                  <FieldsHeaderDesc>Exit #{fieldIndex + 1}</FieldsHeaderDesc>
                )}
                {vaultsFieldArray.fields.length > 1 && (
                  <RemoveItemButton
                    onClick={() => vaultsFieldArray.remove(fieldIndex)}
                  >
                    Remove exit {fieldIndex + 1}
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
                <InputHookForm
                  fieldName={`${fieldNames.vaults}.${fieldIndex}.pubkey`}
                  label="Pubkey"
                  rules={{
                    required: 'Field is required',
                    validate: (value) => {
                      if (!/^0x[0-9a-fA-F]{96}$/.test(value)) {
                        return 'Pubkey must be a 48-byte hex string prefixed with 0x';
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
