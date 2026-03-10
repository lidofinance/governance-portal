import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Option } from '@lidofinance/lido-ui';
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
import { useSDVTNodeOperatorsSummaryMap } from '../../hooks/use-sdvt-node-operators-summary';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { SDVTTargetValidatorLimitsUpdateV2 } from 'shared/blockchain/contracts';
import { NodeOperatorSelectControl } from '../../motions/ui/node-operator-select-control/node-operator-select-control';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { validateUintValue } from 'utils/validate-uint-value';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';

type NodeOperator = {
  id: string | undefined;
  targetLimitMode: string;
  targetLimit: string;
};

const UINT_64_MAX = BigInt('0xFFFFFFFFFFFFFFFF');

const TARGET_LIMIT_MODES: Partial<Record<string, string>> = {
  '0': 'Disabled',
  '1': 'Soft limit',
  '2': 'Boosted exits',
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTTargetValidatorLimitsUpdateV2,
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
        '(uint256 nodeOperatorId, uint256 targetLimitMode, uint256 targetLimit)[]',
      ),
      [
        sortedNodeOperators.map((nodeOperator) => ({
          nodeOperatorId: BigInt(nodeOperator.id as string),
          targetLimitMode: BigInt(nodeOperator.targetLimitMode),
          targetLimit: BigInt(nodeOperator.targetLimit),
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
        id: undefined,
        targetLimitMode: '',
        targetLimit: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { data: nodeOperatorsList, isLoading: isNodeOperatorsDataLoading } =
      useNodeOperatorsList('sdvt');

    const {
      data: operatorsSummaryMap,
      isLoading: isNodeOperatorsSummaryLoading,
    } = useSDVTNodeOperatorsSummaryMap();

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SDVTTargetValidatorLimitsUpdateV2);

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators });
    const { watch, setError } = useFormContext();

    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    );

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) {
        return [];
      }

      const selectedIds = selectedNodeOperators.map(({ id }) =>
        id ? parseInt(id) : -1,
      );
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id as string);
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      );
    };

    const handleAddUpdate = () =>
      fieldsArr.append({
        id: undefined,
        targetLimitMode: '',
        targetLimit: '',
      } as NodeOperator);

    if (
      isTrustedCallerLoading ||
      isNodeOperatorsDataLoading ||
      isNodeOperatorsSummaryLoading
    ) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!nodeOperatorsList?.length || !operatorsSummaryMap) {
      return <MessageBox>Node operator list is empty</MessageBox>;
    }

    return (
      <>
        {fieldsArr.fields.map((item, fieldIndex) => {
          const selectedId = selectedNodeOperators[fieldIndex].id;
          const currentNodeOperator = selectedId
            ? nodeOperatorsList[parseInt(selectedId)]
            : undefined;

          const currentTargetLimitMode =
            currentNodeOperator &&
            operatorsSummaryMap[
              currentNodeOperator.id
            ].targetLimitMode.toString();

          const targetLimitModeLabel = currentTargetLimitMode
            ? TARGET_LIMIT_MODES[currentTargetLimitMode]
            : null;

          const currentTargetLimit =
            currentNodeOperator &&
            operatorsSummaryMap[
              currentNodeOperator.id
            ].targetValidatorsCount.toString();

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
                      const nodeOperator = nodeOperatorsList[Number(value)];
                      const nodeOperatorSummary =
                        operatorsSummaryMap[nodeOperator.id];

                      fieldsArr.update(fieldIndex, {
                        id: String(value),
                        targetLimitMode:
                          nodeOperatorSummary.targetLimitMode.toString(),
                        targetLimit:
                          nodeOperatorSummary.targetValidatorsCount.toString(),
                      });
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <SelectHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.targetLimitMode`}
                    label={`Target limit mode ${
                      targetLimitModeLabel
                        ? ` (current mode is ${targetLimitModeLabel})`
                        : ''
                    }`}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const currentMode = Number(currentTargetLimitMode);
                        const modeToUpdate = Number(value);

                        const currentLimit = Number(currentTargetLimit);
                        const limitToUpdate = Number(
                          selectedNodeOperators[fieldIndex].targetLimit,
                        );

                        if (
                          modeToUpdate !== currentMode &&
                          currentLimit === limitToUpdate
                        ) {
                          setError(
                            `${fieldNames.nodeOperators}.${fieldIndex}.targetLimit`,
                            { message: undefined },
                          );
                          return true;
                        }

                        return true;
                      },
                    }}
                  >
                    {Object.entries(TARGET_LIMIT_MODES).map(([key, value]) => (
                      <Option key={key} value={key}>
                        {value || ''}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.targetLimit`}
                    label={`New limit ${
                      currentTargetLimit
                        ? ` (current limit is ${currentTargetLimit})`
                        : ''
                    }`}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }

                        if (BigInt(value) > UINT_64_MAX) {
                          return `Value must be less than or equal to ${UINT_64_MAX}`;
                        }

                        const currentMode = Number(currentTargetLimitMode);
                        const modeToUpdate = Number(
                          selectedNodeOperators[fieldIndex].targetLimitMode,
                        );

                        const currentLimit = Number(currentTargetLimit);
                        const limitToUpdate = Number(value);

                        if (
                          currentMode === modeToUpdate &&
                          currentLimit === limitToUpdate
                        ) {
                          return 'Both mode and limit are the same as current';
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

        {selectedNodeOperators.length < nodeOperatorsList.length && (
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
