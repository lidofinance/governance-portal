import { utils } from 'ethers';

import { Fragment, useCallback, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, ButtonIcon, Loader, Option } from '@lidofinance/lido-ui';
import { MotionType } from '../../motion-types';
import {
  EcosystemOpsStethTopUp,
  LabsOpsStethTopUp,
  StonksStethTopUp,
  LegoLDOTopUp,
  GasFunderETHTopUp,
} from 'shared/blockchain/contracts';
import { createMotionFormPart } from './create-motion-form-part';
import { useWriteContract } from 'shared/blockchain/hooks/use-write-contract';
import { easyTrackAbi } from 'abi/generated';
import { Address, Hex } from 'viem';
import { ETH_DECIMALS } from 'shared/blockchain/constants';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  useAllowedRecipients,
  usePeriodLimitsData,
} from '../../hooks/use-registry-with-limits';
import { useTransitionLimits } from '../../hooks/use-transition-limits';
import { useTokenByTopUpType } from '../../hooks/use-token-by-top-up-type';
import {
  Fieldset,
  FieldsHeader,
  FieldsHeaderDesc,
  FieldsWrapper,
  MessageBox,
  MotionInfoBox,
  RemoveItemButton,
} from './style';
import {
  MotionLimitProgress,
  MotionLimitProgressWrapper,
} from '../../motion-limit-progress';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { InputHookForm } from '../../../../shared/hook-form/input-hook-form';
import { validateToken } from '../../utils/validate-token';
import { validateTransitionLimit } from '../../utils/validate-transition-limit';
import { checkInputsGreaterThanLimit } from '../../utils/check-inputs-greater-than-limit';
import { periodLimitError } from './start-new-top-up-with-limits-and-custom-token';

export const TOP_UP_WITH_LIMITS_MAP = {
  [MotionType.LegoLDOTopUp]: {
    evmContract: LegoLDOTopUp,
    motionType: MotionType.LegoLDOTopUp,
  },
  [MotionType.GasFunderETHTopUp]: {
    evmContract: GasFunderETHTopUp,
    motionType: MotionType.GasFunderETHTopUp,
  },
  [MotionType.StonksStethTopUp]: {
    evmContract: StonksStethTopUp,
    motionType: MotionType.StonksStethTopUp,
  },
  [MotionType.EcosystemOpsStethTopUp]: {
    evmContract: EcosystemOpsStethTopUp,
    motionType: MotionType.EcosystemOpsStethTopUp,
  },
  [MotionType.LabsOpsStethTopUp]: {
    evmContract: LabsOpsStethTopUp,
    motionType: MotionType.LabsOpsStethTopUp,
  },
};

type Program = {
  address: string;
  amount: string;
};

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof TOP_UP_WITH_LIMITS_MAP;
}) => {
  const evmContract = TOP_UP_WITH_LIMITS_MAP[registryType].evmContract;

  return createMotionFormPart({
    motionType: TOP_UP_WITH_LIMITS_MAP[registryType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: {
      evmScriptFactory: string;
      formData: {
        tokenAddress: string;
        tokenDecimals: number;
        programs: Program[];
      };
      contract: {
        instance: ReturnType<typeof useWriteContract<typeof easyTrackAbi>>;
        address: Address;
      };
    }) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address[]', 'uint256[]'],
        [
          formData.programs.map((p) => utils.getAddress(p.address)),
          formData.programs.map((p) => utils.parseEther(p.amount)),
        ],
      );
      return await contract.instance({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, encodedCallData as Hex],
      });
    },
    getDefaultFormData: () => ({
      tokenAddress: '',
      tokenDecimals: ETH_DECIMALS,
      programs: [{ address: '', amount: '' }] as Program[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { chainId } = useLidoSDK();
      const { address: walletAddress } = useAccount();

      const evmContractInstance = useReadContract(evmContract);

      const { data: trustedCaller, isLoading: isTrustedCallerLoading } =
        useQuery({
          queryKey: ['trustedCaller', evmContractInstance.address, chainId],
          queryFn: () => evmContractInstance.readContract('trustedCaller'),
          enabled: !!walletAddress,
        });

      const isTrustedCallerConnected = trustedCaller === walletAddress;

      const { data: periodLimitsData, isLoading: periodLimitsLoading } =
        usePeriodLimitsData({ registryType });

      const legoDAIRecipients = useAllowedRecipients({ registryType });
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
        if (!legoDAIRecipients.data) return [];
        const thatAddress = selectedPrograms[fieldIdx]?.address;
        const selectedAddresses = selectedPrograms.map(
          ({ address }) => address,
        );
        return legoDAIRecipients.data.filter(
          ({ address }) =>
            !selectedAddresses.includes(address) || address === thatAddress,
        );
      };

      useEffect(() => {
        const recipientsCount = legoDAIRecipients.data?.length || 0;
        const isMoreThanOne = recipientsCount > 1;

        if (isMoreThanOne) return;

        const recipientAddress = legoDAIRecipients.data?.[0].address || '';
        setValue(fieldNames.programs, [
          { address: recipientAddress, amount: '' },
        ]);
      }, [fieldNames.programs, setValue, legoDAIRecipients.data]);

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
        legoDAIRecipients.isLoading ||
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
                  <FieldsHeaderDesc>Recipient #{i + 1}</FieldsHeaderDesc>
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton onClick={() => handleRemoveProgram(i)}>
                      Remove recipient {i + 1}
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
                    label="Top up recipient address"
                    fieldName={`${fieldNames.programs}.${i}.address`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(i).map((program, j) => (
                      <Option key={j} value={program.address}>
                        {program.title}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    label={`${token.label} Amount`}
                    fieldName={`${fieldNames.programs}.${i}.amount`}
                    autoFocus
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

          {legoDAIRecipients.data &&
            fieldsArr.fields.length < legoDAIRecipients.data.length && (
              <Fieldset>
                <ButtonIcon
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddProgram}
                  icon={<Plus />}
                  color="secondary"
                >
                  One more recipient
                </ButtonIcon>
              </Fieldset>
            )}

          {submitAction}
        </>
      );
    },
  });
};
