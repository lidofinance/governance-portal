import { FC } from 'react';
import { AppProps } from 'next/app';
import { withSecureHeaders } from 'next-secure-headers';
import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

// Don't use absolute import here!
// code'''
//    import { config, secretConfig } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { config } from '../get-config';
import { secretConfig } from '../get-secret-config';

const trustedHosts = secretConfig.cspTrustedHosts
  ? secretConfig.cspTrustedHosts.split(',')
  : [];

const contentSecurityPolicy: ContentSecurityPolicyOption = {
  directives: {
    'default-src': ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'data:'],
    imgSrc: [
      "'self'",
      'data:',
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
    ],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      ...(config.developmentMode ? ["'unsafe-eval'"] : []), // for HMR
      ...trustedHosts,
    ],

    // Allow fetch connections to any secure host
    connectSrc: [
      "'self'",
      'https:',
      'wss:',
      ...(config.developmentMode ? ['ws:'] : []), // for HMR
    ],

    childSrc: [
      "'self'",
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
    ],
    workerSrc: ["'none'"],
    'base-uri': ["'none'"],
  },
  reportOnly: secretConfig.cspReportOnly,
};

export const withCsp = (app: FC<AppProps>): FC =>
  withSecureHeaders({
    contentSecurityPolicy,
    frameGuard: false,
    referrerPolicy: 'same-origin',
  })(app);
