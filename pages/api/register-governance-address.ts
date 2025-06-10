import type { NextApiRequest, NextApiResponse } from 'next';
import { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { addDynamicAllowedLogsAddress } from '../../utilsApi/rpcFactory';

// Cache for dynamically discovered governance addresses
const dynamicGovernanceAddresses: Record<number, Set<Address>> = {};

// Function to add a dynamic governance address to the whitelist
export const addDynamicGovernanceAddress = (
  chainId: number,
  address: Address,
): void => {
  if (!dynamicGovernanceAddresses[chainId]) {
    dynamicGovernanceAddresses[chainId] = new Set();
  }
  dynamicGovernanceAddresses[chainId].add(address);
};

// Function to get all dynamic governance addresses for a chain
export const getDynamicGovernanceAddresses = (chainId: number): Address[] => {
  return Array.from(dynamicGovernanceAddresses[chainId] || new Set());
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { chainId, address } = req.body;

    // Validate inputs
    if (!chainId || !address) {
      return res.status(400).json({ message: 'Missing chainId or address' });
    }

    // Validate chainId is supported
    if (!Object.values(CHAINS).includes(Number(chainId))) {
      return res.status(400).json({ message: 'Unsupported chainId' });
    }

    // Register the address in our local cache
    addDynamicGovernanceAddress(Number(chainId), address as Address);

    // Register the address with the RPC validation system
    addDynamicAllowedLogsAddress(Number(chainId), address as string);

    return res.status(200).json({
      success: true,
      message: `Registered governance address ${address} for chain ${chainId}`,
      addresses: getDynamicGovernanceAddresses(Number(chainId)),
    });
  } catch (error) {
    console.error('Error registering governance address:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
