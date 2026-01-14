import { Address, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import * as contracts from 'shared/blockchain/contracts';
import { ContractObject } from '../types';
import { readContract } from 'viem/actions';
import { MotionType } from 'features/easy-track/motion-types';

type Args = {
  chainId: CHAINS;
  contract: { motionType: MotionType; address: Address };
  callerAddress: Address;
  client: PublicClient;
};

export const getIsTrustedCaller = async ({
  contract,
  callerAddress,
  client,
}: Args) => {
  const allContracts = Object.values(contracts) as ContractObject<any>[];
  const contractInstance = allContracts.find(
    (c) => c.name === contract.motionType,
  );

  if (
    contractInstance?.abi.find((item: any) => item.name === 'trustedCaller')
  ) {
    const trustedCaller = (await readContract(client, {
      abi: contractInstance?.abi,
      address: contract.address,
      functionName: 'trustedCaller',
      args: [],
    })) as Address;

    return trustedCaller.toLowerCase() === callerAddress.toLowerCase();
  }
};
