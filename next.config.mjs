import NextBundleAnalyzer from '@next/bundle-analyzer';
import buildDynamics from './scripts/build-dynamics.mjs';
import { logEnvironmentVariables } from './scripts/log-environment-variables.mjs';
import generateBuildId from './scripts/generate-build-id.mjs';
import { startupCheckRPCs } from './scripts/startup-checks/rpc.mjs';

logEnvironmentVariables();
buildDynamics();

if (
  process.env.RUN_STARTUP_CHECKS === 'true' &&
  typeof window === 'undefined'
) {
  void startupCheckRPCs();
}

// https://nextjs.org/docs/pages/api-reference/next-config-js/basePath
const basePath = process.env.BASE_PATH;

const developmentMode = process.env.NODE_ENV === 'development';
const isIPFSMode = process.env.IPFS_MODE === 'true';

// cache control
export const CACHE_CONTROL_HEADER = 'x-cache-control';
export const CACHE_CONTROL_PAGES = [
  '/',
  '/manifest.json',
  '/favicon:size*',
  '/public/runtime/window-env.js',
  '/vote/dashboard',
  '/vote/:id',
  '/vote/delegation',
  '/dg',
  '/settings',
  '/dg/proposals/:id',
  '/easy-track/motions',
  '/easy-track/motions/:id',
  '/easy-track/start-motion',
  '/500',
];
export const CACHE_CONTROL_VALUE =
  'public, max-age=30, stale-if-error=1200, stale-while-revalidate=30';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE ?? false,
});

export default withBundleAnalyzer({
  basePath,
  generateBuildId,

  // IPFS next.js configuration reference:
  // https://github.com/Velenir/nextjs-ipfs-example
  trailingSlash: !!isIPFSMode,
  assetPrefix: isIPFSMode ? './' : undefined,

  // IPFS version has hash-based routing,
  // so we provide only index.html in ipfs version
  exportPathMap: isIPFSMode ? () => ({ '/': { page: '/' } }) : undefined,

  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // Fixes a build error with importing Pure ESM modules, e.g. reef-knot
    // Some docs are here:
    // https://github.com/vercel/next.js/pull/27069
    // You can see how it is actually used in v12.3.4 here:
    // https://github.com/vercel/next.js/blob/v12.3.4/packages/next/build/webpack-config.ts#L417
    // Presumably, it is true by default in next v13 and won't be needed
    esmExternals: true,
    newNextLinkBehavior: true,
  },
  webpack(config) {
    config.module.rules.push(
      // Teach webpack to import svg and md files
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },

      // Needs for `Conditional Compilation`,
      // because we have differences in source code of IPFS widget and NOT IPFS widget
      {
        test: /\.(t|j)sx?$/,
        use: [
          {
            loader: 'webpack-preprocessor-loader',
            options: {
              params: {
                IPFS_MODE: isIPFSMode,
              },
            },
          },
        ],
      },
    );

    return config;
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'x-content-type-options',
            value: 'nosniff',
          },
          { key: 'x-xss-protection', value: '1' },
          { key: 'x-download-options', value: 'noopen' },
        ],
      },
      {
        // required for gnosis save apps
        source: '/manifest.json',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
      {
        source: '/proposals-events/:chainId/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, must-revalidate',
          },
        ],
      },
      {
        source: '/proposals-events/:chainId/chunk-:rest*.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/votes-events/:chainId/:votingAddress/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, must-revalidate',
          },
        ],
      },
      {
        source: '/votes-events/:chainId/:votingAddress/descriptions.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, must-revalidate',
          },
        ],
      },
      {
        source: '/votes-events/:chainId/:votingAddress/chunk-:rest*.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      ...CACHE_CONTROL_PAGES.map((page) => ({
        source: page,
        headers: [{ key: CACHE_CONTROL_HEADER, value: CACHE_CONTROL_VALUE }],
      })),
    ];
  },
  redirects: () => [
    {
      source: '/',
      destination: '/vote/dashboard',
      permanent: false,
    },
    {
      source: '/vote',
      destination: '/vote/dashboard',
      permanent: false,
    },
    {
      source: '/easy-track',
      destination: '/easy-track/motions',
      permanent: false,
    },
  ],

  // ATTENTION: If you add a new variable you should declare it in `global.d.ts`
  serverRuntimeConfig: {
    // https://nextjs.org/docs/pages/api-reference/next-config-js/basePath
    basePath,
    developmentMode,

    defaultChain: process.env.DEFAULT_CHAIN,
    rpcUrls_1: process.env.EL_RPC_URLS_1,
    rpcUrls_17000: process.env.EL_RPC_URLS_17000,
    rpcUrls_560048: process.env.EL_RPC_URLS_560048,

    cspTrustedHosts: process.env.CSP_TRUSTED_HOSTS,
    cspReportUri: process.env.CSP_REPORT_URI,
    cspReportOnly: process.env.CSP_REPORT_ONLY,

    rateLimit: process.env.RATE_LIMIT,
    rateLimitTimeFrame: process.env.RATE_LIMIT_TIME_FRAME,

    etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    subgraphHoodi: process.env.SUBGRAPH_HOODI,
    subgraphMainnet: process.env.SUBGRAPH_MAINNET,
  },

  // ATTENTION: If you add a new variable you should declare it in `global.d.ts`
  publicRuntimeConfig: {
    basePath,
    developmentMode,
  },
});
