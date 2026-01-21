import { utils } from 'ethers';

import { Fragment, useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ButtonIcon, Loader, Option, Plus } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import {
  useAllowedRecipients,
  usePeriodLimitsData,
} from 'features/easy-track/hooks/use-registry-with-limits';

import { useTransitionLimits } from 'features/easy-track/hooks/use-transition-limits';
import { MotionType } from '../../motion-types';
import {
  AllianceOpsStablesTopUp,
  AtcStablesTopUp,
  EasyTrack,
  EcosystemOpsStablesTopUp,
  LabsOpsStablesTopUp,
  LegoStablesTopUp,
  PmlStablesTopUp,
  RccStablesTopUp,
  SandboxStablesTopUp,
  StonksStablesTopUp,
} from 'shared/blockchain/contracts';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { Address, Hex } from 'viem';
import { useWeb3 } from 'reef-knot/web3-react';

import { useAllowedTokens } from 'features/easy-track/hooks/use-allowed-tokens-registry';
import { getScriptFactoryByMotionType } from '../../utils/get-motion-type';

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
} from 'features/easy-track/motion-limit-progress';

import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { AddressPop } from 'shared/components/address-pop';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { validateToken } from '../../utils/validate-token';
import { validateTransitionLimit } from '../../utils/validate-transition-limit';
import { checkInputsGreaterThanLimit } from '../../utils/check-inputs-greater-than-limit';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { ETH_DECIMALS } from 'shared/blockchain/constants';
import { useTrustedCaller } from '../../hooks/use-trusted-caller';

export const TOP_UP_WITH_LIMITS_MAP = {
  [MotionType.RccStablesTopUp]: {
    evmContract: RccStablesTopUp,
    motionType: MotionType.RccStablesTopUp,
  },
  [MotionType.PmlStablesTopUp]: {
    evmContract: PmlStablesTopUp,
    motionType: MotionType.PmlStablesTopUp,
  },
  [MotionType.AtcStablesTopUp]: {
    evmContract: AtcStablesTopUp,
    motionType: MotionType.AtcStablesTopUp,
  },
  [MotionType.SandboxStablesTopUp]: {
    evmContract: SandboxStablesTopUp,
    motionType: MotionType.SandboxStablesTopUp,
  },
  [MotionType.LegoStablesTopUp]: {
    evmContract: LegoStablesTopUp,
    motionType: MotionType.LegoStablesTopUp,
  },
  [MotionType.StonksStablesTopUp]: {
    evmContract: StonksStablesTopUp,
    motionType: MotionType.StonksStablesTopUp,
  },
  [MotionType.AllianceOpsStablesTopUp]: {
    evmContract: AllianceOpsStablesTopUp,
    motionType: MotionType.AllianceOpsStablesTopUp,
  },
  [MotionType.EcosystemOpsStablesTopUp]: {
    evmContract: EcosystemOpsStablesTopUp,
    motionType: MotionType.EcosystemOpsStablesTopUp,
  },
  [MotionType.LabsOpsStablesTopUp]: {
    evmContract: LabsOpsStablesTopUp,
    motionType: MotionType.LabsOpsStablesTopUp,
  },
};

type Program = {
  address: string;
  amount: string;
};

