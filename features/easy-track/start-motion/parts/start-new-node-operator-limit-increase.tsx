import {
  encodeAbiParameters,
  parseAbiParameters,
  getAddress,
  Address,
} from 'viem';
import { useMemo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { IncreaseLimitMotionType } from '../../constants';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { getNodeOperatorRegistryType } from 'features/easy-track/utils/get-node-operator-registry-type';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { useNodeOperatorKeysInfo } from '../../hooks/use-node-operator-keys-info';
import { useAccount } from 'wagmi';
import { Loader } from '@lidofinance/lido-ui';
import { Fieldset, MessageBox } from './style';
import { KeysInfoBlock } from '../../motions/ui/keys-info-block';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { validateUintValue } from '../../utils/validate-uint-value';
import { InputNumberHookForm } from 'shared/hook-form/input-number-hook-form';

export const formParts = ({
  motionType,
}: {
  motionType: IncreaseLimitMotionType;
}) =>
  createMotionFormPart({
    motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      nodeOperatorId: string;
      newLimit: string;
    }>) => {
      const encodedCallData = encodeAbiParameters(
        parseAbiParameters('uint256, uint256'),
        [BigInt(formData.nodeOperatorId), BigInt(formData.newLimit)],
      );
      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, encodedCallData],
      });
    },
    getDefaultFormData: () => ({
      newLimit: '',
      nodeOperatorId: '',
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { address: walletAddress } = useAccount();
      const { setValue } = useFormContext();
      const registryType = getNodeOperatorRegistryType(motionType);
      const nodeOperators = useNodeOperatorsList(registryType);
      const keysInfo = useNodeOperatorKeysInfo(registryType);

      const currentNodeOperator = useMemo(() => {
        if (!walletAddress || !nodeOperators.data) {
          return null;
        }
        return nodeOperators.data.find(
          (o) => getAddress(o.rewardAddress) === getAddress(walletAddress),
        );
      }, [nodeOperators.data, walletAddress]);

      const isNodeOperatorConnected = !!currentNodeOperator;

      const connectedKeysInfo = useMemo(() => {
        if (!isNodeOperatorConnected || !keysInfo.data || !walletAddress)
          return null;
        return keysInfo.data.operators?.find(
          (o) => getAddress(o.info.rewardAddress) === getAddress(walletAddress),
        );
      }, [isNodeOperatorConnected, keysInfo.data, walletAddress]);

      useEffect(() => {
        if (currentNodeOperator) {
          setValue(fieldNames.nodeOperatorId, currentNodeOperator.id);
        }
      }, [fieldNames.nodeOperatorId, setValue, currentNodeOperator]);

      if (nodeOperators.isLoading || keysInfo.isLoading) {
        return <Loader />;
      }

      if (!isNodeOperatorConnected) {
        return (
          <MessageBox>You should be connected as node operator</MessageBox>
        );
      }

      const usedSigningKeys = Number(currentNodeOperator.totalVettedValidators);
      const totalSigningKeys = Number(currentNodeOperator.totalAddedValidators);

      const hasInvalidKeys =
        connectedKeysInfo &&
        (connectedKeysInfo.invalid.length > 0 ||
          connectedKeysInfo.duplicates.length > 0);

      if (hasInvalidKeys) {
        return (
          <KeysInfoBlock
            invalidKeys={connectedKeysInfo.invalid}
            duplicateKeys={connectedKeysInfo.duplicates}
            usedSigningKeys={usedSigningKeys}
            totalSigningKeys={totalSigningKeys}
          />
        );
      }

      return (
        <>
          <KeysInfoBlock
            invalidKeys={connectedKeysInfo?.invalid}
            duplicateKeys={connectedKeysInfo?.duplicates}
            usedSigningKeys={usedSigningKeys}
            totalSigningKeys={totalSigningKeys}
          />

          <Fieldset>
            <InputHookForm
              fieldName={fieldNames.nodeOperatorId}
              label={
                <>
                  Node operator <b>{currentNodeOperator.name}</b> with id
                </>
              }
              rules={{ required: 'Field is required' }}
              readOnly
            />
          </Fieldset>

          <Fieldset>
            <InputNumberHookForm
              fieldName={fieldNames.newLimit}
              label={<>New limit (current limit is {usedSigningKeys})</>}
              rules={{
                required: 'Field is required',
                validate: (value) => {
                  const uintError = validateUintValue(value);
                  if (uintError) {
                    return uintError;
                  }
                  const valueNum = Number(value);

                  if (valueNum <= usedSigningKeys) {
                    return 'New limit value should be greater than current';
                  }

                  if (valueNum > totalSigningKeys) {
                    return 'New limit value should be less than or equal to total signing keys';
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
