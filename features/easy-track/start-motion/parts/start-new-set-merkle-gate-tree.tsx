import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Address,
  encodeAbiParameters,
  getAddress,
  isAddress,
  isHex,
  keccak256,
  parseAbiParameters,
  toBytes,
  zeroHash,
} from 'viem';

import {
  CSMSetMerkleGateTree,
  CuratedSetMerkleGateTree,
} from 'shared/blockchain/contracts';
import { ContractObject } from 'shared/blockchain/types';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import { PageLoader } from 'shared/components/page-loader';
import { Text } from 'shared/components/text';

import { MotionType } from '../../motion-types';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { isValidCID } from '../../utils/validate-cid';
import { validateAddress } from 'utils/validate-address';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { ErrorBox, Fieldset, MessageBox, MotionInfoBox } from './style';
import { useMerkleGateInfo } from '@easy-track/hooks/use-merkle-gate-info';

type FormData = {
  gate: string;
  currentTreeRoot: string;
  currentTreeCid: string;
  treeRoot: string;
  treeCid: string;
};

const SET_MERKLE_GATE_TREE_MAP = {
  [MotionType.CSMSetMerkleGateTree]: {
    motionType: MotionType.CSMSetMerkleGateTree,
    evmContract: CSMSetMerkleGateTree,
  },
  [MotionType.CuratedSetMerkleGateTree]: {
    motionType: MotionType.CuratedSetMerkleGateTree,
    evmContract: CuratedSetMerkleGateTree,
  },
} satisfies Record<
  string,
  { motionType: MotionType; evmContract: ContractObject }
>;

export const formParts = ({
  motionType,
}: {
  motionType: keyof typeof SET_MERKLE_GATE_TREE_MAP;
}) =>
  createMotionFormPart({
    motionType: SET_MERKLE_GATE_TREE_MAP[motionType].motionType,
    populateTx: async ({
      evmScriptFactory,
      formData,
      contract,
    }: PopulateTxArgs<FormData>) => {
      const encodedCallData = encodeAbiParameters(
        parseAbiParameters('address, bytes32, string, bytes32, string'),
        [
          getAddress(formData.gate as Address),
          formData.currentTreeRoot as `0x${string}`,
          formData.currentTreeCid,
          formData.treeRoot as `0x${string}`,
          formData.treeCid,
        ],
      );

      return await contract.write({
        address: contract.address,
        functionName: 'createMotion',
        args: [evmScriptFactory, encodedCallData],
      });
    },
    getDefaultFormData: (): FormData => ({
      gate: '',
      currentTreeRoot: '',
      currentTreeCid: '',
      treeRoot: '',
      treeCid: '',
    }),
    Component: ({ fieldNames, submitAction }) => {
      const { control, setValue } = useFormContext();

      const { isTrustedCallerConnected, isTrustedCallerLoading } =
        useIsTrustedCaller(SET_MERKLE_GATE_TREE_MAP[motionType].evmContract);

      const gateInput = useWatch({ control, name: fieldNames.gate }) as
        | string
        | undefined;
      const gateAddress =
        gateInput && isAddress(gateInput) ? getAddress(gateInput) : null;

      const {
        data: gateInfo,
        isLoading: isGateInfoLoading,
        error: gateInfoError,
      } = useMerkleGateInfo(gateAddress);
      // Mirror on-chain values into the form so populateTx can encode them.
      useEffect(() => {
        if (gateInfo) {
          setValue(fieldNames.currentTreeRoot, gateInfo.treeRoot);
          setValue(fieldNames.currentTreeCid, gateInfo.treeCid);
        } else {
          setValue(fieldNames.currentTreeRoot, '');
          setValue(fieldNames.currentTreeCid, '');
        }
      }, [
        gateInfo,
        setValue,
        fieldNames.currentTreeRoot,
        fieldNames.currentTreeCid,
      ]);

      if (isTrustedCallerLoading) {
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
            <InputHookForm
              fieldName={fieldNames.gate}
              label="Gate address"
              rules={{
                required: 'Field is required',
                validate: (value: string) => validateAddress(value) ?? true,
              }}
            />
          </Fieldset>

          {gateAddress && isGateInfoLoading && <PageLoader />}

          {gateInfoError && (
            <ErrorBox>
              Failed to load gate info: {gateInfoError.message}
            </ErrorBox>
          )}

          {gateInfo && (
            <MotionInfoBox>
              <Text size={14} weight={800}>
                Current Gate Tree Info
              </Text>
              <Text size={12} weight={500}>
                Tree Root: <br />
                {gateInfo.treeRoot}
              </Text>
              <Text size={12} weight={500}>
                Tree CID: <br />
                {gateInfo.treeCid}
              </Text>
            </MotionInfoBox>
          )}

          <Fieldset>
            <InputHookForm
              fieldName={fieldNames.treeRoot}
              label="New tree root"
              rules={{
                required: 'Field is required',
                validate: (value: string) => {
                  if (value.trim() === '') return 'Tree root cannot be empty';
                  if (!isHex(value))
                    return 'Tree root must be a valid hex string';
                  if (value === zeroHash) return 'Tree root cannot be zero';
                  if (!gateInfo) return 'Gate tree data is not available';
                  if (value === gateInfo.treeRoot)
                    return 'Tree root is the same as current';
                  return true;
                },
              }}
            />
          </Fieldset>

          <Fieldset>
            <InputHookForm
              fieldName={fieldNames.treeCid}
              label="New tree CID"
              rules={{
                required: 'Field is required',
                validate: (value: string) => {
                  const trimmed = value.trim();
                  if (trimmed === '') return 'Tree CID cannot be empty';
                  if (!isValidCID(trimmed))
                    return 'Tree CID must be a valid IPFS CID (v0 or v1)';
                  if (!gateInfo) return 'Gate tree data is not available';
                  const newCidHash = keccak256(toBytes(trimmed));
                  const currentCidHash = keccak256(toBytes(gateInfo.treeCid));
                  if (newCidHash === currentCidHash)
                    return 'Tree CID is the same as current';
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
