import { decodeAbiParameters } from 'viem';
import { MAX_SUBMIT_HASH_COUNT, NodeOperatorsRegistryType } from '../constants';

type SubmitHashesRequest = {
  moduleId: bigint;
  nodeOpId: bigint;
  valIndex: bigint;
  valPubkey: `0x${string}`;
  valPubKeyIndex: bigint;
};

type SubmitHashesRequestParsed = {
  moduleId: string;
  nodeOpId: string;
  valIndex: string;
  valPubkey: string;
  valPubKeyIndex: string;
};

const STAKING_MODULE_IDS: Partial<Record<NodeOperatorsRegistryType, number>> = {
  curated: 1,
  sdvt: 2,
};

type Args = {
  registryType: NodeOperatorsRegistryType;
  calldata: string;
  nodeOperatorsCount: number;
  nodeOperatorId?: number;
};

export type ParsingResultData = {
  value: SubmitHashesRequestParsed;
  errors: string[];
}[];

type ParsingResult = {
  data: ParsingResultData;
  error?: string | null;
};

export const validateAndParseRequestHashes = ({
  calldata,
  registryType,
  nodeOperatorsCount,
  nodeOperatorId,
}: Args): ParsingResult => {
  try {
    const decodedCalldata = decodeAbiParameters(
      [
        {
          type: 'tuple[]',
          components: [
            { name: 'moduleId', type: 'uint256' },
            { name: 'nodeOpId', type: 'uint256' },
            { name: 'valIndex', type: 'uint64' },
            { name: 'valPubkey', type: 'bytes' },
            { name: 'valPubKeyIndex', type: 'uint256' },
          ],
        },
      ],
      calldata as `0x${string}`,
    )[0] as unknown as SubmitHashesRequest[];

    if (decodedCalldata.length === 0) {
      return { error: 'No requests found in calldata', data: [] };
    }

    if (decodedCalldata.length > MAX_SUBMIT_HASH_COUNT) {
      return {
        error: `Too many requests in calldata. Got ${decodedCalldata.length}, maximum is ${MAX_SUBMIT_HASH_COUNT}.`,
        data: [],
      };
    }

    const data: {
      errors: string[];
      value: SubmitHashesRequestParsed;
    }[] = [];

    let errors: string[] = [];
    let hasErrors = false;
    let prevDataWithoutPubkey = 0n;

    for (const [i, request] of decodedCalldata.entries()) {
      errors = [];

      if (request.moduleId !== BigInt(STAKING_MODULE_IDS[registryType] ?? 0)) {
        errors.push('invalid module ID');
      }

      if (request.nodeOpId >= BigInt(nodeOperatorsCount)) {
        errors.push('node operator ID is out of range');
      }

      if (
        nodeOperatorId !== undefined &&
        request.nodeOpId !== BigInt(nodeOperatorId)
      ) {
        errors.push('node operator ID does not match connected node operator');
      }

      if (
        !request.valPubkey.startsWith('0x') ||
        request.valPubkey.length !== 98
      ) {
        errors.push('invalid validator pubkey length or format');
      }

      // Compute dataWithoutPubkey for sorting validation
      const moduleIdShifted = request.moduleId << 104n; // moduleId << 104
      const nodeOpIdShifted = request.nodeOpId << 64n; // nodeOpId << 64
      const dataWithoutPubkey =
        moduleIdShifted | nodeOpIdShifted | request.valIndex;

      // Check that the combined data is in ascending order (strict comparison for no duplicates)
      if (dataWithoutPubkey <= prevDataWithoutPubkey && i > 0) {
        errors.push('invalid sort order or duplicate entry');
      } else {
        prevDataWithoutPubkey = dataWithoutPubkey;
      }

      if (!hasErrors && errors.length > 0) {
        hasErrors = true;
      }
      data.push({
        errors,
        value: {
          nodeOpId: request.nodeOpId.toString(),
          moduleId: request.moduleId.toString(),
          valIndex: request.valIndex.toString(),
          valPubkey: request.valPubkey,
          valPubKeyIndex: request.valPubKeyIndex.toString(),
        },
      });
    }

    const error = hasErrors
      ? 'One or more requests are invalid. Please check parsed requests below'
      : null;

    return { error, data };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to parse calldata', data: [] };
  }
};
