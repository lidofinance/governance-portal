import { Address } from 'viem';

/**
 * This util is for registering blockchain addresses with the server
 * to bypass RPC validation for getLogs calls
 */

type AddressType = 'governance' | 'escrow' | 'other';
const dynamicAddressesCache: Record<
  number,
  Record<AddressType, Set<Address>>
> = {};

const registrationQueue: Array<{
  chainId: number;
  address: Address;
  type: AddressType;
}> = [];
let isProcessingQueue = false;
const REGISTRATION_DELAY = 500;
const MAX_RETRIES = 3;
const MAX_QUEUE_SIZE = 100; // prevent queue overflow

const pendingRegistrations = new Set<string>();
const registeredAddresses = new Set<string>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create a unique key for address registration
 */
const getRegistrationKey = (
  chainId: number,
  address: Address,
  type: AddressType,
): string => {
  return `${chainId}-${address.toLowerCase()}-${type}`;
};

/**
 * Check if error is a rate limiting error
 */
const isRateLimitError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const status = error?.status || error?.response?.status;

  return (
    status === 429 ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('too many requests') ||
    errorMessage.includes('429')
  );
};

const processRegistrationQueue = async (): Promise<void> => {
  if (isProcessingQueue || registrationQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;

  while (registrationQueue.length > 0) {
    const item = registrationQueue.shift();
    if (!item) continue;

    const { chainId, address, type } = item;
    const registrationKey = getRegistrationKey(chainId, address, type);

    // Skip if already registered or currently being processed
    if (
      registeredAddresses.has(registrationKey) ||
      pendingRegistrations.has(registrationKey)
    ) {
      continue;
    }

    pendingRegistrations.add(registrationKey);

    let retries = 0;
    let success = false;

    while (retries < MAX_RETRIES && !success) {
      try {
        const response = await fetch('/api/register-dynamic-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chainId, address, type }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        success = true;
        registeredAddresses.add(registrationKey);
        console.debug(`Successfully registered ${type} address: ${address}`);
      } catch (error) {
        retries++;

        if (isRateLimitError(error)) {
          const rateLimitDelay = Math.min(2000 * Math.pow(2, retries), 15000);
          console.warn(
            `Rate limit hit registering ${type} address, retrying in ${rateLimitDelay}ms (attempt ${retries}/${MAX_RETRIES})`,
          );
          await delay(rateLimitDelay);
        } else if (retries < MAX_RETRIES) {
          const backoffDelay = Math.min(1000 * Math.pow(2, retries), 5000);
          console.warn(
            `Error registering ${type} address, retrying in ${backoffDelay}ms (attempt ${retries}/${MAX_RETRIES}):`,
            error,
          );
          await delay(backoffDelay);
        } else {
          console.error(
            `Failed to register ${type} address after ${MAX_RETRIES} attempts:`,
            error,
          );
        }
      }
    }

    pendingRegistrations.delete(registrationKey);

    if (registrationQueue.length > 0) {
      await delay(REGISTRATION_DELAY);
    }
  }

  isProcessingQueue = false;
};

/**
 * Batch register multiple addresses of the same type
 */
export const registerDynamicAddressesBatch = async (
  chainId: number,
  addresses: Address[],
  type: AddressType = 'other',
): Promise<void> => {
  // Filter out already registered/pending addresses
  const uniqueAddresses = addresses.filter((address) => {
    const registrationKey = getRegistrationKey(chainId, address, type);
    return (
      !registeredAddresses.has(registrationKey) &&
      !pendingRegistrations.has(registrationKey) &&
      !registrationQueue.some(
        (item) =>
          getRegistrationKey(item.chainId, item.address, item.type) ===
          registrationKey,
      )
    );
  });

  if (uniqueAddresses.length === 0) {
    return;
  }

  // Prevent queue overflow
  const availableSlots = MAX_QUEUE_SIZE - registrationQueue.length;
  const addressesToAdd = uniqueAddresses.slice(0, availableSlots);

  if (addressesToAdd.length < uniqueAddresses.length) {
    console.warn(
      `Registration queue near capacity, only adding ${addressesToAdd.length} of ${uniqueAddresses.length} addresses`,
    );
  }

  addressesToAdd.forEach((address) =>
    addDynamicAddress(chainId, address, type),
  );

  addressesToAdd.forEach((address) => {
    registrationQueue.push({ chainId, address, type });
  });

  processRegistrationQueue().catch((error) => {
    console.error('Error processing registration queue:', error);
  });
};

export const addDynamicAddress = (
  chainId: number,
  address: Address,
  type: AddressType = 'other',
): void => {
  initializeCache(chainId);
  dynamicAddressesCache[chainId][type].add(address);
};

export const getDynamicAddresses = (
  chainId: number,
  type?: AddressType,
): Address[] => {
  if (!dynamicAddressesCache[chainId]) return [];

  if (type) {
    return Array.from(dynamicAddressesCache[chainId][type] || new Set());
  }

  const allAddresses = new Set<Address>();
  Object.values(dynamicAddressesCache[chainId]).forEach((addressSet) => {
    addressSet.forEach((address) => allAddresses.add(address));
  });

  return Array.from(allAddresses);
};

/**
 * Re-registers all cached addresses with the server
 * Call this function when navigating between pages to ensure
 * the server has the latest addresses
 */
export const syncAddressesWithServer = async (
  chainId: number,
): Promise<void> => {
  const allAddresses = getDynamicAddresses(chainId);
  if (allAddresses.length === 0) return;

  console.debug(
    `[Dynamic Addresses] Re-registering ${allAddresses.length} addresses for chain ${chainId}`,
  );

  await Promise.all(
    allAddresses.map((address) =>
      fetch('/api/register-dynamic-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainId, address, type: 'other' }),
      }).catch((error) => {
        console.error('Error re-registering address with server:', error);
      }),
    ),
  );
};

const initializeCache = (chainId: number): void => {
  if (!dynamicAddressesCache[chainId]) {
    dynamicAddressesCache[chainId] = {
      governance: new Set(),
      escrow: new Set(),
      other: new Set(),
    };
  }
};
