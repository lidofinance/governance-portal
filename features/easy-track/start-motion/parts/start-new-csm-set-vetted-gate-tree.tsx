import { PageLoader } from 'shared/components/page-loader';
import { useCSMVettedGateInfo } from '../../hooks/use-csm-vetted-gate-info';
import { Fieldset, MessageBox, MotionInfoBox } from './style';
import { Text } from 'shared/components/text';
import {
  createMotionFormPart,
  PopulateTxArgs,
} from './create-motion-form-part';
import { MotionType } from '../../motion-types';
import { useIsTrustedCaller } from '../../hooks/use-is-trusted-caller';
import { CSMSetVettedGateTree } from 'shared/blockchain/contracts';
import { InputHookForm } from 'shared/hook-form/input-hook-form';
import {
  encodeAbiParameters,
  isHex,
  keccak256,
  parseAbiParameters,
  toBytes,
  zeroHash,
} from 'viem';
import { isValidCID } from '../../utils/validate-cid';

export const formParts = createMotionFormPart({
  motionType: MotionType.CSMSetVettedGateTree,
  populateTx: async ({
    evmScriptFactory,
    formData,
    contract,
  }: PopulateTxArgs<{
    treeRoot: string;
    treeCid: string;
  }>) => {
    const encodedCallData = encodeAbiParameters(
      parseAbiParameters('bytes32, string'),
      [formData.treeRoot as `0x${string}`, formData.treeCid],
    );

    return await contract.write({
      address: contract.address,
      functionName: 'createMotion',
      args: [evmScriptFactory, encodedCallData],
    });
  },
  getDefaultFormData: () => ({
    treeRoot: '',
    treeCid: '',
  }),
  Component: ({ fieldNames, submitAction }) => {
    const { isTrustedCallerConnected, isTrustedCallerLoading } =
      useIsTrustedCaller(CSMSetVettedGateTree);

    const { data: vettedTreeData, isLoading: isVettedTreeDataLoading } =
      useCSMVettedGateInfo();

    if (isTrustedCallerLoading || isVettedTreeDataLoading) {
      return <PageLoader />;
    }

    if (!isTrustedCallerConnected) {
      return <MessageBox>You should be connected as trusted caller</MessageBox>;
    }

    return (
      <>
        {vettedTreeData && (
          <MotionInfoBox>
            <Text size={14} weight={800}>
              Current Vetted Gate Info
            </Text>
            <Text size={12} weight={500}>
              Tree Root: <br />
              {vettedTreeData.treeRoot}
            </Text>
            <Text size={12} weight={500}>
              Tree cid: <br />
              {vettedTreeData.treeCid}
            </Text>
          </MotionInfoBox>
        )}
        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.treeRoot}
            label="Tree root"
            rules={{
              required: 'Field is required',
              validate: (value) => {
                if (value.trim() === '') {
                  return 'Tree root cannot be empty';
                }

                if (!isHex(value)) {
                  return 'Tree root must be a valid hex string';
                }

                if (value === zeroHash) {
                  return 'Tree root cannot be zero';
                }

                if (!vettedTreeData) {
                  return 'Vetted gate tree data is not available';
                }

                if (value === vettedTreeData.treeRoot) {
                  return 'Tree root is the same as current';
                }

                return true;
              },
            }}
          />
        </Fieldset>
        <Fieldset>
          <InputHookForm
            fieldName={fieldNames.treeCid}
            label="Tree сid"
            rules={{
              required: 'Field is required',
              validate: (value) => {
                const trimmed = value.trim();
                if (trimmed === '') {
                  return 'Tree cid cannot be empty';
                }

                if (!isValidCID(trimmed)) {
                  return 'Tree cid must be a valid IPFS CID (v0 or v1)';
                }

                if (!vettedTreeData) {
                  return 'Vetted gate tree data is not available';
                }

                // Check if treeCid hash is the same as current (equivalent to keccak256 comparison)
                const newTreeCidHash = keccak256(toBytes(trimmed));
                const currentTreeCidHash = keccak256(
                  toBytes(vettedTreeData.treeCid),
                );

                if (newTreeCidHash === currentTreeCidHash) {
                  return 'Tree cid is the same as current';
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
