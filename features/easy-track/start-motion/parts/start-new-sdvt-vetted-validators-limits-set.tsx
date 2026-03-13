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
import { MotionType } from '../../motion-types';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { SDVTVettedValidatorsLimitsSet } from 'shared/blockchain/contracts';
import { NodeOperatorSelectControl } from '../../motions/ui/node-operator-select-control/node-operator-select-control';
import { validateUintValue } from 'utils/validate-uint-value';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';

type NodeOperator = {
  id: string;
  vettedValidatorsLimit: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTVettedValidatorsLimitsSet,
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
      parseAbiParameters('(uint256 nodeOperatorId, uint256 stakingLimit)[]'),
      [
        sortedNodeOperators.map((nodeOperator) => ({
          nodeOperatorId: BigInt(nodeOperator.id),
          stakingLimit: BigInt(nodeOperator.vettedValidatorsLimit),
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
        vettedValidatorsLimit: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { data: nodeOperatorsList, isLoading: isNodeOperatorsDataLoading } =
      useNodeOperatorsList('sdvt');

    const nodeOperatorsWithValidators = nodeOperatorsList?.filter(
      (nodeOperator) => nodeOperator.totalAddedValidators > 0,
    );

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SDVTVettedValidatorsLimitsSet);

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators });
    const { watch } = useFormContext();
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    );

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsWithValidators?.length) return [];
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id));
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id);
      return nodeOperatorsWithValidators.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      );
    };

    const handleAddProgram = () =>
      fieldsArr.append({
        id: '',
        vettedValidatorsLimit: '',
      } as NodeOperator);

    if (isTrustedCallerLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!nodeOperatorsList?.length || !nodeOperatorsWithValidators?.length) {
      return (
        <MessageBox>There are no node operators with validators yet</MessageBox>
      );
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
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    label="Vetted validators limit"
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.vettedValidatorsLimit`}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }

                        const nodeOperatorId = parseInt(
                          selectedNodeOperators[fieldIndex].id,
                        );

                        if (isNaN(nodeOperatorId)) {
                          return 'Select node operator first';
                        }

                        const nodeOperator = nodeOperatorsList[nodeOperatorId];

                        const { totalAddedValidators } = nodeOperator;

                        if (totalAddedValidators < value) {
                          return `Value must be less than or equal to ${totalAddedValidators}`;
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

        {selectedNodeOperators.length < nodeOperatorsWithValidators.length && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddProgram}
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
