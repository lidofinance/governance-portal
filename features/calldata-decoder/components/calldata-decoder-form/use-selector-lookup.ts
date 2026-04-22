import { useCallback, useMemo } from 'react';
import {
  Abi,
  Address,
  Hex,
  toFunctionSelector,
  toFunctionSignature,
} from 'viem';
import { useLidoSDK } from 'providers/lido-sdk';
import { useAbiMap } from 'shared/hooks/use-abi-map';
import { getContractName } from 'utils/get-contract-name';

export type SelectorMatch = {
  contractName: string;
  address: Address;
  abi: Abi;
  functionName: string;
  signature: string;
};

type SelectorMap = Map<Hex, SelectorMatch[]>;

export const useSelectorLookup = () => {
  const { chainId } = useLidoSDK();
  const abiMap = useAbiMap();

  const map = useMemo(() => {
    const result: SelectorMap = new Map();

    for (const [address, abi] of Object.entries(abiMap)) {
      const contractName = getContractName(chainId, address) ?? 'Unknown';

      for (const item of abi) {
        if (item.type !== 'function') {
          continue;
        }

        try {
          const selector = toFunctionSelector(item);
          const signature = toFunctionSignature(item);
          const value = result.get(selector) ?? [];
          if (
            value.some(
              (m) => m.address === address && m.signature === signature,
            )
          ) {
            continue;
          }

          value.push({
            contractName,
            address: address as Address,
            abi: [item] as Abi,
            functionName: item.name,
            signature,
          });

          result.set(selector, value);
        } catch {
          // skip malformed entries
        }
      }
    }

    return result;
  }, [abiMap, chainId]);

  return useCallback(
    (payload: Hex): SelectorMatch[] => {
      if (payload.length < 10) {
        return [];
      }

      const selector = payload.slice(0, 10).toLowerCase() as Hex;
      return map.get(selector) ?? [];
    },
    [map],
  );
};
