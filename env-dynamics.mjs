/**
 * Convert to bool:
 * - true to true
 * - 'true' to true
 * - 1 to true
 * - '1' to true
 * - another values to false
 * @returns {Boolean}
 */
const toBoolean = (val) => {
  return !!(
    val?.toLowerCase?.() === 'true' ||
    val === true ||
    Number.parseInt(val, 10) === 1
  );
};

/** @type boolean */
export const ipfsMode = toBoolean(process.env.IPFS_MODE);

/** @type string */
export const rootOrigin = process.env.ROOT_ORIGIN || 'https://lido.fi';
export const selfOrigin =
  process.env.SELF_ORIGIN || 'https://dg-hoodi.testnet.fi';
// Fix in the build time (build time don't have env vars)

/** @type string */
export const voteOrigin =
  process.env.VOTE_ORIGIN || 'https://vote-hoodi.testnet.fi';
// Fix in the build time (build time don't have env vars)

/** @type string */
export const stakeOrigin = process.env.STAKE_ORIGIN || 'https://stake.lido.fi';
// Fix in the build time (build time don't have env vars)

// Parse supported chains from environment or use defaults
/** @type number */
export const defaultChain = parseInt(process.env.DEFAULT_CHAIN || '560048', 10);
/** @type number[] */
export const supportedChains = process.env.SUPPORTED_CHAINS
  ? process.env.SUPPORTED_CHAINS.split(',').map((chain) => parseInt(chain, 10))
  : [560048];

export const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID;

// /** @type string */
// export const widgetApiBasePathForIpfs =
//   process.env.WIDGET_API_BASE_PATH_FOR_IPFS;
//
