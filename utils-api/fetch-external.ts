import Metrics from 'utils-api/metrics';
import { createStandardFetcher } from 'utils/standard-fetcher';

const NETWORK_ERROR_STATUS = 'network_error';

export const fetchExternal = async (
  url: string,
  params?: RequestInit,
): Promise<Response> => {
  const { hostname } = new URL(url);
  const endTimer = Metrics.request.apiTimingsExternal.startTimer({ hostname });

  try {
    const response = await fetch(url, params);
    endTimer({ status: response.status });
    Metrics.request.externalRequestCounter.inc({
      hostname,
      status: response.status,
    });
    return response;
  } catch (error) {
    endTimer({ status: NETWORK_ERROR_STATUS });
    Metrics.request.externalRequestCounter.inc({
      hostname,
      status: NETWORK_ERROR_STATUS,
    });
    throw error;
  }
};

export const standardFetcherExternal = createStandardFetcher(fetchExternal);
