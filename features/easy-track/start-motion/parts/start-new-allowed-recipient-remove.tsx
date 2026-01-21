import { utils } from 'ethers';
import { MotionType } from '../../motion-types';
import {
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
import { useAccount } from 'wagmi';
import { Fieldset, MessageBox } from './style';
import { Loader, Option } from '@lidofinance/lido-ui';
import { SelectHookForm } from 'shared/hook-form/select-hook-form';
import { Address, Hex } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';

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
};

export const formParts = ({
  registryType,
}: {
  registryType: keyof typeof ALLOWED_RECIPIENT_REMOVE_MAP;
}) => {
  const evmContract = ALLOWED_RECIPIENT_REMOVE_MAP[registryType].evmContract;

  return createMotionFormPart({
    motionType: ALLOWED_RECIPIENT_REMOVE_MAP[registryType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      address: Address;
    }>) => {
      const encodedCallData = new utils.AbiCoder().encode(
        ['address'],
        [utils.getAddress(formData.address)],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, encodedCallData as Hex],
      });
    },
    getDefaultFormData: () => ({
      address: '' as Address,
    }),
    Component: function StartNewMotionMotionFormLego({
      fieldNames,
      submitAction,
    }) {
      const { chainId } = useLidoSDK();
      const allowedRecipients = useAllowedRecipients({ registryType });
      const { address: walletAddress } = useAccount();
      const evmContractInstance = useReadContract(evmContract);

      const { data: trustedCaller, isLoading: isTrustedCallerLoading } =
        useQuery({
          queryKey: ['trustedCaller', evmContractInstance.address, chainId],
          queryFn: () => evmContractInstance.readContract('trustedCaller'),
          enabled: !!walletAddress,
        });

      const isTrustedCallerConnected = trustedCaller === walletAddress;

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
};
