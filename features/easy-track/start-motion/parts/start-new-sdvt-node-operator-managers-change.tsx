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
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from 'features/easy-track/motion-types';
import { encodeAbiParameters, parseAbiParameters, getAddress } from 'viem';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import {
  SDVTNodeOperatorManagerChange,
  SDVTRegistry,
} from 'shared/blockchain/contracts';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { NodeOperatorSelectControl } from '../../motions/ui/node-operator-select-control/node-operator-select-control';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { checkIsAddressManagerOfNodeOperator } from '../../utils/check-address-manager-role';

type NodeOperator = {
  id: string;
  oldManagerAddress: string;
  newManagerAddress: string;
};

const noSigningKeysRoleError =
  'Address does not have signing keys manager role';

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorManagerChange,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    nodeOperators: NodeOperator[];
  }>) => {
    const sortedNodeOperators = formData.nodeOperators.sort(
      (a, b) => Number(a.id) - Number(b.id),
    );

    const encodedCallData = encodeAbiParameters(
      parseAbiParameters(
        '(uint256 nodeOperatorId, address oldManagerAddress, address newManagerAddress)[]',
      ),
      [
        sortedNodeOperators.map((nodeOperator) => ({
          nodeOperatorId: BigInt(nodeOperator.id),
          oldManagerAddress: getAddress(nodeOperator.oldManagerAddress),
          newManagerAddress: getAddress(nodeOperator.newManagerAddress),
        })),
      ],
    );
    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    nodeOperators: [
      {
        id: '',
        oldManagerAddress: '',
        newManagerAddress: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { data: nodeOperatorsList, isLoading: isNodeOperatorsDataLoading } =
      useNodeOperatorsList('sdvt');
    const sdvtRegistry = useReadContract(SDVTRegistry);

    const activeNodeOperators = nodeOperatorsList?.filter(
      (nodeOperator) => nodeOperator.active,
    );

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SDVTNodeOperatorManagerChange);

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators });
    const { watch, setValue, setError } = useFormContext();
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    );

    const getFilteredOptions = (fieldIdx: number) => {
      if (!activeNodeOperators?.length) return [];
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id));
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id);
      return activeNodeOperators.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      );
    };

    const handleAddUpdate = () =>
      fieldsArr.append({
        id: '',
        oldManagerAddress: '',
        newManagerAddress: '',
      } as NodeOperator);

    if (isTrustedCallerLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!nodeOperatorsList?.length || !activeNodeOperators?.length) {
      return <MessageBox>There are no active node operators</MessageBox>;
    }

    return (
      <>
        {fieldsArr.fields.map((item, fieldIndex) => {
          return (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Update #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIndex)}
                    >
                      Remove update {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <NodeOperatorSelectControl
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.id`}
                    options={getFilteredOptions(fieldIndex)}
                    onChange={(value: string | number) => {
                      const managerAddress =
                        nodeOperatorsList[Number(value)].managerAddress;
                      const key = `${fieldNames.nodeOperators}.${fieldIndex}.oldManagerAddress`;

                      if (managerAddress) {
                        setError(key, { message: undefined });
                        setValue(key, managerAddress, {
                          shouldValidate: false,
                        });
                      } else {
                        setError(key, {
                          message:
                            'Manager address not found. You need to input it manually',
                        });
                      }
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.oldManagerAddress`}
                    label="Manager address"
                    disabled={selectedNodeOperators[fieldIndex].id === ''}
                    rules={{
                      required: 'Field is required',
                      validate: async (value) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const canAddressManageKeys =
                          await checkIsAddressManagerOfNodeOperator(
                            value,
                            selectedNodeOperators[fieldIndex].id,
                            sdvtRegistry,
                          );

                        if (!canAddressManageKeys) {
                          return noSigningKeysRoleError;
                        }
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.newManagerAddress`}
                    label="New manager address"
                    rules={{
                      required: 'Field is required',
                      validate: async (value) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const valueAddress = getAddress(value);

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ newManagerAddress }, index) =>
                              newManagerAddress &&
                              getAddress(newManagerAddress) === valueAddress &&
                              fieldIndex !== index,
                          );

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update';
                        }

                        const canAddressManageKeys =
                          await checkIsAddressManagerOfNodeOperator(
                            valueAddress,
                            selectedNodeOperators[fieldIndex].id,
                            sdvtRegistry,
                          );

                        if (canAddressManageKeys) {
                          return 'Address is not allowed to manage signing keys';
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

        {selectedNodeOperators.length < activeNodeOperators.length && (
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
        )}

        {submitAction}
      </>
    );
  },
});
