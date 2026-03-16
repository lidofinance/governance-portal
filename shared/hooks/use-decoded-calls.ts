import { useQuery } from '@tanstack/react-query';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import {
  Address,
  createPublicClient,
  decodeFunctionData,
  Hex,
  http,
} from 'viem';
import { useConfig } from 'config';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { ABIElement } from 'shared/blockchain/types';
import { fetcherEtherscan } from 'utils/fetcher-etherscan';
import {
  BaseCall,
  DecodedCall,
  decodeCalls,
  decodeEvmScript,
  getContractAbi,
} from 'utils/decode-evm-script-calls';

const PROXY_IMPL_METHOD_NAMES = [
  'implementation',
  '__Proxy_implementation',
  'proxy__getImplementation',
];

const ETHERSCAN_ABI_CONCURRENCY = 3;

type AddressCollectorContext = {
  seen: Set<string>;
  addresses: string[];
  chainId: CHAINS;
  useBundledAbi: boolean;
};

const resolveAbi = async ({
  address,
  chainId,
  etherscanApiKey,
  rpcUrl,
}: {
  address: string;
  chainId: CHAINS;
  etherscanApiKey: string | undefined;
  rpcUrl: string;
}): Promise<ABIElement[]> => {
  const abiJson = await fetcherEtherscan<string>({
    chainId,
    address,
    module: 'contract',
    action: 'getabi',
    apiKey: etherscanApiKey,
  });
  const abi = JSON.parse(abiJson) as ABIElement[];

  const implMethod = abi.find(
    (el) =>
      el.type === 'function' &&
      typeof el.name === 'string' &&
      PROXY_IMPL_METHOD_NAMES.includes(el.name),
  );

  if (!implMethod?.name) {
    return abi;
  }

  try {
    const publicClient = createPublicClient({ transport: http(rpcUrl) });
    const implAddress = await publicClient.readContract({
      address: address as Address,
      abi: [
        {
          type: 'function' as const,
          name: implMethod.name,
          inputs: [],
          outputs: [{ type: 'address', name: '' }],
          stateMutability: 'view' as const,
        },
      ],
      functionName: implMethod.name,
    });

    if (
      typeof implAddress === 'string' &&
      /^0x[0-9a-fA-F]{40}$/.test(implAddress)
    ) {
      const implAbiJson = await fetcherEtherscan<string>({
        chainId,
        address: implAddress.toLowerCase(),
        module: 'contract',
        action: 'getabi',
        apiKey: etherscanApiKey,
      });
      return JSON.parse(implAbiJson) as ABIElement[];
    }
  } catch {
    // fall back to proxy ABI
  }

  return abi;
};

const tryCollectAddress = (
  target: Address,
  ctx: AddressCollectorContext,
): void => {
  const addr = target.toLowerCase();
  if (ctx.seen.has(addr)) {
    return;
  }
  ctx.seen.add(addr);
  const bundledAbi = getContractAbi(target, ctx.chainId);
  if (ctx.useBundledAbi && bundledAbi !== undefined) {
    return;
  }
  ctx.addresses.push(addr);
};

const collectAddressesFromForward = (
  innerCall: BaseCall,
  ctx: AddressCollectorContext,
): void => {
  const innerBundledAbi = getContractAbi(innerCall.target, ctx.chainId);
  if (!innerBundledAbi) {
    return;
  }
  try {
    const { functionName: innerFn, args: innerArgs } = decodeFunctionData({
      abi: innerBundledAbi,
      data: innerCall.payload,
    });
    if (
      innerFn !== 'forward' ||
      !Array.isArray(innerArgs) ||
      typeof innerArgs[0] !== 'string'
    ) {
      return;
    }
    const evmScriptCalls = decodeEvmScript(innerArgs[0] as Hex);
    for (const evmCall of evmScriptCalls) {
      tryCollectAddress(evmCall.target, ctx);
    }
  } catch {
    // not a forward call or malformed payload — skip
  }
};

const collectAddressesFromSubmitProposal = (
  call: BaseCall,
  ctx: AddressCollectorContext,
): void => {
  const bundledAbi = getContractAbi(call.target, ctx.chainId);
  if (!bundledAbi || !call.payload.startsWith('0x')) {
    return;
  }
  try {
    const { functionName, args } = decodeFunctionData({
      abi: bundledAbi,
      data: call.payload,
    });
    if (functionName !== 'submitProposal' || !Array.isArray(args?.[0])) {
      return;
    }
    const innerCalls = args[0] as BaseCall[];
    for (const innerCall of innerCalls) {
      tryCollectAddress(innerCall.target, ctx);
    }
    // Scan ALL inner calls (not just unique targets) for forward(evmScript) —
    // each payload may encode a different EVM script with different targets.
    for (const innerCall of innerCalls) {
      collectAddressesFromForward(innerCall, ctx);
    }
  } catch {
    // malformed payload — skip
  }
};

const collectEtherscanAddresses = (
  calls: BaseCall[],
  ctx: AddressCollectorContext,
): void => {
  for (const call of calls) {
    tryCollectAddress(call.target, ctx);
  }
  for (const call of calls) {
    collectAddressesFromSubmitProposal(call, ctx);
  }
};

const fetchEtherscanAbis = async ({
  addresses,
  chainId,
  etherscanApiKey,
  rpcUrl,
}: {
  addresses: string[];
  chainId: CHAINS;
  etherscanApiKey: string | undefined;
  rpcUrl: string;
}): Promise<Record<string, ABIElement[]>> => {
  const results: PromiseSettledResult<{
    address: string;
    abi: ABIElement[];
  }>[] = [];
  for (let i = 0; i < addresses.length; i += ETHERSCAN_ABI_CONCURRENCY) {
    const batch = addresses.slice(i, i + ETHERSCAN_ABI_CONCURRENCY);
    const batchResults = await Promise.allSettled(
      batch.map(async (address) => {
        const abi = await resolveAbi({
          address,
          chainId,
          etherscanApiKey,
          rpcUrl,
        });
        return { address, abi };
      }),
    );
    results.push(...batchResults);
  }
  return results.reduce<Record<string, ABIElement[]>>((acc, result) => {
    if (result.status === 'fulfilled') {
      acc[result.value.address] = result.value.abi;
    }
    return acc;
  }, {});
};

export const useDecodedCalls = <TCall extends BaseCall>(
  calls: TCall[],
  chainId: CHAINS,
): DecodedCall[] => {
  const { userConfig } = useConfig();
  const { useBundledAbi, etherscanApiKey } = userConfig.savedUserConfig;
  const getRpcUrlByChainId = useGetRpcUrlByChainId();
  const rpcUrl = getRpcUrlByChainId(chainId as unknown as number);

  const ctx: AddressCollectorContext = {
    seen: new Set(),
    addresses: [],
    chainId,
    useBundledAbi,
  };

  collectEtherscanAddresses(calls, ctx);

  const { data: etherscanAbis } = useQuery({
    queryKey: [
      'useDecodedCalls-etherscan',
      chainId,
      ctx.addresses,
      etherscanApiKey,
      rpcUrl,
    ],
    queryFn: () =>
      fetchEtherscanAbis({
        addresses: ctx.addresses,
        chainId,
        etherscanApiKey,
        rpcUrl,
      }),
    staleTime: Infinity,
    enabled: ctx.addresses.length > 0,
  });

  return decodeCalls({ calls, chainId, abiOverrides: etherscanAbis ?? {} });
};