export const periodLimitError = () =>
  'The top-up is higher than the remaining current period limit';

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof TOP_UP_WITH_LIMITS_MAP;
}) =>
  createMotionFormPart({
    motionType: TOP_UP_WITH_LIMITS_MAP[registryType].motionType,
    getDefaultFormData: () => ({
      tokenAddress: '',
      tokenDecimals: ETH_DECIMALS,
      programs: [{ address: '', amount: '' }] as Program[],
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { account: walletAddress } = useWeb3();
      const { chainId } = useLidoSDK();

      const { data: trustedCaller, isLoading: isTrustedCallerLoading } =
        useTrustedCaller({
          evmContract: TOP_UP_WITH_LIMITS_MAP[registryType].evmContract,
        });

      const isTrustedCallerConnected = trustedCaller === walletAddress;

      const {
        allowedTokens,
        tokensDecimalsMap,
        isLoading: isTokensDataLoading,
      } = useAllowedTokens();
      const { data: periodLimitsData, isLoading: isPeriodLimitsDataLoading } =
        usePeriodLimitsData({ registryType });

      const { data: actualRecipients, isLoading: isRecipientsDataLoading } =
        useAllowedRecipients({ registryType });

      const fieldsArr = useFieldArray({ name: fieldNames.programs });

      const handleAddProgram = () =>
        fieldsArr.append({ address: '', amount: '' });

      const { watch, setValue, trigger } = useFormContext();
      const selectedPrograms: Program[] = watch(fieldNames.programs);
      const selectedTokenAddress: string = watch(fieldNames.tokenAddress);
      const selectedTokenDecimals: number = watch(fieldNames.tokenDecimals);

      const selectedTokenLabel = useMemo(() => {
        if (!selectedTokenAddress || !allowedTokens?.length) {
          return '';
        }
        return allowedTokens.find(
          ({ address }) => address === selectedTokenAddress,
        )?.label;
      }, [allowedTokens, selectedTokenAddress]);

      const newAmount = selectedPrograms.reduce(
        (acc, program) => acc + Number(program.amount),
        0,
      );

      const getFilteredOptions = (fieldIdx: number) => {
        if (!actualRecipients) return [];
        const thatAddress = selectedPrograms[fieldIdx]?.address;
        const selectedAddresses = selectedPrograms.map(
          ({ address }) => address,
        );
        return actualRecipients.filter(
          ({ address }) =>
            !selectedAddresses.includes(address) || address === thatAddress,
        );
      };

      useEffect(() => {
        if (selectedTokenAddress) {
          selectedPrograms.forEach((program, idx) => {
            if (program.amount) {
              void trigger(`${fieldNames.programs}.${idx}.amount`);
            }
          });
        }
      }, [
        fieldNames.programs,
        selectedPrograms,
        selectedTokenAddress,
        trigger,
      ]);

      useEffect(() => {
        const recipientsCount = actualRecipients?.length || 0;
        const isMoreThanOne = recipientsCount > 1;

        if (isMoreThanOne) return;

        const recipientAddress = actualRecipients?.[0].address || '';
        setValue(fieldNames.programs, [
          { address: recipientAddress, amount: '' },
        ]);
      }, [fieldNames.programs, setValue, actualRecipients]);

      const { data: limits, isLoading: isTransitionLimitsDataLoading } =
        useTransitionLimits();

      // Get EasyTrack contract instance for validation
      const easyTrackInstance = useReadContract(EasyTrack);

      // Validate EVM script factory
      const { data: isValidFactory, isLoading: isFactoryValidationLoading } =
        useQuery({
          queryKey: [
            'evmScriptFactoryValidation',
            TOP_UP_WITH_LIMITS_MAP[registryType].motionType,
            chainId,
          ],
          queryFn: async () => {
            const scriptFactory = getScriptFactoryByMotionType(
              chainId,
              TOP_UP_WITH_LIMITS_MAP[registryType].motionType,
            );
            if (!scriptFactory) return false;

            return await easyTrackInstance.readContract('isEVMScriptFactory', [
              scriptFactory,
            ]);
          },
          enabled: !!chainId,
        });

      const transitionLimit =
        selectedTokenAddress && limits
          ? limits[utils.getAddress(selectedTokenAddress)]
          : null;

      if (
        isTrustedCallerLoading ||
        isRecipientsDataLoading ||
        isPeriodLimitsDataLoading ||
        isTransitionLimitsDataLoading ||
        isTokensDataLoading ||
        isFactoryValidationLoading
      ) {
        return <Loader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      if (isValidFactory === false) {
        return (
          <MessageBox>
            EVM Script Factory for this motion type is not registered in Easy
            Track. Please contact the administrator.
          </MessageBox>
        );
      }

      return (
        <>
          <Fieldset>
            <SelectHookForm
              label="Top up token"
              fieldName={fieldNames.tokenAddress}
              rules={{ required: 'Field is required' }}
              onChange={(value) => {
                const tokenDecimals = tokensDecimalsMap?.[value as string];
                if (tokenDecimals) {
                  setValue(fieldNames.tokenDecimals, tokenDecimals);
                }
              }}
            >
              {allowedTokens?.map((token, j) => (
                <Option key={j} value={token.address}>
                  {token.label}
                </Option>
              ))}
            </SelectHookForm>
          </Fieldset>
          {selectedTokenAddress && (
            <MotionInfoBox>
              <Text as={'span'} size={12} weight={500}>
                {selectedTokenLabel || 'Token'} address:{' '}
              </Text>
              <AddressPop address={selectedTokenAddress}>
                {selectedTokenAddress}
              </AddressPop>
            </MotionInfoBox>
          )}
          {periodLimitsData?.periodData && selectedTokenAddress && (
            <MotionLimitProgressWrapper>
              <MotionLimitProgress
                spentAmount={periodLimitsData.periodData.alreadySpentAmount}
                totalLimit={periodLimitsData.limits.limit}
                startDate={periodLimitsData.periodData.periodStartTimestamp}
                endDate={periodLimitsData.periodData.periodEndTimestamp}
                token={selectedTokenLabel}
                newAmount={newAmount}
              />
            </MotionLimitProgressWrapper>
          )}

          {fieldsArr.fields.map((item, fieldIdx) => (
            <Fragment key={item.id}>
              <FieldsWrapper>
                <FieldsHeader>
                  <FieldsHeaderDesc>Recipient #{fieldIdx + 1}</FieldsHeaderDesc>
                  {fieldsArr.fields.length > 1 && (
                    <RemoveItemButton
                      onClick={() => fieldsArr.remove(fieldIdx)}
                    >
                      Remove recipient {fieldIdx + 1}
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
                    fieldName={`${fieldNames.programs}.${fieldIdx}.address`}
                    rules={{ required: 'Field is required' }}
                  >
                    {getFilteredOptions(fieldIdx).map((program, j) => (
                      <Option key={j} value={program.address}>
                        {program.title}
                      </Option>
                    ))}
                  </SelectHookForm>
                </Fieldset>

                <Fieldset>
                  <InputHookForm
                    label={`${selectedTokenLabel} Amount`}
                    fieldName={`${fieldNames.programs}.${fieldIdx}.amount`}
                    disabled={!selectedTokenAddress}
                    rules={{
                      required: 'Field is required',
                      validate: (value: string) => {
                        const tokenError = validateToken(
                          value,
                          selectedTokenDecimals,
                        );
                        if (tokenError) {
                          return tokenError;
                        }

                        const transitionLimitError = validateTransitionLimit(
                          value,
                          transitionLimit,
                          selectedTokenLabel,
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
                            currentValue: {
                              value: Number(value),
                              index: fieldIdx,
                            },
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

          {actualRecipients &&
            fieldsArr.fields.length < actualRecipients.length && (
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
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      tokenAddress: string;
      tokenDecimals: number;
      programs: Program[];
    }>) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address', 'address[]', 'uint256[]'],
        [
          utils.getAddress(formData.tokenAddress),
          formData.programs.map((p: Program) => utils.getAddress(p.address)),
          formData.programs.map((p: Program) =>
            utils.parseUnits(p.amount, formData.tokenDecimals),
          ),
        ],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, encodedCallData as Hex],
      });
    },
  });
