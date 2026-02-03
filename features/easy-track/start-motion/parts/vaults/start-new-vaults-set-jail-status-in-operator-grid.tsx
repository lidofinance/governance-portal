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

import { Text } from 'shared/components/text';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from '@easy-track/start-motion/parts/create-motion-form-part';
import { MotionType } from '@easy-track/motion-types';
import { Address, Hex, isAddress } from 'viem';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { SetJailStatusInOperatorGrid } from 'shared/blockchain/contracts';
import { useVaultsDataMap } from '@easy-track/vaults/hooks/use-vaults-data-map';
import { AddressPop } from 'shared/components/address-pop';
import { VaultData } from '@easy-track/vaults/types';
import { VaultAddressInputHookForm } from '@easy-track/vaults/ui/vault-address-input-hook-form';

type VaultInput = {
  address: string;
  isInJail: boolean | null;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SetJailStatusInOperatorGrid,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    vaults: VaultInput[];
  }>) => {
    const encodedCallData = new utils.AbiCoder().encode(
      ['address[]', 'bool[]'],
      [
        formData.vaults.map((vault) => utils.getAddress(vault.address)),
        formData.vaults.map((vault) => vault.isInJail),
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
        isInJail: null,
      },
    ] as VaultInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SetJailStatusInOperatorGrid);

    const { vaultsDataMap, getVaultData } = useVaultsDataMap({
      includeJailStatus: true,
    });

    const vaultsFieldArray = useFieldArray({ name: fieldNames.vaults });

    const { formState, watch, register, setValue } = useFormContext();
    const vaultsInputs: VaultInput[] = watch(fieldNames.vaults);

    const handleAddUpdate = () =>
      vaultsFieldArray.append({
        address: '',
        isInJail: null,
      } as VaultInput);

    if (isTrustedCallerLoading) {
      return <Loader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    const sharedNodeOperatorAddress =
      !formState.errors[`${fieldNames.vaults}.0.address`] &&
      vaultsDataMap[vaultsInputs[0]?.address.toLowerCase()]?.nodeOperator;

    return (
      <>
        <MotionInfoBox>
          Note: all vaults within the motion must share the node operator
          address.
          {typeof sharedNodeOperatorAddress === 'string' &&
          isAddress(sharedNodeOperatorAddress) ? (
            <>
              <br />
              Current address:
              <AddressPop address={sharedNodeOperatorAddress} />
            </>
          ) : null}
        </MotionInfoBox>
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
                  allowDisconnectedVaults={true}
                  onValidVaultAddressInput={(data: VaultData) => {
                    // Update isInJail based on current jail status automatically
                    const currentJailStatus = data.jailStatus;
                    setValue(
                      `${fieldNames.vaults}.${fieldIndex}.isInJail`,
                      !currentJailStatus,
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }}
                  extraValidateFn={(vaultData: VaultData) => {
                    if (
                      fieldIndex > 0 &&
                      vaultData.nodeOperator !== sharedNodeOperatorAddress
                    ) {
                      return 'All vaults within the motion must share the same node operator address';
                    }
                  }}
                />
              </Fieldset>

              {typeof vaultsInputs[fieldIndex]?.isInJail === 'boolean' && (
                <Text size={16}>
                  This vault jail status will be set to{' '}
                  <b>{vaultsInputs[fieldIndex].isInJail ? 'True' : 'False'}</b>.
                </Text>
              )}

              <input
                type="hidden"
                {...register(`${fieldNames.vaults}.${fieldIndex}.isInJail`, {
                  validate: (value) => {
                    if (value === null) {
                      return 'Please enter a valid vault address first';
                    }
                    return true;
                  },
                })}
              />
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
