const normalizeBigInt = (value) =>
  JSON.parse(
    JSON.stringify(value, (_key, inner) =>
      typeof inner === 'bigint' ? inner.toString() : inner,
    ),
  );

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const collectDiffs = (expected, actual, path, ignorePaths, diffs) => {
  if (ignorePaths.includes(path)) {
    return;
  }

  if (Array.isArray(expected) || Array.isArray(actual)) {
    if (!Array.isArray(expected) || !Array.isArray(actual)) {
      diffs.push(`${path}: array vs non-array`);
      return;
    }
    if (expected.length !== actual.length) {
      diffs.push(`${path}: length ${expected.length} !== ${actual.length}`);
    }
    const length = Math.max(expected.length, actual.length);
    for (let index = 0; index < length; index += 1) {
      collectDiffs(
        expected[index],
        actual[index],
        `${path}[${index}]`,
        ignorePaths,
        diffs,
      );
    }
    return;
  }

  if (isPlainObject(expected) || isPlainObject(actual)) {
    if (!isPlainObject(expected) || !isPlainObject(actual)) {
      diffs.push(`${path}: object vs non-object`);
      return;
    }
    const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
    for (const key of keys) {
      const childPath = path ? `${path}.${key}` : key;
      collectDiffs(expected[key], actual[key], childPath, ignorePaths, diffs);
    }
    return;
  }

  if (expected !== actual) {
    diffs.push(
      `${path}: ${JSON.stringify(expected)} !== ${JSON.stringify(actual)}`,
    );
  }
};

export const diffEntry = (expected, actual, { ignorePaths = [] } = {}) => {
  const diffs = [];
  collectDiffs(
    normalizeBigInt(expected),
    normalizeBigInt(actual),
    '',
    ignorePaths,
    diffs,
  );
  return diffs;
};
