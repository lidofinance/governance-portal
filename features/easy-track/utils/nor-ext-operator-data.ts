import { encodePacked, hexToBigInt, hexToNumber, slice, type Hex } from 'viem';

// Mirror of the on-chain layout consumed by `CreateOrUpdateOperatorGroup`:
// `[operatorType:1 byte][moduleId:1 byte][nodeOperatorId:8 bytes]` = 10 bytes.
const NOR_EXT_OPERATOR_TYPE = 0;

export type ExternalOperatorData = {
  moduleId: number;
  nodeOperatorId: bigint;
};

export const encodeExternalOperatorData = (
  moduleId: number,
  nodeOperatorId: bigint,
): Hex =>
  encodePacked(
    ['uint8', 'uint8', 'uint64'],
    [NOR_EXT_OPERATOR_TYPE, moduleId, nodeOperatorId],
  );

export const decodeExternalOperatorData = (
  data: Hex,
): ExternalOperatorData => ({
  moduleId: hexToNumber(slice(data, 1, 2)),
  nodeOperatorId: hexToBigInt(slice(data, 2, 10)),
});
