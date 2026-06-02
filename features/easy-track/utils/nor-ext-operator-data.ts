import { encodePacked, hexToBigInt, hexToNumber, slice, type Hex } from 'viem';

// Mirror of the on-chain layout consumed by `CreateOrUpdateOperatorGroup`:
// `[operatorType:1 byte][moduleId:1 byte][nodeOperatorId:8 bytes]` = 10 bytes.
export const NOR_EXT_OPERATOR_TYPE = 0;
export const NOR_EXT_OPERATOR_DATA_LENGTH_BYTES = 10;

export type NORExtOperatorData = {
  operatorType: number;
  moduleId: number;
  nodeOperatorId: bigint;
};

export const encodeNORExtOperatorData = (
  moduleId: number,
  nodeOperatorId: bigint,
): Hex =>
  encodePacked(
    ['uint8', 'uint8', 'uint64'],
    [NOR_EXT_OPERATOR_TYPE, moduleId, nodeOperatorId],
  );

export const decodeNORExtOperatorData = (data: Hex): NORExtOperatorData => ({
  operatorType: hexToNumber(slice(data, 0, 1)),
  moduleId: hexToNumber(slice(data, 1, 2)),
  nodeOperatorId: hexToBigInt(slice(data, 2, 10)),
});
