// Real values from DualGovernanceConfigProvider (mainnet)
const DG_CONFIG = {
  firstSealRageQuitSupport: 10000000000000000n, // 1%
  secondSealRageQuitSupport: 100000000000000000n, // 10%
  minAssetsLockDuration: 0,
  vetoSignallingMinDuration: 432000, // 5 days
  vetoSignallingMaxDuration: 3888000, // 45 days
  vetoSignallingMinActiveDuration: 0,
  vetoSignallingDeactivationMaxDuration: 0,
  vetoCooldownDuration: 0,
  rageQuitExtensionPeriodDuration: 0,
  rageQuitEthWithdrawalsMinDelay: 0,
  rageQuitEthWithdrawalsMaxDelay: 0,
  rageQuitEthWithdrawalsDelayGrowth: 0,
};

const STETH_TOTAL_SUPPLY = 1_000_000n * 10n ** 18n;

jest.mock('shared/blockchain/utils', () => ({
  parsePercent16: (value: bigint | null | undefined): number => {
    if (!value) return 0;
    return Number(value) / 1e16;
  },
  formatNumber: ({ value }: { value: number | string }): string =>
    String(parseFloat(String(value))),
}));

jest.mock('viem', () => ({
  formatEther: (value: bigint): string => String(Number(value) / 1e18),
}));

import { getAmountUntilVetoSignalling } from '../get-amount-till-vetosignalling';

const NOW = 1_743_500_000;

const makeState = (persistedStateEnteredAt: number) => ({
  effectiveState: 3,
  persistedState: 3,
  persistedStateEnteredAt,
  vetoSignallingActivatedAt: 0,
  vetoSignallingReactivationTime: 0,
  normalOrVetoCooldownExitedAt: 0,
  rageQuitRound: 0n,
  vetoSignallingDuration: 0,
});

describe('getAmountUntilVetoSignalling', () => {
  beforeEach(() => jest.spyOn(Date, 'now').mockReturnValue(NOW * 1000));
  afterEach(() => jest.restoreAllMocks());

  it('returns null when less than minDuration has elapsed since state entry', () => {
    // timestampDiff = NOW - (NOW - 100) - 432000 = -431900 < 0
    expect(
      getAmountUntilVetoSignalling(
        makeState(NOW - 100),
        DG_CONFIG,
        STETH_TOTAL_SUPPLY,
      ),
    ).toBeNull();
  });

  it('returns a percentage between first and second seal when conditions allow', () => {
    // Entered 500_000s ago (5.8 days) — past minDuration of 432_000s (5 days)
    // futureTimestamp - persistedStateEnteredAt - minDuration = 510800 - 432000 = 78800
    // Expected: 1 + 9 * 78800 / 3456000 ≈ 1.205%
    const result = getAmountUntilVetoSignalling(
      makeState(NOW - 500_000),
      DG_CONFIG,
      STETH_TOTAL_SUPPLY,
    );

    expect(result).not.toBeNull();
    if (!result) {
      return;
    }
    const percentage = parseFloat(result.percentage);
    expect(percentage).toBeGreaterThan(1); // above firstSeal
    expect(percentage).toBeLessThan(10); // below secondSeal
    expect(parseFloat(result.value)).toBeGreaterThan(0);
  });

  it('returns null when so much time has elapsed that needed support exceeds second seal', () => {
    // Entered 4_000_000s ago — required support would exceed 10%
    expect(
      getAmountUntilVetoSignalling(
        makeState(NOW - 4_000_000),
        DG_CONFIG,
        STETH_TOTAL_SUPPLY,
      ),
    ).toBeNull();
  });
});
