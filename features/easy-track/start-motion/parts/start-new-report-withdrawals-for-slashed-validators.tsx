import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { encodeAbiParameters, parseEther } from 'viem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { PageLoader } from 'shared/components/page-loader';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';
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

const validatePositiveEther = (value: string) => {
  const amountError = validateEtherValue(value);
  if (amountError) {
    return amountError;
  }

  if (parseEther(value) === 0n) {
    return `Value must be greater than zero`;
  }

  return true;
};

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
      const sortedReports = [...formData.reports].sort((a, b) => {
        const idComp = Number(a.id) - Number(b.id);
        return idComp !== 0 ? idComp : Number(a.keyIndex) - Number(b.keyIndex);
      });

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
      const queryClient = useQueryClient();
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
      const { getValues, trigger } = useFormContext();

      const handleAddReport = () =>
        fieldsArr.append({
          id: '',
          keyIndex: '',
          exitBalance: '',
          slashingPenalty: '',
        });

      const fetchIsValidatorSlashed = (
        nodeOperatorId: string,
        keyIndex: string,
      ) => {
        invariant(
          factoryData?.stakingModuleAddress,
          'staking module address is required to check slashed status',
        );
        return queryClient.fetchQuery({
          queryKey: [
            'is-validator-slashed',
            chainId,
            factoryData.stakingModuleAddress,
            nodeOperatorId,
            keyIndex,
          ],
          queryFn: () =>
            readModuleContract(factoryData.stakingModuleAddress)(
              'isValidatorSlashed',
              [BigInt(nodeOperatorId), BigInt(keyIndex)],
            ),
        });
      };

      const validateKeyIndexSync = (fieldIndex: number) => (value: string) => {
        const uintError = validateUintValue(value);
        if (uintError) {
          return uintError;
        }

        const reports: Report[] = getValues(fieldNames.reports);
        const currentId = reports[fieldIndex]?.id;
        const isDuplicatePair = reports.some(
          (report, index) =>
            index !== fieldIndex &&
            report.id === currentId &&
            report.keyIndex === value,
        );

        if (isDuplicatePair) {
          return 'This node operator and key index pair is already in use';
        }

        return undefined;
      };

      // Verifies onchain that the validator is actually slashed.
      const validateKeyIndexAsync =
        (fieldIndex: number) => async (value: string) => {
          const idValue: string = getValues(
            `${fieldNames.reports}.${fieldIndex}.id`,
          );

          // Defer to the id field's own validators until it has a usable value.
          if (
            !idValue ||
            validateUintValue(idValue) ||
            factoryData?.nodeOperatorsCount === undefined ||
            Number(idValue) >= factoryData.nodeOperatorsCount
          ) {
            return undefined;
          }

          const isSlashed = await fetchIsValidatorSlashed(idValue, value);

          if (isSlashed === null) {
            return 'No slashed status found for this node operator and key index';
          }

          if (!isSlashed) {
            return 'Validator is not slashed for this node operator and key index';
          }

          return undefined;
        };

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

                        // Pair uniqueness and slashed status depend on the id
                        void trigger(
                          `${fieldNames.reports}.${fieldIndex}.keyIndex`,
                        );

                        return true;
                      },
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <ValidatedInputHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.keyIndex`}
                    label="Key index"
                    validateSync={validateKeyIndexSync(fieldIndex)}
                    validateAsync={validateKeyIndexAsync(fieldIndex)}
                    rules={{ required: 'Field is required' }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.exitBalance`}
                    label="Exit balance (ETH)"
                    rules={{
                      required: 'Field is required',
                      validate: validatePositiveEther,
                    }}
                  />
                </Fieldset>

                <Fieldset>
                  <InputNumberHookForm
                    fieldName={`${fieldNames.reports}.${fieldIndex}.slashingPenalty`}
                    label="Slashing penalty (ETH)"
                    rules={{
                      required: 'Field is required',
                      validate: validatePositiveEther,
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}

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

          {submitAction}
        </>
      );
    },
  });
