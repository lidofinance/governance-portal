import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { stakingRouterAbi } from 'abi/generated';
import { PageLoader } from 'shared/components/page-loader';
import { useLidoSDK } from 'providers/lido-sdk';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';
import { UpdateStakingModuleShareLimits as UpdateStakingModuleShareLimitsContract } from 'shared/blockchain/contracts';
import { ValidatedInputHookForm } from 'shared/hook-form/validated-input-hook-form';

import { ErrorBox, Fieldset, MessageBox } from './style';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { validateUintValue } from '../../utils/validate-uint-value';
import { MAX_BP } from '@easy-track/constants';
import { formatBp } from '@easy-track/vaults/utils/format-vault-param';
import { BpValueFormatted } from '@easy-track/vaults/ui/bp-value-formatted';

type FormData = {
  newStakeShareLimit: string;
  newPriorityExitShareThreshold: string;
  // Mirrored from chain so populateTx (no React context) can read at submit.
  currentStakeShareLimit: string;
  currentPriorityExitShareThreshold: string;
};

export const formParts = createMotionFormPart({
  motionType: MotionType.UpdateStakingModuleShareLimits,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<FormData>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('uint16, uint16, uint16, uint16'),
      [
        Number(formData.currentStakeShareLimit),
        Number(formData.newStakeShareLimit),
        Number(formData.currentPriorityExitShareThreshold),
        Number(formData.newPriorityExitShareThreshold),
      ],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: (): FormData => ({
    newStakeShareLimit: '',
    newPriorityExitShareThreshold: '',
    currentStakeShareLimit: '',
    currentPriorityExitShareThreshold: '',
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { chainId } = useLidoSDK();
    const formMethods = useFormContext();
    const { watch, setValue, getValues } = formMethods;

    const factoryContract = useReadContract(
      UpdateStakingModuleShareLimitsContract,
    );
    const readStakingRouter = useReadContractGetter(stakingRouterAbi);

    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(UpdateStakingModuleShareLimitsContract);

    const {
      data: factoryData,
      isLoading: isFactoryDataLoading,
      error: factoryDataError,
    } = useQuery({
      queryKey: [
        'update-staking-module-share-limits-factory-data',
        chainId,
        factoryContract.address,
      ],
      enabled: !!factoryContract.address,
      staleTime: Infinity,
      queryFn: async () => {
        const [
          stakingRouterAddress,
          stakingModuleId,
          maxStakeShareLimitIncrease,
          maxStakeShareLimitDecrease,
          maxPriorityExitShareThresholdIncrease,
          maxPriorityExitShareThresholdDecrease,
        ] = await Promise.all([
          factoryContract.readContract('stakingRouter'),
          factoryContract.readContract('stakingModuleId'),
          factoryContract.readContract('maxStakeShareLimitIncrease'),
          factoryContract.readContract('maxStakeShareLimitDecrease'),
          factoryContract.readContract('maxPriorityExitShareThresholdIncrease'),
          factoryContract.readContract('maxPriorityExitShareThresholdDecrease'),
        ]);

        const stakingModule = await readStakingRouter(stakingRouterAddress)(
          'getStakingModule',
          [stakingModuleId],
        );

        return {
          moduleName: stakingModule.name,
          moduleId: stakingModuleId.toString(),
          maxStakeShareLimitIncrease,
          maxStakeShareLimitDecrease,
          maxPriorityExitShareThresholdIncrease,
          maxPriorityExitShareThresholdDecrease,
          currentStakeShareLimit: stakingModule.stakeShareLimit,
          currentPriorityExitShareThreshold:
            stakingModule.priorityExitShareThreshold,
        };
      },
    });

    // Mirror chain values into form state so populateTx can read them at submit
    useEffect(() => {
      if (factoryData) {
        setValue(
          fieldNames.currentStakeShareLimit,
          String(factoryData.currentStakeShareLimit),
        );
        setValue(
          fieldNames.currentPriorityExitShareThreshold,
          String(factoryData.currentPriorityExitShareThreshold),
        );
      }
    }, [
      factoryData,
      setValue,
      fieldNames.currentStakeShareLimit,
      fieldNames.currentPriorityExitShareThreshold,
    ]);

    const validateBpValue = (value: string) => {
      const uintErr = validateUintValue(value);
      if (uintErr) {
        return uintErr;
      }

      const parsed = Number(value);
      if (parsed > MAX_BP) {
        return `Value must not exceed ${MAX_BP} BP`;
      }

      return undefined;
    };

    const validateRelations = (stakeRaw: string, priorityRaw: string) => {
      if (
        !factoryData ||
        stakeRaw === '' ||
        validateUintValue(stakeRaw) ||
        priorityRaw === '' ||
        validateUintValue(priorityRaw)
      ) {
        return undefined;
      }

      const stake = Number(stakeRaw);
      const priority = Number(priorityRaw);

      if (stake > priority) {
        return 'Stake share limit must not exceed priority exit share threshold';
      }

      if (
        stake === factoryData.currentStakeShareLimit &&
        priority === factoryData.currentPriorityExitShareThreshold
      ) {
        return 'At least one value must differ from the current value';
      }

      return undefined;
    };

    const validateNewStakeShareLimit = (value: string) => {
      const baseErr = validateBpValue(value);
      if (baseErr) {
        return baseErr;
      }

      if (!factoryData) {
        return undefined;
      }

      const valueNum = Number(value);
      const delta = valueNum - factoryData.currentStakeShareLimit;
      if (delta > factoryData.maxStakeShareLimitIncrease) {
        return `Increase exceeds max allowed (${factoryData.maxStakeShareLimitIncrease} BP)`;
      }

      if (-delta > factoryData.maxStakeShareLimitDecrease) {
        return `Decrease exceeds max allowed (${factoryData.maxStakeShareLimitDecrease} BP)`;
      }

      return validateRelations(
        value,
        getValues(fieldNames.newPriorityExitShareThreshold),
      );
    };

    const validateNewPriorityExitShareThreshold = (value: string) => {
      const baseErr = validateBpValue(value);
      if (baseErr) {
        return baseErr;
      }
      if (!factoryData) {
        return undefined;
      }

      const valueNum = Number(value);
      const delta = valueNum - factoryData.currentPriorityExitShareThreshold;
      if (delta > factoryData.maxPriorityExitShareThresholdIncrease) {
        return `Increase exceeds max allowed (${factoryData.maxPriorityExitShareThresholdIncrease} BP)`;
      }
      if (-delta > factoryData.maxPriorityExitShareThresholdDecrease) {
        return `Decrease exceeds max allowed (${factoryData.maxPriorityExitShareThresholdDecrease} BP)`;
      }

      return validateRelations(getValues(fieldNames.newStakeShareLimit), value);
    };

    const currentStakeShareLimitValue = watch(
      fieldNames.currentStakeShareLimit,
    );
    const currentPriorityExitShareThresholdValue = watch(
      fieldNames.currentPriorityExitShareThreshold,
    );

    const isCurrentFormDataSynced =
      !!factoryData &&
      currentStakeShareLimitValue ===
        String(factoryData.currentStakeShareLimit) &&
      currentPriorityExitShareThresholdValue ===
        String(factoryData.currentPriorityExitShareThreshold);

    if (
      isFactoryDataLoading ||
      isTrustedCallerLoading ||
      (factoryData && !isCurrentFormDataSynced)
    ) {
      return <PageLoader />;
    }

    if (factoryDataError || !factoryData) {
      return (
        <ErrorBox>
          {factoryDataError instanceof Error
            ? factoryDataError.message
            : 'Failed to load UpdateStakingModuleShareLimits factory data'}
        </ErrorBox>
      );
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    const stakeShareLimitMin = Math.max(
      0,
      factoryData.currentStakeShareLimit -
        factoryData.maxStakeShareLimitDecrease,
    );
    const stakeShareLimitMax = Math.min(
      MAX_BP,
      factoryData.currentStakeShareLimit +
        factoryData.maxStakeShareLimitIncrease,
    );
    const priorityExitShareThresholdMin = Math.max(
      0,
      factoryData.currentPriorityExitShareThreshold -
        factoryData.maxPriorityExitShareThresholdDecrease,
    );
    const priorityExitShareThresholdMax = Math.min(
      MAX_BP,
      factoryData.currentPriorityExitShareThreshold +
        factoryData.maxPriorityExitShareThresholdIncrease,
    );

    return (
      <>
        <MessageBox>
          Module: <b>{factoryData.moduleName}</b> (ID #{factoryData.moduleId})
          <br />
          Current stake share limit:{' '}
          <b>{formatBp(factoryData.currentStakeShareLimit)}</b>
          <br />
          Current priority exit share threshold:{' '}
          <b>{formatBp(factoryData.currentPriorityExitShareThreshold)}</b>
        </MessageBox>

        <Fieldset>
          <ValidatedInputHookForm
            valueType="number"
            fieldName={fieldNames.newStakeShareLimit}
            label={`New stake share limit (BP, ${stakeShareLimitMin}..${stakeShareLimitMax})`}
            validateSync={validateNewStakeShareLimit}
            rules={{
              required: 'Field is required',
              deps: [fieldNames.newPriorityExitShareThreshold],
            }}
          />
          <BpValueFormatted
            fieldName={fieldNames.newStakeShareLimit}
            label="Stake share limit"
          />
        </Fieldset>

        <Fieldset>
          <ValidatedInputHookForm
            valueType="number"
            fieldName={fieldNames.newPriorityExitShareThreshold}
            label={`New priority exit share threshold (BP, ${priorityExitShareThresholdMin}..${priorityExitShareThresholdMax})`}
            validateSync={validateNewPriorityExitShareThreshold}
            rules={{
              required: 'Field is required',
              deps: [fieldNames.newStakeShareLimit],
            }}
          />
          <BpValueFormatted
            fieldName={fieldNames.newPriorityExitShareThreshold}
            label="Priority exit share threshold"
          />
        </Fieldset>

        {submitAction}
      </>
    );
  },
});
