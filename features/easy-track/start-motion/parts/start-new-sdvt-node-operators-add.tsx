import { utils } from 'ethers';

import { Fragment, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Loader } from '@lidofinance/lido-ui';

import {
  Fieldset,
  MessageBox,
  RemoveItemButton,
  FieldsWrapper,
  FieldsHeader,
  FieldsHeaderDesc,
  ErrorBox,
} from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { Address, Hex } from 'viem';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import {
  AragonAcl,
  SDVTNodeOperatorsAdd,
  SDVTRegistry,
  StETH,
} from 'shared/blockchain/contracts';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import {
  useSDVTOperatorNameLimit,
  useSDVTOperatorsCounts,
} from '../../hooks/use-registry-sdvt';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateNodeOperatorName } from '../../utils/validate-node-operator-name';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { getContractAddress } from 'shared/blockchain/get-contract-address';
import { validateAddress } from 'utils/validate-address';
import { checkAddressForManageSigningKeysRole } from '../../utils/check-address-manager-role';
import { useLidoSDK } from 'providers/lido-sdk';

type NodeOperator = {
  name: string;
  rewardAddress: string;
  managerAddress: string;
};

export const formParts = () =>
  createMotionFormPart({
    motionType: MotionType.SDVTNodeOperatorsAdd,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      nodeOperators: NodeOperator[];
      nodeOperatorsCount: number;
    }>) => {
      const encodedCallData = new utils.AbiCoder().encode(
        [
          'uint256 nodeOperatorsCount',
          'tuple(string name, address rewardAddress, address managerAddress)[]',
        ],
        [
          formData.nodeOperatorsCount,
          formData.nodeOperators.map((item) => ({
            name: item.name,
            rewardAddress: utils.getAddress(item.rewardAddress),
            managerAddress: utils.getAddress(item.managerAddress),
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
        { name: '', rewardAddress: '', managerAddress: '' },
      ] as NodeOperator[],
      nodeOperatorsCount: NaN,
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { setValue, watch } = useFormContext();
      const { chainId } = useLidoSDK();

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(SDVTNodeOperatorsAdd);

      const sdvtRegistry = useReadContract(SDVTRegistry);
      const aragonAcl = useReadContract(AragonAcl);

      const stETHAddress = getContractAddress(StETH, chainId);

      const { data: nodeOperatorsList, isLoading: isNodeOperatorsListLoading } =
        useNodeOperatorsList('sdvt');
      const {
        data: maxNodeOperatorNameLength,
        isLoading: NONameLengthLoading,
      } = useSDVTOperatorNameLimit();

      const { data: NOCounts, isLoading: maxOperatorsLoading } =
        useSDVTOperatorsCounts();

      const fieldsArr = useFieldArray({ name: fieldNames.nodeOperators });
      const selectedNodeOperators: NodeOperator[] = watch(
        fieldNames.nodeOperators,
      );

      useEffect(() => {
        if (typeof NOCounts?.current === 'number') {
          setValue(fieldNames.nodeOperatorsCount, NOCounts.current);
        }
      }, [setValue, NOCounts, fieldNames.nodeOperatorsCount]);

      const nodeOperatorsDetailsMaps = useMemo(() => {
        const result: Record<
          'name' | 'rewardAddress',
          Record<string, number | undefined>
        > = { name: {}, rewardAddress: {} };
        if (!nodeOperatorsList) return result;

        for (const nodeOperator of nodeOperatorsList) {
          result['name'][nodeOperator.name] = nodeOperator.id;
          result['rewardAddress'][nodeOperator.rewardAddress] = nodeOperator.id;
        }

        return result;
      }, [nodeOperatorsList]);

      const handleAddNodeOperators = () =>
        fieldsArr.append({
          name: '',
          rewardAddress: '',
          managerAddress: '',
        } as NodeOperator);

      const handleRemoveNodeOperator = (fieldIndex: number) =>
        fieldsArr.remove(fieldIndex);

      if (
        isTrustedCallerLoading ||
        NONameLengthLoading ||
        maxOperatorsLoading ||
        isNodeOperatorsListLoading
      ) {
        return <Loader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      if (!NOCounts) {
        return <ErrorBox>Cannot load node operators count data</ErrorBox>;
      }

      if (NOCounts.current >= NOCounts.max) {
        return <MessageBox>Node operators limit reached</MessageBox>;
      }

      return (
        <>
          {fieldsArr.fields.map((item, fieldIndex) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      NodeOperator #{NOCounts.current + fieldIndex}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => handleRemoveNodeOperator(fieldIndex)}
                    >
                      Remove node operator {NOCounts.current + fieldIndex}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputHookForm
                    label="Name"
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.name`}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const nameErr = validateNodeOperatorName(
                          value,
                          maxNodeOperatorNameLength,
                        );
                        if (nameErr) {
                          return nameErr;
                        }

                        const idInNameMap =
                          nodeOperatorsDetailsMaps['name'][value];

                        if (typeof idInNameMap === 'number') {
                          return 'Name must not be in use by another node operator';
                        }

                        const nameInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ name }, index) =>
                              name.toLowerCase() === value.toLowerCase() &&
                              fieldIndex !== index,
                          );

                        if (nameInSelectedNodeOperatorsIndex !== -1) {
                          return 'Name is already in use by another update';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    label="Reward address"
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.rewardAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: (value: string) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const valueAddress = utils.getAddress(value);

                        if (
                          stETHAddress &&
                          valueAddress === utils.getAddress(stETHAddress)
                        ) {
                          return 'Address must not be stETH address';
                        }

                        const idInAddressMap =
                          nodeOperatorsDetailsMaps['rewardAddress'][
                            valueAddress
                          ];

                        if (typeof idInAddressMap === 'number') {
                          return 'Address must not be in use by another node operator';
                        }

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ rewardAddress }, index) =>
                              rewardAddress &&
                              utils.getAddress(rewardAddress) ===
                                valueAddress &&
                              fieldIndex !== index,
                          );

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    label={`Manager address`}
                    fieldName={`${fieldNames.nodeOperators}.${fieldIndex}.managerAddress`}
                    rules={{
                      required: 'Field is required',
                      validate: async (value) => {
                        const addressErr = validateAddress(value);
                        if (addressErr) {
                          return addressErr;
                        }

                        const valueAddress = utils.getAddress(value);

                        const addressInSelectedNodeOperatorsIndex =
                          selectedNodeOperators.findIndex(
                            ({ managerAddress }, index) =>
                              managerAddress &&
                              utils.getAddress(managerAddress) ===
                                valueAddress &&
                              fieldIndex !== index,
                          );

                        if (addressInSelectedNodeOperatorsIndex !== -1) {
                          return 'Address is already in use by another update';
                        }

                        const isAlreadyManager =
                          await checkAddressForManageSigningKeysRole(
                            value,
                            sdvtRegistry,
                            aragonAcl,
                          );

                        if (isAlreadyManager) {
                          return 'Address already has a signing keys manager role';
                        }
                        return true;
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}
          {NOCounts.max > fieldsArr.fields.length + NOCounts.current && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddNodeOperators}
                icon={<Plus />}
                color="secondary"
              >
                One more node operator
              </ButtonIcon>
            </Fieldset>
          )}

          {submitAction}
        </>
      );
    },
  });
