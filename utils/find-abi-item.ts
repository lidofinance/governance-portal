import { Abi, AbiEvent, AbiFunction } from 'viem';

type Props<T extends 'event' | 'function'> = {
  abi: Abi;
  name: string;
  type: T;
};

type AbiItemType<T> = T extends 'event'
  ? AbiEvent | undefined
  : AbiFunction | undefined;

export const findAbiItem = <T extends 'event' | 'function'>({
  abi,
  name,
  type,
}: Props<T>): AbiItemType<T> => {
  if (!abi?.length) {
    throw new Error('abi should be a non-empty array.');
  }

  if (!name.trim()) {
    throw new Error('name should be a non-empty string.');
  }

  if (type !== 'event' && type !== 'function') {
    throw new Error('type should be either "event" or "function".');
  }

  const abiItem = abi.find(
    (item): item is AbiEvent | AbiFunction =>
      item.type === type && item.name === name,
  );

  return (abiItem as AbiItemType<T>) || undefined;
};
