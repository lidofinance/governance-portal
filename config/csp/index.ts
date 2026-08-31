import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

// The policy lives in a .mjs module so server.mjs can reuse it: the header is
// set there for every response; _document renders it as a <meta> in IPFS mode.
import { getContentSecurityPolicy } from './policy.mjs';

export const contentSecurityPolicy: ContentSecurityPolicyOption =
  getContentSecurityPolicy();
