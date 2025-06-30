import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

/**
 * Etherscan search topics
 * Governance: 0xc73be659241aade67e9a059bcf21494955018b213dbd1179054ccf928b13f3b6
 * Escrow: 0xc0f1a18e08c85cf22fa704235a03f65fb5cbb6865d48842e4841dd524a2f4fa6
 */

export const HISTORICAL_ADDRESSES = {
  [CHAINS.Hoodi]: {
    governanceAddresses: [
      '0x4d12b9f6aCAB54FF6a3a776BA3b8724D9B77845F',
      '0xf1fbb8360c19830228260ed5bb432476a9d4897a',
    ],
    escrowAddresses: ['0x0ab2ebf304e41bcc5db37bf0a3fdb83faa19324e'],
  },
  [CHAINS.Mainnet]: {
    governanceAddresses: [
      '0xcdf49b058d606ad34c5789fd8c3bf8b3e54ba2db',
      '0x75850938c1aa50b8cc6eb3c00995759dc1425ae6',
    ],
    escrowAddresses: ['0xa8f14d033f377779274ae016584a05bf14dccaf8'],
  },
};
