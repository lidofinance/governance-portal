import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { API } from 'types';
import {
  defaultErrorHandler,
  rateLimit,
  httpMethodGuard,
  HttpMethod,
} from 'utils-api';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10kb',
    },
  },
};

const CSP_REPORT_FIELDS = [
  'document-uri',
  'referrer',
  'violated-directive',
  'effective-directive',
  'original-policy',
  'disposition',
  'blocked-uri',
  'source-file',
  'line-number',
  'column-number',
  'status-code',
  'script-sample',
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const cspReport: API = async (req, res) => {
  let payload: unknown = req.body;

  if (typeof req.body === 'string') {
    try {
      payload = JSON.parse(req.body);
    } catch {
      res.status(400).send({ status: 'invalid json' });
      return;
    }
  }

  const source = isRecord(payload) ? payload : {};
  const report = isRecord(source['csp-report']) ? source['csp-report'] : source;

  const violation: Record<string, unknown> = {};
  for (const field of CSP_REPORT_FIELDS) {
    if (report[field] !== undefined) {
      violation[field] = report[field];
    }
  }

  console.warn({ type: 'CSP Violation', ...violation });

  res.status(200).send({ status: 'ok' });
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  defaultErrorHandler,
])(cspReport);
