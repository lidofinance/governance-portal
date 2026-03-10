import { Abi } from 'viem';

export const findAbiItem = <
  TAbi extends Abi,
  TName extends string,
  TType extends 'event' | 'function',
>({
  abi,
  name,
  type,
}: {
  abi: TAbi;
  name: TName;
  type: TType;
}): Extract<TAbi[number], { type: TType; name: TName }> => {
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
    (item): item is Extract<TAbi[number], { type: TType; name: TName }> =>
      item.type === type && item.name === name,
  );

  if (!abiItem) {
    throw new Error(`ABI item "${name}" of type "${type}" not found.`);
  }

  return abiItem;
};
