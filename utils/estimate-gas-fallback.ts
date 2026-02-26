export const estimateGasFallback = async (
  estimator: Promise<bigint>,
  fallback = 650000n,
) => {
  try {
    const gasLimit = Number(await estimator);
    const multiplied = Math.round(gasLimit * 1.5);
    console.debug(
      `Gas estimated ${gasLimit}. Using x1.5 value ${multiplied} for reliability`,
    );
    return multiplied;
  } catch (err) {
    console.debug(
      `Gas estimation failed, using fallback value: ${fallback}`,
      err,
    );
    return fallback;
  }
};
