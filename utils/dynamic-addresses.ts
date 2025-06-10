import { Address } from 'viem';

/**
 * This util is to getLogs from the historical governance addresses
 * Bypassing RPC allowedGetLogs addresses validation
 */

const dynamicGovernanceAddresses: Record<number, Set<Address>> = {};

export const addDynamicGovernanceAddress = async (
  chainId: number,
  address: Address,
): Promise<void> => {
  if (!dynamicGovernanceAddresses[chainId]) {
    dynamicGovernanceAddresses[chainId] = new Set();
  }

  if (dynamicGovernanceAddresses[chainId].has(address)) {
    return;
  }

  dynamicGovernanceAddresses[chainId].add(address);
  try {
    const response = await fetch('/api/register-governance-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chainId, address }),
    });

    if (!response.ok) {
      console.error(
        'Failed to register governance address with server:',
        await response.text(),
      );
    }
  } catch (error) {
    console.error('Error registering governance address with server:', error);
  }
};

export const getDynamicGovernanceAddresses = (chainId: number): Address[] => {
  return Array.from(dynamicGovernanceAddresses[chainId] || new Set());
};
