import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { API } from 'types';
import {
  defaultErrorHandler,
  rateLimit,
  httpMethodGuard,
  HttpMethod,
} from 'utils-api';

const cspReport: API = async (req, res) => {
  let violation = {};

  if (typeof req.body === 'object') {
    violation = req.body;
  } else if (typeof req.body === 'string') {
    try {
      violation = JSON.parse(req.body);
    } catch {
      res.status(400).send({ status: 'invalid json' });
      return;
    }
  }

  console.warn({
    type: 'CSP Violation',
    ...violation,
  });

  res.status(200).send({ status: 'ok' });
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  defaultErrorHandler,
])(cspReport);
