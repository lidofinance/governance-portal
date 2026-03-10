import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';
import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  MotionInfoBox,
} from '../style';
import { GridGroup } from '@easy-track/vaults/types';
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
import { useOperatorGridGroupMap } from '@easy-track/vaults/hooks/use-operator-grid-group-map';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { UpdateGroupsShareLimit } from 'shared/blockchain/contracts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { OperatorGridAddressInputHookForm } from '@easy-track/vaults/ui/operator-grid-address-input-hook-form';
import { Text } from 'shared/components/text';
import { formatVaultParam } from '@easy-track/vaults/utils/format-vault-param';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateEtherValue } from 'utils/validate-ether-value';
import { PredefinedGroupParamsPicker } from '@easy-track/vaults/ui/predefined-group-params-picker';

type GroupInput = Omit<GridGroup, 'tiers'>;

export const formParts = createMotionFormPart({
  motionType: MotionType.UpdateGroupsShareLimit,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    groups: GroupInput[];
  }>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('address[], uint256[]'),
      [
        formData.groups.map((group) => getAddress(group.nodeOperator)),
        formData.groups.map((group) => parseEther(group.shareLimit)),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    groups: [{ nodeOperator: '', shareLimit: '' }] as GroupInput[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const { groupMap, getOperatorGridGroup } = useOperatorGridGroupMap();

    const factoryContract = useReadContract(UpdateGroupsShareLimit);

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(UpdateGroupsShareLimit);

    const { data: maxShareLimit, isLoading: isFactoryDataLoading } = useQuery({
      queryKey: ['update-groups-share-factory-max-share-limit', chainId],
      queryFn: async () => {
        return factoryContract.readContract('maxShareLimit');
      },
    });

    const groupsFieldArray = useFieldArray({ name: fieldNames.groups });

    const { watch, setValue } = useFormContext();
    const groupsInput: GroupInput[] = watch(fieldNames.groups);

    const handleAddGroup = () =>
      groupsFieldArray.append({ nodeOperator: '', shareLimit: '' });

    if (isFactoryDataLoading || isTrustedCallerLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        {groupsFieldArray.fields.map((item, groupIndex) => {
          const entityInMap =
            groupMap[groupsInput[groupIndex].nodeOperator.toLowerCase()];
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {groupsFieldArray.fields.length > 1 && (
                    <FieldsHeaderDesc>Group #{groupIndex + 1}</FieldsHeaderDesc>
                  )}
                  {groupsFieldArray.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => groupsFieldArray.remove(groupIndex)}
                    >
                      Remove group {groupIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <OperatorGridAddressInputHookForm
                    groupFieldName={fieldNames.groups}
                    fieldIndex={groupIndex}
                    getGroupData={getOperatorGridGroup}
                  />
                </Fieldset>

                {maxShareLimit ? (
                  <MotionInfoBox>
                    <Text size={12}>
                      Max share limit: {formatVaultParam(maxShareLimit)}
                    </Text>
                    {entityInMap && entityInMap.shareLimit !== 0n ? (
                      <Text size={12}>
                        Current share limit:{' '}
                        {formatVaultParam(entityInMap.shareLimit)}
                      </Text>
                    ) : null}
                  </MotionInfoBox>
                ) : null}

                <PredefinedGroupParamsPicker
                  onSelect={(groupOption) => {
                    setValue(
                      `${fieldNames.groups}.${groupIndex}.shareLimit`,
                      groupOption.shareLimit.toString(),
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.groups}.${groupIndex}.shareLimit`}
                    label="Share limit"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const amountError = validateEtherValue(value);
                        if (amountError) {
                          return amountError;
                        }

                        if (
                          maxShareLimit &&
                          maxShareLimit < parseEther(value)
                        ) {
                          return `Value must be less than or equal to ${formatVaultParam(
                            maxShareLimit,
                          )}`;
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
            onClick={handleAddGroup}
            icon={<Plus />}
            color="secondary"
          >
            One more group
          </ButtonIcon>
        </Fieldset>

        {submitAction}
      </>
    );
  },
});
