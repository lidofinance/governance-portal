import { CHAINS } from '@lido-sdk/constants';

export type UserConfigDefaultType = {
  defaultChain: number;
  supportedChainIds: number[];
  prefillUnsafeElRpcUrls: Partial<Record<CHAINS, string[]>>;
  walletconnectProjectId: string | undefined;
  etherscanApiKey: string | undefined;
};
