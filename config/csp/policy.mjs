import { toBoolean } from '../../env-dynamics.mjs';

// Lazy so the custom server can call it after Next loads .env files
export const getContentSecurityPolicy = () => {
  const developmentMode = process.env.NODE_ENV === 'development';
  const ipfsMode = toBoolean(process.env.IPFS_MODE);
  const trustedHosts = process.env.CSP_TRUSTED_HOSTS
    ? process.env.CSP_TRUSTED_HOSTS.split(',')
    : [];

  return {
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
        ...(developmentMode ? ["'unsafe-eval'"] : []), // for HMR
        ...trustedHosts,
      ],
      scriptSrcAttr: ["'none'"],
      mediaSrc: ["'none'"],

      // Allow fetch connections to any secure host
      connectSrc: [
        "'self'",
        'https:',
        'wss:',
        ...(developmentMode ? ['ws:'] : []), // for HMR
      ],

      ...(!ipfsMode && {
        // CSP directive 'frame-ancestors' is ignored when delivered via a <meta> element.
        // CSP directive 'report-uri' is ignored when delivered via a <meta> element.
        frameAncestors: ['*'],
        reportURI: process.env.CSP_REPORT_URI,
      }),
      childSrc: [
        "'self'",
        'https://*.walletconnect.org',
        'https://*.walletconnect.com',
      ],
      objectSrc: ["'none'"],
      formAction: ["'self'"],
      workerSrc: ["'none'"],
      'base-uri': ipfsMode ? undefined : ["'none'"],
    },
    reportOnly: toBoolean(process.env.CSP_REPORT_ONLY),
  };
};
