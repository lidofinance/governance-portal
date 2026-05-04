/* eslint-disable no-console */
import * as ADDR from 'shared/blockchain/contract-addresses';
import * as abis from 'abi/generated';
import { ABI_EXCEPTIONS } from 'constants/abi-exceptions';
import { getAbiKey } from 'shared/blockchain/utils/abi';

// Contracts registered in contract-addresses.ts but missing an ABI
for (const name of Object.keys(ADDR)) {
  if (name in ABI_EXCEPTIONS) {
    continue;
  }

  const key = getAbiKey(name);
  if (
    (!(key in abis) || !Array.isArray((abis as any)[key])) &&
    !name.toLowerCase().includes('committee') // no need to check committees since we store their addresses only for potential voting script references
  ) {
    console.log(`MISSING: ${name} (tried ${key})`);
  }
}

// Entries in ABI_EXCEPTIONS that don't need to be there:
//   ORPHAN    — the contract name is no longer exported from contract-addresses.ts
//   REDUNDANT — the auto-derived ABI key resolves to the same ABI reference,
//               so the exception adds nothing over the default lookup.
for (const [name, exceptionAbi] of Object.entries(ABI_EXCEPTIONS)) {
  if (!(name in ADDR)) {
    console.log(
      `ORPHAN: ${name} is in ABI_EXCEPTIONS but not in contract-addresses.ts`,
    );
    continue;
  }

  const autoKey = getAbiKey(name);
  const autoAbi = (abis as any)[autoKey];
  if (autoAbi && autoAbi === exceptionAbi) {
    console.log(
      `REDUNDANT: ${name} → ${autoKey} auto-resolves to the same ABI; exception can be removed`,
    );
  }
}
