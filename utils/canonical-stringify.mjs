const sortKeysDeep = (value) => {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortKeysDeep(value[key]);
    }
    return sorted;
  }
  return value;
};

const replaceBigInt = (_key, value) =>
  typeof value === 'bigint' ? value.toString() : value;

export const canonicalStringify = (value, indent) =>
  JSON.stringify(sortKeysDeep(value), replaceBigInt, indent);