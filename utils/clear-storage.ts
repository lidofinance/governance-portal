/**
 * Utility to clear all relevant storage when switching networks
 * This helps prevent stale data issues when changing chains
 */
export const clearStorageOnNetworkSwitch = () => {
  if (typeof window === 'undefined') return;

  const swrKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith('$swr$'),
  );
  swrKeys.forEach((key) => localStorage.removeItem(key));

  const queryKeys = Object.keys(localStorage).filter((key) =>
    key.startsWith('rq-'),
  );
  queryKeys.forEach((key) => localStorage.removeItem(key));

  localStorage.removeItem('wagmi.connected');
  localStorage.removeItem('wagmi.store');
  localStorage.removeItem('wagmi.wallet');
  localStorage.removeItem('wagmi.cache');

  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach((key) => {
    if (
      key.includes('chain') ||
      key.includes('network') ||
      key.includes('provider')
    ) {
      sessionStorage.removeItem(key);
    }
  });
};
