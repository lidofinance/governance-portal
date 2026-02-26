import { utils } from 'ethers';

import { Fragment, useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Loader, Option } from '@lidofinance/lido-ui';
import { MotionType } from '../../motion-types';
import {
  AllowedRecipientTopUpTrpLdo,
  RewardsShareProgramTopUp,
  StethGasSupplyTopUp,
  StethRewardProgramTopUp,
  SandboxStethTopUp,
  StonksStethTopUp,
} from 'shared/blockchain/contracts';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import {
  useAllowedRecipients,
  usePeriodLimitsData,
} from '../../hooks/use-registry-with-limits';
import { useTokenByTopUpType } from '../../hooks/use-token-by-top-up-type';
import { Address, Hex } from 'viem';
import { useTransitionLimits } from '../../hooks/use-transition-limits';
import {
  MotionLimitProgress,
  MotionLimitProgressWrapper,
} from '../../motion-limit-progress';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  MessageBox,
  MotionInfoBox,
  RemoveItemButton,
} from './style';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateToken } from '../../utils/validate-token';
import { validateTransitionLimit } from '../../utils/validate-transition-limit';
import { checkInputsGreaterThanLimit } from '../../utils/check-inputs-greater-than-limit';
import { periodLimitError } from './start-new-top-up-with-limits-and-custom-token';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';

type Program = {
  address: string;
  amount: string;
};

