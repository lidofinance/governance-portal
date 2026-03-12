import { CachedEventsData } from '../proposals/types';

export const fetchCachedEventsData = async (): Promise<CachedEventsData> => {
  try {
    const response = await fetch('/proposals-events-data.json');
    if (response.ok) {
      try {
        return await response.json();
      } catch (err) {
        console.warn(
          'proposals-events-data.json is not valid JSON, falling back to on-demand fetch',
          err,
        );
      }
    } else if (response.status !== 404) {
      console.warn(
        'Failed to fetch proposals-events-data.json, status:',
        response.status,
        response.statusText,
      );
    }
  } catch (err) {
    console.warn(
      'Network error while fetching proposals-events-data.json, falling back to on-demand fetch',
      err,
    );
  }

  return {};
};
