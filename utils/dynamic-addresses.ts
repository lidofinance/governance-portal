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

const initializeCache = (chainId: number): void => {
  if (!dynamicAddressesCache[chainId]) {
    dynamicAddressesCache[chainId] = {
      governance: new Set(),
      escrow: new Set(),
      other: new Set(),
    };
  }
};

export const registerDynamicAddress = async (
  chainId: number,
  address: Address,
  type: AddressType = 'other',
): Promise<void> => {
  addDynamicAddress(chainId, address, type);

  try {
    await fetch('/api/register-dynamic-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chainId, address, type }),
    });
  } catch (error) {
    console.error(`Error registering ${type} address with server:`, error);
  }
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
