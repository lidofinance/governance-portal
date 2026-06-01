import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { encodeAbiParameters, parseEther } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { PageLoader } from 'shared/components/page-loader';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import {
  CSMReportWithdrawalsForSlashedValidators,
  CuratedReportWithdrawalsForSlashedValidators,
} from 'shared/blockchain/contracts';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';

import { MotionType } from '../../motion-types';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { validateUintValue } from '../../utils/validate-uint-value';
import { validateEtherValue } from 'utils/validate-ether-value';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  MessageBox,
  RemoveItemButton,
} from './style';
import { stakingModuleAbi } from 'abi/generated';

type Report = {
  id: string;
  keyIndex: string;
  exitBalance: string;
  slashingPenalty: string;
};

type FormData = {
  reports: Report[];
};

const REPORT_WITHDRAWALS_FOR_SLASHED_VALIDATORS_MAP = {
  [MotionType.CSMReportWithdrawalsForSlashedValidators]: {
    motionType: MotionType.CSMReportWithdrawalsForSlashedValidators,
    factory: CSMReportWithdrawalsForSlashedValidators,
  },
  [MotionType.CuratedReportWithdrawalsForSlashedValidators]: {
    motionType: MotionType.CuratedReportWithdrawalsForSlashedValidators,
    factory: CuratedReportWithdrawalsForSlashedValidators,
  },
} as const;

export const formParts = ({
  motionType,
}: {
  motionType: keyof typeof REPORT_WITHDRAWALS_FOR_SLASHED_VALIDATORS_MAP;
}) =>
  createMotionFormPart({
    motionType:
      REPORT_WITHDRAWALS_FOR_SLASHED_VALIDATORS_MAP[motionType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<FormData>) => {
      const sortedReports = [...formData.reports].sort(
        (a, b) => Number(a.id) - Number(b.id),
      );

      const encodedCallData = encodeAbiParameters(
        [
          {
            type: 'tuple[]',
            components: [
              { name: 'nodeOperatorId', type: 'uint256' },
              { name: 'keyIndex', type: 'uint256' },
              { name: 'exitBalance', type: 'uint256' },
              { name: 'slashingPenalty', type: 'uint256' },
              { name: 'isSlashed', type: 'bool' },
            ],
          },
        ],
        [
          sortedReports.map(
            ({ id, keyIndex, exitBalance, slashingPenalty }) => ({
              nodeOperatorId: BigInt(id),
              keyIndex: BigInt(keyIndex),
              exitBalance: parseEther(exitBalance),
              slashingPenalty: parseEther(slashingPenalty),
              isSlashed: true,
            }),
          ),
        ],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory, encodedCallData],
      });
    },
    getDefaultFormData: (): FormData => ({
      reports: [{ id: '', keyIndex: '', exitBalance: '', slashingPenalty: '' }],
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { chainId } = useLidoSDK();
      const { factory } =
        REPORT_WITHDRAWALS_FOR_SLASHED_VALIDATORS_MAP[motionType];

      const factoryContract = useReadContract(factory);
      const readModuleContract = useReadContractGetter(stakingModuleAbi);

      const { data: factoryData, isLoading: isFactoryDataLoading } = useQuery({
        queryKey: [
          'report-withdrawals-for-slashed-validators-data',
          motionType,
          chainId,
        ],
        queryFn: async () => {
          const stakingModuleAddress =
            await factoryContract.readContract('module');

          const nodeOperatorsCount = await readModuleContract(
            stakingModuleAddress,
          )('getNodeOperatorsCount');

          return {
            stakingModuleAddress,
            nodeOperatorsCount: Number(nodeOperatorsCount),
          };
        },
      });

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(factory);

      const fieldsArr = useFieldArray({ name: fieldNames.reports });
      const { watch } = useFormContext();
      const selectedReports: Report[] = watch(fieldNames.reports);

      const handleAddReport = () =>
        fieldsArr.append({
          id: '',
          keyIndex: '',
          exitBalance: '',
          slashingPenalty: '',
        });

      if (isTrustedCallerLoading || isFactoryDataLoading) {
        return <PageLoader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      if (!factoryData?.nodeOperatorsCount) {
        return <MessageBox>There are no node operators</MessageBox>;
      }

      return (
        <>
          {fieldsArr.fields.map((item, fieldIndex) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>
                      Report #{fieldIndex + 1}
                    </FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIndex)}
                    >
                      Remove report {fieldIndex + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.id`}
                    label="Node operator ID"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const uintError = validateUintValue(value);
                        if (uintError) {
                          return uintError;
                        }

                        if (Number(value) >= factoryData.nodeOperatorsCount) {
                          return 'Invalid node operator ID';
                        }

                        const isAlreadyInInput = selectedReports.some(
                          ({ id }, index) =>
                            id === value && index !== fieldIndex,
                        );

                        if (isAlreadyInInput) {
                          return 'ID is already in use by another report';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.keyIndex`}
                    label="Key index"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => validateUintValue(value) ?? true,
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.exitBalance`}
                    label="Exit balance (ETH)"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const amountError = validateEtherValue(value);
                        if (amountError) {
                          return amountError;
                        }

                        if (parseEther(value) === 0n) {
                          return 'Exit balance must be greater than zero';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.slashingPenalty`}
                    label="Slashing penalty (ETH)"
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const amountError = validateEtherValue(value);
                        if (amountError) {
                          return amountError;
                        }

                        if (parseEther(value) === 0n) {
                          return 'Slashing penalty must be greater than zero';
                        }

                        return true;
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}

          {selectedReports.length < factoryData.nodeOperatorsCount && (
            <Fieldset>
              <ButtonIcon
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAddReport}
                icon={<Plus />}
                color="secondary"
              >
                One more report
              </ButtonIcon>
            </Fieldset>
          )}

          {submitAction}
        </>
      );
    },
  });
