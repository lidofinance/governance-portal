import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react';
import invariant from 'tiny-invariant';
import { useEscrowAddresses } from 'features/dual-governance/hooks';
import { Address } from 'viem';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { escrowAbi } from '../abi/ts';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from './lido-sdk';
import { StETH } from 'shared/blockchain/contracts';

type EscrowContextValue = {
  vetoSignallingAddress?: Address;
  rageQuitAddress?: Address;
  historicalEscrowAddresses?: Address[] | null;
  isLoading: boolean;
  totalStEthInEscrow: bigint;
  stEthTotalSupply: bigint;
  rageQuitSupport: bigint;
  error: Error | null;
  refetch: () => Promise<void>;
};

type LockedAssets = {
  totalStETHLockedShares: bigint;
  totalStETHClaimedETH: bigint;
  totalUnstETHUnfinalizedShares: bigint;
  totalUnstETHFinalizedETH: bigint;
};

export const EscrowContext = createContext<EscrowContextValue>({
  totalStEthInEscrow: 0n,
  stEthTotalSupply: 0n,
  rageQuitSupport: 0n,
  isLoading: true,
  error: null,
  refetch: async () => {},
});

export const useEscrowContext = () => {
  const value = useContext(EscrowContext);
  invariant(
    value,
    'useEscrowContext was used outside the EscrowContext provider',
  );
  return value;
};

export const EscrowProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chainId } = useLidoSDK();
  const {
    vetoSignallingAddress,
    rageQuitAddress,
    historicalEscrowAddresses,
    isLoading: isAddressDataLoading,
    error: addressDataError,
    refetch: refetchAddresses,
  } = useEscrowAddresses();

  const readEscrowGetter = useReadContractGetter(escrowAbi);
  const stEthContract = useReadContract(StETH);

  const {
    data: lockedAssets,
    refetch: refetchLockedAssets,
    error: lockedAssetsError,
  } = useQuery<LockedAssets, Error>({
    queryKey: ['lockedAssets', vetoSignallingAddress, chainId],
    queryFn: async () => {
      if (!vetoSignallingAddress) {
        throw new Error('vetoSignallingAddress must be defined');
      }

      const readVetoSignalling = readEscrowGetter(vetoSignallingAddress);
      return await readVetoSignalling('getSignallingEscrowDetails');
    },
    enabled: !!vetoSignallingAddress,
    staleTime: 300000,
    retry: 2,
  });

  const {
    data: rageQuitSupport,
    refetch: refetchRageQuitSupport,
    error: rageQuitSupportError,
  } = useQuery<bigint, Error>({
    queryKey: ['rageQuitSupport', vetoSignallingAddress, chainId],
    queryFn: async () => {
      if (!vetoSignallingAddress) {
        throw new Error('vetoSignallingAddress must be defined');
      }
      const readVetoSignalling = readEscrowGetter(vetoSignallingAddress);
      return await readVetoSignalling('getRageQuitSupport');
    },
    enabled: !!vetoSignallingAddress,
    staleTime: 300000,
    retry: 2,
  });

  const unfinalizedShares = lockedAssets
    ? lockedAssets?.totalStETHLockedShares +
      lockedAssets.totalUnstETHUnfinalizedShares
    : undefined;

  const {
    data: pooledEthByShares,
    refetch: refetchPooledEth,
    error: pooledEthError,
  } = useQuery<bigint, Error>({
    queryKey: ['pooledEthByShares', chainId],
    queryFn: async () => {
      if (!unfinalizedShares) {
        throw new Error('unfinalizedShares must be defined');
      }

      return await stEthContract.readContract('getPooledEthByShares', [
        unfinalizedShares,
      ]);
    },
    enabled: !!unfinalizedShares,
    staleTime: 300000,
    retry: 2,
  });

  const {
    data: _stEthTotalSupply,
    refetch: refetchTotalSupply,
    error: totalSupplyError,
  } = useQuery<bigint, Error>({
    queryKey: ['stEthTotalSupply', chainId],
    queryFn: async () => {
      return await stEthContract.readContract('totalSupply');
    },
    staleTime: 300000,
    retry: 2,
  });

  const stEthTotalSupply = useMemo(() => {
    if (!lockedAssets || !_stEthTotalSupply) return 0n;
    return _stEthTotalSupply + lockedAssets.totalUnstETHFinalizedETH;
  }, [_stEthTotalSupply, lockedAssets]);

  const totalStEthInEscrow = useMemo(() => {
    if (!pooledEthByShares || !lockedAssets) return 0n;
    return pooledEthByShares + lockedAssets.totalUnstETHFinalizedETH;
  }, [lockedAssets, pooledEthByShares]);

  const error = useMemo(() => {
    return (
      addressDataError ||
      lockedAssetsError ||
      pooledEthError ||
      totalSupplyError ||
      rageQuitSupportError ||
      null
    );
  }, [
    addressDataError,
    lockedAssetsError,
    pooledEthError,
    rageQuitSupportError,
    totalSupplyError,
  ]);

  const isLoading =
    isAddressDataLoading ||
    (!!vetoSignallingAddress && !lockedAssets) ||
    (!!unfinalizedShares && !pooledEthByShares) ||
    !_stEthTotalSupply;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      refetchAddresses(),
      refetchLockedAssets(),
      refetchPooledEth(),
      refetchTotalSupply(),
      refetchRageQuitSupport(),
    ]);
  }, [
    refetchAddresses,
    refetchLockedAssets,
    refetchPooledEth,
    refetchTotalSupply,
    refetchRageQuitSupport,
  ]);

  const value: EscrowContextValue = useMemo(
    () => ({
      vetoSignallingAddress,
      rageQuitAddress,
      historicalEscrowAddresses,
      totalStEthInEscrow,
      stEthTotalSupply,
      rageQuitSupport: rageQuitSupport ?? 0n,
      isLoading,
      error,
      refetch: refetchAll,
    }),
    [
      vetoSignallingAddress,
      rageQuitAddress,
      totalStEthInEscrow,
      stEthTotalSupply,
      historicalEscrowAddresses,
      rageQuitSupport,
      isLoading,
      error,
      refetchAll,
    ],
  );

  return (
    <EscrowContext.Provider value={value}>{children}</EscrowContext.Provider>
  );
};
