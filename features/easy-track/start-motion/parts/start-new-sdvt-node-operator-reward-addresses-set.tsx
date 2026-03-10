import { Fragment, useMemo } from 'react';
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
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { encodeAbiParameters, getAddress, parseAbiParameters } from 'viem';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import {
  SDVTNodeOperatorRewardAddressesSet,
  StETH,
} from 'shared/blockchain/contracts';
import { NodeOperatorSelectControl } from '../../motions/ui/node-operator-select-control/node-operator-select-control';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateAddress } from 'utils/validate-address';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { useLidoSDK } from 'providers/lido-sdk';

type NodeOperator = {
  id: string;
  newRewardAddress: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.SDVTNodeOperatorRewardAddressesSet,
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
      parseAbiParameters('(uint256 nodeOperatorId, address rewardAddress)[]'),
      [
        sortedNodeOperators.map((nodeOperator) => ({
          nodeOperatorId: BigInt(nodeOperator.id),
          rewardAddress: getAddress(nodeOperator.newRewardAddress),
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
        newRewardAddress: '',
      },
    ] as NodeOperator[],
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();

    const { data: nodeOperatorsList, isLoading: isNodeOperatorsDataLoading } =
      useNodeOperatorsList('sdvt');

    const stETHAddress = getContractAddress(StETH, chainId);

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(SDVTNodeOperatorRewardAddressesSet);

    const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators });
    const { watch } = useFormContext();
    const selectedNodeOperators: NodeOperator[] = watch(
      fieldNames.nodeOperators,
    );

    const rewardAddressesMap = useMemo(
      () =>
        nodeOperatorsList?.reduce(
          (acc, item) => {
            acc[item.rewardAddress] = item.id;
            return acc;
          },
          {} as Record<string, number | undefined>,
        ) ?? {},
      [nodeOperatorsList],
    );

    const getFilteredOptions = (fieldIdx: number) => {
      if (!nodeOperatorsList?.length) {
        return [];
      }
      const selectedIds = selectedNodeOperators.map(({ id }) => parseInt(id));
      const thisId = parseInt(selectedNodeOperators[fieldIdx]?.id);
      return nodeOperatorsList.filter(
        ({ id }) => !selectedIds.includes(id) || id === thisId,
      );
    };

    const handleAddUpdate = () =>
      fieldsArr.append({
        id: '',
        newRewardAddress: '',
      } as NodeOperator);

    if (isTrustedCallerLoading || isNodeOperatorsDataLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    if (!nodeOperatorsList?.length) {
      return <MessageBox>Node operators list is empty</MessageBox>;
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

                {!isNaN(parseInt(selectedNodeOperators[fieldIndex]?.id)) ? (
                  <MotionInfoBox>
                    Current reward address:{' '}
                    {
                      nodeOperatorsList[
                        Number(selectedNodeOperators[fieldIndex].id)
                      ].rewardAddress
                    }
                  </MotionInfoBox>
                ) : null}

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.newRewardAddress`}
                    label="New reward address"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const valueAddress = getAddress(value);

                        const idInAddressMap = rewardAddressesMap[valueAddress];

                        /*
                        Although the specification does not yet state this,
                        according to the code, the new reward address should not match
                        any of the reward addresses of other operator nodes.
                        */
                        if (typeof idInAddressMap === 'number') {
                          return 'Address must not be in use by another node operator';
                        }

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ newRewardAddress }, index) =>
                              newRewardAddress &&
                              getAddress(newRewardAddress) === valueAddress &&
                              fieldIndex !== index,
                          );

                        /*
                        Same as above, each reward address must be unique within the update.
                        */
                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update';
                        }

                        if (
                          stETHAddress &&
                          valueAddress === getAddress(stETHAddress)
                        ) {
                          return 'Address must not be stETH address';
                        }
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
