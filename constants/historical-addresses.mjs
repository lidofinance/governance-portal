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
      '0x9CAaCCc62c66d817CC59c44780D1b722359795bF',
    ],
    emergencyProtectedTimelockAddress:
      '0x0A5E22782C0Bd4AddF10D771f0bF0406B038282d',
    escrowAddresses: [
      '0x0ab2ebf304e41bcc5db37bf0a3fdb83faa19324e',
      '0x781afe6c8d768ceaa9a97f2a75714e80ae0e83b9',
    ],
  },
  [CHAINS.Mainnet]: {
    governanceAddresses: [
      '0xC1db28B3301331277e307FDCfF8DE28242A4486E', // proposed
      '0x553337946F2FAb8911774b20025fa776B76a7CcE', // emergency governance
      '0xcdf49b058d606ad34c5789fd8c3bf8b3e54ba2db', // proposed to remove
      '0x75850938c1aa50b8cc6eb3c00995759dc1425ae6',
    ],
    emergencyProtectedTimelockAddress:
      '0xCE0425301C85c5Ea2A0873A2dEe44d78E02D2316',
    escrowAddresses: [
      '0xa8f14d033f377779274ae016584a05bf14dccaf8',
      '0x165813a31446a98c84e20dda8c101bb3c8228e1c',
    ],
  },
};
