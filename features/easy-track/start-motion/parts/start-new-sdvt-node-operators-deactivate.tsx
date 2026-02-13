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
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { Address, Hex } from 'viem';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import {
  SDVTNodeOperatorsDeactivate,
  SDVTRegistry,
} from 'shared/blockchain/contracts';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { NodeOperatorSelectControl } from '../../motions/ui/node-operator-select-control/node-operator-select-control';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { checkIsAddressManagerOfNodeOperator } from '../../utils/check-address-manager-role';

type NodeOperator = {
  id: string;
  managerAddress: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorsDeactivate,
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

    const encodedCallData = new utils.AbiCoder().encode(
      ['tuple(uint256 nodeOperatorId, address managerAddress)[]'],
      [
        sortedNodeOperators.map((nodeOperator) => ({
          nodeOperatorId: Number(nodeOperator.id),
          managerAddress: utils.getAddress(nodeOperator.managerAddress),
        })),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory as Address, encodedCallData as Hex],
    });
  },
  getDefaultFormData: () => ({
    nodeOperators: [
      {
        id: '',
        managerAddress: '',
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
      useIsTrustedCaller(SDVTNodeOperatorsDeactivate);

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
        managerAddress: '',
      } as NodeOperator);

    if (isTrustedCallerLoading || isNodeOperatorsDataLoading) {
      return <Loader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!nodeOperatorsList?.length || !activeNodeOperators?.length) {
      return <MessageBox>There are no node operators to deactivate</MessageBox>;
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
                      const key = `${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`;
                      if (managerAddress) {
                        setError(key, { message: undefined });
                        setValue(key, managerAddress, {
                          shouldValidate: false,
                        });
                      } else {
                        setError(key, {
                          type: 'validate',
                          message:
                            'Manager address not found. You need to input it manually',
                        });
                      }
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`}
                    label="Manager address"
                    disabled={Boolean(
                      selectedNodeOperators[fieldIndex].id === '',
                    )}
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
                          return 'Address is not allowed to manage signing keys';
                        }
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