export const ALLOWED_RECIPIENT_TOPUP_MAP = {
  [MotionType.AllowedRecipientTopUpTrpLdo]: {
    evmContract: AllowedRecipientTopUpTrpLdo,
    motionType: MotionType.AllowedRecipientTopUpTrpLdo,
  },
  [MotionType.StethRewardProgramTopUp]: {
    evmContract: StethRewardProgramTopUp,
    motionType: MotionType.StethRewardProgramTopUp,
  },
  [MotionType.StethGasSupplyTopUp]: {
    evmContract: StethGasSupplyTopUp,
    motionType: MotionType.StethGasSupplyTopUp,
  },
  [MotionType.RewardsShareProgramTopUp]: {
    evmContract: RewardsShareProgramTopUp,
    motionType: MotionType.RewardsShareProgramTopUp,
  },
  [MotionType.SandboxStethTopUp]: {
    evmContract: SandboxStethTopUp,
    motionType: MotionType.SandboxStethTopUp,
  },
  [MotionType.StonksStethTopUp]: {
    evmContract: StonksStethTopUp,
    motionType: MotionType.StonksStethTopUp,
  },
};

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof ALLOWED_RECIPIENT_TOPUP_MAP;
}) =>
  createMotionFormPart({
    motionType: ALLOWED_RECIPIENT_TOPUP_MAP[registryType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      tokenAddress: string;
      programs: Program[];
    }>) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address[]', 'uint256[]'],
        [
          formData.programs.map((p) => utils.getAddress(p.address)),
          formData.programs.map((p) => utils.parseEther(p.amount)),
        ],
      );
      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, encodedCallData as Hex],
      });
    },
    getDefaultFormData: () => ({
      tokenAddress: '',
      programs: [{ address: '', amount: '' }] as Program[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(
          ALLOWED_RECIPIENT_TOPUP_MAP[registryType].evmContract,
        );

      const { data: periodLimitsData, isLoading: periodLimitsLoading } =
        usePeriodLimitsData({ registryType });
      const allowedRecipients = useAllowedRecipients({ registryType });
      const token = useTokenByTopUpType({ registryType });

      const fieldsArr = useFieldArray({ name: fieldNames.programs });

      const handleAddProgram = useCallback(
        () => fieldsArr.append({ address: '', amount: '' }),
        [fieldsArr],
      );

      const handleRemoveProgram = useCallback(
        (i: number) => fieldsArr.remove(i),
        [fieldsArr],
      );

      const { watch, setValue } = useFormContext();
      const selectedPrograms: Program[] = watch(fieldNames.programs);

      const newAmount = selectedPrograms.reduce(
        (acc, program) => acc + Number(program.amount),
        0,
      );

      const getFilteredOptions = (fieldIdx: number) => {
        if (!allowedRecipients.data) return [];
        const thatAddress = selectedPrograms[fieldIdx]?.address;
        const selectedAddresses = selectedPrograms.map(
          ({ address }) => address,
        );
        return allowedRecipients.data.filter(
          ({ address }) =>
            !selectedAddresses.includes(address) || address === thatAddress,
        );
      };

      useEffect(() => {
        const recipientsCount = allowedRecipients.data?.length || 0;
        const isMoreThanOne = recipientsCount > 1;

        if (isMoreThanOne) return;

        const recipientAddress = allowedRecipients.data?.[0]?.address || '';
        if (!recipientAddress) return;

        setValue(fieldNames.programs, [{ address: recipientAddress }]);
      }, [fieldNames.programs, setValue, allowedRecipients.data]);

      const { data: limits, isLoading: isTransitionLimitsDataLoading } =
        useTransitionLimits();

      const tokenAddress =
        typeof token.address === 'object'
          ? token.address.actual
          : token.address;

      const transitionLimit =
        tokenAddress && limits?.[utils.getAddress(tokenAddress)];

      if (
        isTrustedCallerLoading ||
        allowedRecipients.isLoading ||
        isTransitionLimitsDataLoading ||
        periodLimitsLoading
      ) {
        return <Loader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      return (
        <>
          {periodLimitsData?.periodData && (
            <MotionLimitProgressWrapper>
              <MotionLimitProgress
                spentAmount={periodLimitsData.periodData.alreadySpentAmount}
                totalLimit={periodLimitsData.limits.limit}
                startDate={periodLimitsData.periodData.periodStartTimestamp}
                endDate={periodLimitsData.periodData.periodEndTimestamp}
                token={token.label}
                newAmount={newAmount}
              />
            </MotionLimitProgressWrapper>
          )}

          {fieldsArr.fields.map((item, i) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  {fieldsArr.fields.length > 1 && (
                    <FieldsHeaderDesc>Program #{i + 1}</FieldsHeaderDesc>
                  )}
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                      Remove program {i + 1}
                    </RemoveItemButton>
                  )}
                </FieldsHeader>
                {periodLimitsData?.isEndInNextPeriod && (
                  <MotionInfoBox>
                    The motion is ending in the next period. The transfer limit
                    would be replenished by that time.
                  </MotionInfoBox>
                )}
                <Fieldset>
                  <SelectHookForm
                    label="Recipient address"
                    fieldName={`${fieldNames.programs}.${i}.address`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(i).map((program, j) => (
                      <Option key={j} value={program.address}>
                        {program.title || program.address}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    label={`${token.label} Amount`}
                    fieldName={`${fieldNames.programs}.${i}.amount`}
                    rules={{
                      required: 'Field is required',
                      validate: (value) => {
                        const tokenError = validateToken(value);
                        if (tokenError) {
                          return tokenError;
                        }

                        const transitionLimitError = validateTransitionLimit(
                          value,
                          transitionLimit,
                          token.label,
                        );
                        if (transitionLimitError) {
                          return transitionLimitError;
                        }

                        const isLargeThenPeriodLimit =
                          checkInputsGreaterThanLimit({
                            inputValues: selectedPrograms,
                            spendableBalanceInPeriod: Number(
                              periodLimitsData?.periodData
                                .spendableBalanceInPeriod,
                            ),
                            currentValue: { value, index: i },
                          });

                        if (
                          periodLimitsData?.periodData
                            .spendableBalanceInPeriod &&
                          isLargeThenPeriodLimit
                        ) {
                          return periodLimitError();
                        }
                        return true;
                      },
                    }}
                  />
                </Fieldset>
              </FieldsWrapper>
            </Fragment>
          ))}

          {allowedRecipients.data &&
            fieldsArr.fields.length < allowedRecipients.data.length && (
              <Fieldset>
                <ButtonIcon
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddProgram}
                  icon={<Plus />}
                  color="secondary"
                >
                  One more program
                </ButtonIcon>
              </Fieldset>
            )}

          {submitAction}
        </>
      );
    },
  });
