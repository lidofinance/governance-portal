import { utils } from 'ethers';

import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, Loader } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { TextareaHookForm } from 'shared/hook-form/textarea-hook-form';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { useAccount } from 'wagmi';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { SDVTExitRequestHashesSubmit } from 'shared/blockchain/contracts';
import { MotionType } from 'features/easy-track/motion-types';
import { Address, Hex } from 'viem';
import {
  Fieldset,
  HashRequestBlock,
  HashRequestError,
  HashRequests,
  MessageBox,
  MotionInfoBox,
} from './style';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import {
  ParsingResultData,
  validateAndParseRequestHashes,
} from '../../utils/validate-and-parse-request-hashes';

export const formParts = (stakingModuleType: 'curated' | 'sdvt') =>
  createMotionFormPart({
    motionType:
      stakingModuleType === 'curated'
        ? MotionType.CuratedExitRequestHashesSubmit
        : MotionType.SDVTExitRequestHashesSubmit,

    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<{
      calldata: string;
    }>) => {
      const trimmedCalldata = formData.calldata.trim();

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory as Address, trimmedCalldata as Hex],
      });
    },
    getDefaultFormData: () => ({
      calldata: '',
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { trigger, setError, getValues, formState } = useFormContext();

      const [parsedHashData, setParsedHashData] =
        useState<ParsingResultData | null>(null);

      const { address: connAddress } = useAccount();

      const { data: nodeOperatorsList, isLoading: isNodeOperatorsListLoading } =
        useNodeOperatorsList(stakingModuleType);

      const {
        isTrustedCallerConnected: isTrustedCallerSDVT,
        isTrustedCallerLoading: isTrustedCallerSDVTLoading,
      } = useIsTrustedCaller(SDVTExitRequestHashesSubmit);

      const isTrustedCallerCurated = useMemo(() => {
        if (!nodeOperatorsList || !connAddress) {
          return false;
        }

        return (
          nodeOperatorsList.findIndex(
            (o) =>
              o.rewardAddress &&
              utils.getAddress(o.rewardAddress) ===
                utils.getAddress(connAddress),
          ) !== -1
        );
      }, [nodeOperatorsList, connAddress]);

      const isTrustedCaller =
        stakingModuleType === 'sdvt'
          ? isTrustedCallerSDVT
          : isTrustedCallerCurated;

      const isTrustedCallerLoading =
        stakingModuleType === 'sdvt' ? isTrustedCallerSDVTLoading : false;

      const currentNodeOperator = useMemo(() => {
        if (
          !connAddress ||
          !nodeOperatorsList ||
          stakingModuleType === 'sdvt'
        ) {
          return null;
        }
        return nodeOperatorsList.find(
          (o) =>
            o.rewardAddress &&
            utils.getAddress(o.rewardAddress) === utils.getAddress(connAddress),
        );
      }, [nodeOperatorsList, connAddress]);

      const validateAndParseCalldata = async () => {
        const isCalldataValid = await trigger(fieldNames.calldata);
        if (!isCalldataValid) {
          setError(fieldNames.calldata, { message: 'Invalid calldata' });
          return;
        }
        const calldata = getValues(fieldNames.calldata).trim();
        const validationResult = validateAndParseRequestHashes({
          calldata,
          registryType: stakingModuleType,
          nodeOperatorsCount: nodeOperatorsList?.length || 0,
          nodeOperatorId: currentNodeOperator?.id,
        });
        if (validationResult.error) {
          setError(fieldNames.calldata, { message: validationResult.error });
          setParsedHashData(null);
        }
        setParsedHashData(validationResult.data);
      };

      const handleCalldataChange = () => {
        if (parsedHashData) {
          setParsedHashData(null);
        }
      };

      if (isNodeOperatorsListLoading || isTrustedCallerLoading) {
        return <Loader />;
      }

      if (stakingModuleType === 'sdvt' && !isTrustedCaller) {
        return (
          <MessageBox>You should be connected as trusted caller</MessageBox>
        );
      }

      if (stakingModuleType === 'curated' && !isTrustedCaller) {
        return (
          <MessageBox>You should be connected as node operator</MessageBox>
        );
      }

      const calldataError = (
        formState.errors[fieldNames.calldata.split('.')[0]] as any
      )?.calldata;

      const isFormValid = !calldataError && parsedHashData?.length;

      return (
        <>
          {currentNodeOperator && (
            <MotionInfoBox>
              <Text size={14} weight={800}>
                Connected Node Operator
              </Text>
              <Text size={12} weight={500}>
                {currentNodeOperator.name} (id: {currentNodeOperator.id})
              </Text>
            </MotionInfoBox>
          )}
          <Fieldset>
            <TextareaHookForm
              rows={10}
              label="Calldata"
              placeholder="0x..."
              fieldName={fieldNames.calldata}
              onChange={handleCalldataChange}
              rules={{
                required: 'Field is required',
                validate: (value) => {
                  const trimmedValue = value.trim();
                  if (trimmedValue === '') {
                    return 'Calldata cannot be empty';
                  }

                  if (!utils.isHexString(trimmedValue)) {
                    return 'Calldata must be a valid hex string';
                  }

                  return true;
                },
              }}
            />
          </Fieldset>
          <Fieldset>
            <Button
              type="button"
              fullwidth
              disabled={!!calldataError}
              onClick={validateAndParseCalldata}
            >
              Validate & parse calldata
            </Button>
          </Fieldset>

          {isFormValid ? (
            <>
              <Fieldset>
                <MotionInfoBox>
                  Calldata parsed successfully. You can now submit the motion.
                  Scroll down to examine parsed requests.
                </MotionInfoBox>
                {submitAction}
              </Fieldset>
              <Fieldset>
                <Text size={26} weight={800}>
                  Parsed requests ({parsedHashData.length})
                </Text>
              </Fieldset>
            </>
          ) : null}

          {parsedHashData?.length ? (
            <HashRequests>
              {parsedHashData.map((item, index) => (
                <HashRequestBlock
                  key={index}
                  $withError={item.errors.length > 0}
                >
                  {item.errors.length > 0 ? (
                    <HashRequestError>
                      Error: {item.errors.join('; ')}
                    </HashRequestError>
                  ) : null}
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Module ID:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.moduleId}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Node operator ID:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.nodeOpId}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Validator Index:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.valIndex}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Pubkey Index:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.valPubKeyIndex}
                    </Text>
                  </Text>
                  <Text size={14}>
                    <Text size={14} weight={800} as="span">
                      Pubkey:
                    </Text>{' '}
                    <Text size={14} as="span">
                      {item.value.valPubkey}
                    </Text>
                  </Text>
                </HashRequestBlock>
              ))}
            </HashRequests>
          ) : null}
        </>
      );
    },
  });
