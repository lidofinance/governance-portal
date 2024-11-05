import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { Abi, Address, PublicClient, WalletClient, getContract } from 'viem';

export const getContractInstance = <T extends Abi>(
  address: Address,
  abi: T,
  core: LidoSDKCore,
) =>
  getContract({
    abi,
    address,
    client: {
      wallet: core.web3Provider as WalletClient | undefined,
      public: core.rpcProvider as PublicClient,
    },
  });
