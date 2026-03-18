import { Cache } from 'memory-cache';
import { CowApiOrder } from '@stonks/types';

// in-memory store for testnet mock Stonks orders.
// Allows place-order to save a mock and get-order to retrieve it,
// enabling full order lifecycle testing on testnet without CoW API.
const testnetOrderCache = new Cache<string, CowApiOrder>();

const ORDER_TTL_MS = 60 * 60 * 1000; // 1 hour

export const setTestnetOrder = (address: string, order: CowApiOrder) => {
  testnetOrderCache.put(address.toLowerCase(), order, ORDER_TTL_MS);
};

export const getTestnetOrder = (address: string): CowApiOrder | null => {
  return testnetOrderCache.get(address.toLowerCase());
};
