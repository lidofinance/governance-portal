import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  MessageBox,
  RemoveItemButton,
} from './style';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import {
  CSMRegistry,
  CSMSettleElStealingPenalty,
} from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import invariant from 'tiny-invariant';
import { validateUintValue } from '../../utils/validate-uint-value';
import { encodeAbiParameters, parseAbiParameters } from 'viem';

type NodeOperator = {
  id: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.CSMSettleElStealingPenalty,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    nodeOperators: NodeOperator[];
  }>) => {
    const sortedNodeOperators = formData.nodeOperators
      .map(({ id }) => Number(id))
      .sort((a, b) => a - b);

    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('uint256[]'),
      [sortedNodeOperators.map(BigInt)],
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
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const readCSMRegistryContract = useReadContract(CSMRegistry);

    const { data: nodeOperatorsCount, isLoading: isNodeOperatorsCountLoading } =
      useQuery({
        queryKey: ['CSMNodeOperatorsCount', chainId],
        queryFn: async () => {
          invariant(
            readCSMRegistryContract,
            'CSMRegistryContract must be defined',
          );
          return await readCSMRegistryContract.readContract(
            'getNodeOperatorsCount',
          );
        },
      });

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(CSMSettleElStealingPenalty);

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators });
    const { watch } = useFormContext();
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    );

    const handleAddSettle = () =>
      fieldsArr.append({
        id: '',
      });

    if (isTrustedCallerLoading || isNodeOperatorsCountLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!nodeOperatorsCount) {
      return <MessageBox>There are no node operators</MessageBox>;
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
                      Settle #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIndex)}
                    >
                      Remove settle {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.id`}
                    label="Node operator ID"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }
                        const valueNum = Number(value);

                        if (valueNum >= nodeOperatorsCount) {
                          return 'Invalid node operator ID';
                        }

                        const isAlreadyInInput = selectedNodeOperators.some(
                          ({ id }, index) =>
                            id === value && index !== fieldIndex,
                        );

                        if (isAlreadyInInput) {
                          return 'This ID is already in the list';
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

        {selectedNodeOperators.length < nodeOperatorsCount && (
          <Fieldset>
            <ButtonIcon
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddSettle}
              icon={<Plus />}
              color="secondary"
            >
              One more settle
            </ButtonIcon>
          </Fieldset>
        )}

        {submitAction}
      </>
    );
  },
});
