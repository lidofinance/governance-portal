import { SIGNING_KEYS_ROLE } from '../constants';
import { getAddress } from 'viem';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { aragonAclAbi, nodeOperatorsRegistryAbi } from 'abi/generated';

export const checkIsAddressManagerOfNodeOperator = async (
  address: string,
  nodeOperatorId: string,
  sdvtRegistry: ReturnType<
    typeof useReadContract<typeof nodeOperatorsRegistryAbi>
  >,
) => {
  try {
    return await sdvtRegistry.readContract('canPerform', [
      getAddress(address),
      SIGNING_KEYS_ROLE,
      [BigInt(nodeOperatorId)],
    ]);
  } catch (error) {
    return false;
  }
};

export const checkAddressForManageSigningKeysRole = async (
  address: string,
  sdvtRegistry: ReturnType<
    typeof useReadContract<typeof nodeOperatorsRegistryAbi>
  >,
  aragonAcl: ReturnType<typeof useReadContract<typeof aragonAclAbi>>,
) => {
  try {
    const result = await aragonAcl.readContract('getPermissionParamsLength', [
      getAddress(address),
      sdvtRegistry.address,
      SIGNING_KEYS_ROLE,
    ]);
    return result !== 0n;
  } catch (error) {
    return false;
  }
};
