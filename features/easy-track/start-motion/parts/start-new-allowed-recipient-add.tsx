import { MotionType } from '../../motion-types';
import {
  RewardsShareProgramAdd,
  SandboxStethAdd,
  StethGasSupplyAdd,
  StethRewardProgramAdd,
} from 'shared/blockchain/contracts';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { Address, Hex } from 'viem';
import { utils } from 'ethers';
import { useAllowedRecipients } from '../../hooks/use-registry-with-limits';
import { useMemo } from 'react';
import { Loader } from '@lidofinance/lido-ui';
import { Fieldset, MessageBox } from './style';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';

const ALLOWED_RECIPIENT_ADD_MAP = {
  [MotionType.StethRewardProgramAdd]: {
    evmContract: StethRewardProgramAdd,
    motionType: MotionType.StethRewardProgramAdd,
  },
  [MotionType.StethGasSupplyAdd]: {
    evmContract: StethGasSupplyAdd,
    motionType: MotionType.StethGasSupplyAdd,
  },
  [MotionType.RewardsShareProgramAdd]: {
    evmContract: RewardsShareProgramAdd,
    motionType: MotionType.RewardsShareProgramAdd,
  },
  [MotionType.SandboxStethAdd]: {
    evmContract: SandboxStethAdd,
    motionType: MotionType.SandboxStethAdd,
  },
};

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof ALLOWED_RECIPIENT_ADD_MAP;
}) =>
  createMotionFormPart({
    motionType: ALLOWED_RECIPIENT_ADD_MAP[registryType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      address: string;
      title: string;
    }>) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address', 'string'],
        [utils.getAddress(formData.address), formData.title],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, encodedCallData as Hex],
      });
    },
    getDefaultFormData: () => ({
      address: '',
      title: '',
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const allowedRecipients = useAllowedRecipients({ registryType });

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(ALLOWED_RECIPIENT_ADD_MAP[registryType].evmContract);

      const existedAddresses = useMemo(() => {
        return (allowedRecipients.data || []).map(({ address }) => address);
      }, [allowedRecipients.data]);

      if (isTrustedCallerLoading || allowedRecipients.isLoading) {
        return <Loader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      return (
        <>
          <Fieldset>
            <InputHookForm
              fieldName={fieldNames.title}
              label="Title"
              rules={{ required: 'Field is required' }}
            />
          </Fieldset>

          <Fieldset>
            <InputHookForm
              fieldName={fieldNames.address}
              label="Address"
              rules={{
                required: 'Field is required',
                validate: (value) => {
                  if (!utils.isAddress(value)) return 'Address is not valid';
                  if (existedAddresses.includes(value)) {
                    return 'Allowed recipient with this address already exists';
                  }
                  return true;
                },
              }}
            />
          </Fieldset>

          {submitAction}
        </>
      );
    },
  });
