import { Address, PublicClient } from 'viem';
import { getCode } from 'viem/actions';

export const isContract = async (
  address: Address,
  client: PublicClient,
): Promise<boolean> => {
  const code = await getCode(client, { address });
  return code != '0x';
};
