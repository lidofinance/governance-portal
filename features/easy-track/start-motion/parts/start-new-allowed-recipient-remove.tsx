import { MotionType } from '../../motion-types';
import {
  LOLStablecoinsRemove,
  RewardsShareProgramRemove,
  SandboxStethRemove,
  StethGasSupplyRemove,
  StethRewardProgramRemove,
} from 'shared/blockchain/contracts';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { useAllowedRecipients } from '../../hooks/use-registry-with-limits';
import { Fieldset, MessageBox } from './style';
import { Option } from '@lidofinance/lido-ui';
import { PageLoader } from 'shared/components/page-loader';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import {
  Address,
  encodeAbiParameters,
  getAddress,
  parseAbiParameters,
} from 'viem';
import { useIsTrustedCaller } from '@easy-track/hooks/use-is-trusted-caller';

export const ALLOWED_RECIPIENT_REMOVE_MAP = {
  [MotionType.StethRewardProgramRemove]: {
    evmContract: StethRewardProgramRemove,
    motionType: MotionType.StethRewardProgramRemove,
  },
  [MotionType.StethGasSupplyRemove]: {
    evmContract: StethGasSupplyRemove,
    motionType: MotionType.StethGasSupplyRemove,
  },
  [MotionType.RewardsShareProgramRemove]: {
    evmContract: RewardsShareProgramRemove,
    motionType: MotionType.RewardsShareProgramRemove,
  },
  [MotionType.SandboxStethRemove]: {
    evmContract: SandboxStethRemove,
    motionType: MotionType.SandboxStethRemove,
  },
  [MotionType.LOLStablecoinsRemove]: {
    evmContract: LOLStablecoinsRemove,
    motionType: MotionType.LOLStablecoinsRemove,
  },
};

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof ALLOWED_RECIPIENT_REMOVE_MAP;
}) =>
  createMotionFormPart({
    motionType: ALLOWED_RECIPIENT_REMOVE_MAP[registryType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      address: Address;
    }>) => {
      const encodedCallData = encodeAbiParameters(
        parseAbiParameters('address'),
        [getAddress(formData.address)],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory, encodedCallData],
      });
    },
    getDefaultFormData: () => ({
      address: '' as Address,
    }),
    Component: ({ fieldNames, submitAction }) => {
      const allowedRecipients = useAllowedRecipients({ registryType });

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(
          ALLOWED_RECIPIENT_REMOVE_MAP[registryType].evmContract,
        );

      if (isTrustedCallerLoading || allowedRecipients.isLoading) {
        return <PageLoader />;
      }

      if (!isTrustedCallerConnected) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      return (
        <>
          <Fieldset>
            <SelectHookForm
              label="Allowed recipient address"
              fieldName={fieldNames.address}
              rules={{ required: 'Field is required' }}
            >
              {allowedRecipients.data?.map((program, i) => (
                <Option key={i} value={program.address}>
                  {`${program.title || program.address}`}
                </Option>
              ))}
            </SelectHookForm>
          </Fieldset>

          {submitAction}
        </>
      );
    },
  });
