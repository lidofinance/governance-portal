import { Abi, AbiFunction, Address, isAddress, PublicClient } from 'viem';

const PROXY_IMPL_METHOD_NAMES = [
  'implementation',
  '__Proxy_implementation',
  'proxy__getImplementation',
];

export const getProxyImplementationAddress = async (
  proxyAddress: Address,
  abi: Abi,
  client: PublicClient,
): Promise<Address | null> => {
  try {
    const implMethod = abi.find(
      (el): el is AbiFunction =>
        el.type === 'function' && PROXY_IMPL_METHOD_NAMES.includes(el.name),
    );

    if (!implMethod) {
      return null;
    }

    const implementationAddress = (await client.readContract({
      address: proxyAddress,
      abi: [implMethod],
      functionName: implMethod.name,
    })) as string;

    if (
      typeof implementationAddress === 'string' &&
      isAddress(implementationAddress)
    ) {
      return implementationAddress;
    }

    return null;
  } catch (error) {
    return null;
  }
};
