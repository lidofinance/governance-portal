import { Fragment } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon } from '@lidofinance/lido-ui';
import { encodeAbiParameters, parseAbiParameters, parseEther } from 'viem';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { PageLoader } from 'shared/components/page-loader';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';
import {
  CuratedSettleGeneralDelayedPenalty,
  CSMSettleGeneralDelayedPenalty,
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
import { formatEth } from 'shared/blockchain/utils';
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
import { stakingModuleAbi, accountingAbi } from 'abi/generated';

type Settle = {
  id: string;
  maxAmount: string;
};

type FormData = {
  settles: Settle[];
};

const SETTLE_GENERAL_DELAYED_PENALTY_MAP = {
  [MotionType.CSMSettleGeneralDelayedPenalty]: {
    motionType: MotionType.CSMSettleGeneralDelayedPenalty,
    factory: CSMSettleGeneralDelayedPenalty,
  },
  [MotionType.CuratedSettleGeneralDelayedPenalty]: {
    motionType: MotionType.CuratedSettleGeneralDelayedPenalty,
    factory: CuratedSettleGeneralDelayedPenalty,
  },
} as const;

export const formParts = ({
  motionType,
}: {
  motionType: keyof typeof SETTLE_GENERAL_DELAYED_PENALTY_MAP;
}) =>
  createMotionFormPart({
    motionType: SETTLE_GENERAL_DELAYED_PENALTY_MAP[motionType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<FormData>) => {
      const sortedSettles = [...formData.settles].sort(
        (a, b) => Number(a.id) - Number(b.id),
      );

      const nodeOperatorIds = sortedSettles.map(({ id }) => BigInt(id));
      const maxAmounts = sortedSettles.map(({ maxAmount }) =>
        parseEther(maxAmount),
      );

      const encodedCallData = encodeAbiParameters(
        parseAbiParameters('uint256[], uint256[]'),
        [nodeOperatorIds, maxAmounts],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory, encodedCallData],
      });
    },
    getDefaultFormData: (): FormData => ({
      settles: [{ id: '', maxAmount: '' }],
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { chainId } = useLidoSDK();
      const queryClient = useQueryClient();

      const { factory } = SETTLE_GENERAL_DELAYED_PENALTY_MAP[motionType];

      const factoryContract = useReadContract(factory);
      const readModuleContract = useReadContractGetter(stakingModuleAbi);
      const readAccountingContract = useReadContractGetter(accountingAbi);

      const { data: factoryData, isLoading: isFactoryDataLoading } = useQuery({
        queryKey: [`settle-general-delayed-penalty-data`, motionType, chainId],
        queryFn: async () => {
          const [stakingModuleAddress, accountingAddress] = await Promise.all([
            factoryContract.readContract('module'),
            factoryContract.readContract('accounting'),
          ]);

          const nodeOperatorsCount = await readModuleContract(
            stakingModuleAddress,
          )('getNodeOperatorsCount');

          return {
            stakingModuleAddress,
            nodeOperatorsCount: Number(nodeOperatorsCount),
            accountingAddress,
          };
        },
      });

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(factory);

      const fieldsArr = useFieldArray({ name: fieldNames.settles });
      const { watch, trigger, getValues } = useFormContext();
      const selectedSettles: Settle[] = watch(fieldNames.settles);

      const handleAddSettle = () => fieldsArr.append({ id: '', maxAmount: '' });

      const buildLockedBondQuery = (nodeOperatorId: string) => ({
        queryKey: [
          'locked-bond',
          chainId,
          factoryData?.accountingAddress,
          nodeOperatorId,
        ],
        queryFn: async () => {
          invariant(
            factoryData?.accountingAddress,
            'accounting address is required to fetch locked bond',
          );

          return await readAccountingContract(factoryData.accountingAddress)(
            'getLockedBond',
            [BigInt(nodeOperatorId)],
          );
        },
      });

      const isIdReadyForLockedBond = (id: string) =>
        Boolean(id) &&
        !validateUintValue(id) &&
        factoryData?.nodeOperatorsCount !== undefined &&
        Number(id) < factoryData.nodeOperatorsCount;

      const lockedBondQueries = useQueries({
        queries: selectedSettles.map(({ id }) => ({
          ...buildLockedBondQuery(id),
          enabled: isIdReadyForLockedBond(id),
        })),
      });

      const fetchLockedBond = (nodeOperatorId: string) => {
        invariant(factoryData, 'factory data is required to fetch locked bond');
        return queryClient.fetchQuery(buildLockedBondQuery(nodeOperatorId));
      };

      const validateMaxAmountAsync =
        (fieldIndex: number) => async (value: string) => {
          const idValue: string = getValues(
            `${fieldNames.settles}.${fieldIndex}.id`,
          );

          // Defer to id field's own validators until it has a usable value
          if (!idValue || validateUintValue(idValue)) {
            return undefined;
          }

          // Validate node operator ID
          if (
            factoryData?.nodeOperatorsCount === undefined ||
            Number(idValue) >= factoryData.nodeOperatorsCount
          ) {
            return undefined;
          }

          const locked = await fetchLockedBond(idValue);
          if (locked === null) {
            return 'Cannot validate value; failed to fetch locked bond';
          }

          if (parseEther(value) < locked) {
            return 'Value must be greater than or equal to currently locked bond for this node operator';
          }
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
          {fieldsArr.fields.map((item, fieldIndex) => {
            const maxAmountFieldName = `${fieldNames.settles}.${fieldIndex}.maxAmount`;
            const lockedBond = lockedBondQueries[fieldIndex]?.data;
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
                      fieldName={`${fieldNames.settles}.${fieldIndex}.id`}
                      label="Node operator ID"
                      rules={{
                        required: 'Field is required',
                        validate: (value) => {
                          const uintError = validateUintValue(value);
                          if (uintError) {
                            return uintError;
                          }
                          const valueNum = Number(value);

                          if (valueNum >= factoryData.nodeOperatorsCount) {
                            return 'Invalid node operator ID';
                          }

                          const isAlreadyInInput = selectedSettles.some(
                            ({ id }, index) =>
                              id === value && index !== fieldIndex,
                          );

                          if (isAlreadyInInput) {
                            return 'ID is already in use by another update';
                          }

                          // Locked bond is keyed on the id; rerun the
                          // dependent maxAmount validator.
                          void trigger(maxAmountFieldName);

                          return true;
                        },
                      }}
                    />
                  </Fieldset>

                  <Fieldset>
                    <ValidatedInputHookForm
                      fieldName={maxAmountFieldName}
                      label={
                        lockedBond != null
                          ? `Max amount to settle (current bond: ${formatEth(lockedBond)})`
                          : 'Max amount to settle'
                      }
                      validateSync={(value) => {
                        const amountError = validateEtherValue(value);
                        if (amountError) {
                          return amountError;
                        }

                        if (parseEther(value) === 0n) {
                          return 'Max amount must be greater than zero';
                        }

                        return undefined;
                      }}
                      validateAsync={validateMaxAmountAsync(fieldIndex)}
                      rules={{ required: 'Field is required' }}
                    />
                  </Fieldset>
                </FieldsWrapper>
              </Fragment>
            );
          })}

          {selectedSettles.length < factoryData.nodeOperatorsCount && (
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
