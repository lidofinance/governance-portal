import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export type UserConfigDefaultType = {
  defaultChain: number;
  supportedChainIds: number[];
  prefillUnsafeElRpcUrls: Partial<Record<CHAINS, string[]>>;
  walletconnectProjectId: string | undefined;
  etherscanApiKey: string | undefined;
};
