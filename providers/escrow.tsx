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
import { useWatchContractEvent } from 'wagmi';
import { escrowAbi } from '../abi/ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from './lido-sdk';
import { StETH } from 'shared/blockchain/contracts';

type EscrowQueryKeys = {
  escrowData: readonly string[];
  pooledEthByShares: readonly string[];
  stEthTotalSupply: readonly string[];
  dgCurrentState: readonly string[];
  escrowBalances: readonly string[];
};

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
  ESCROW_QUERY_KEYS: EscrowQueryKeys;
  invalidateEscrowQueries: () => void;
};

type LockedAssets = {
  totalStETHLockedShares: bigint;
  totalStETHClaimedETH: bigint;
  totalUnstETHUnfinalizedShares: bigint;
  totalUnstETHFinalizedETH: bigint;
};

const DEFAULT_QUERY_KEYS: EscrowQueryKeys = {
  escrowData: ['escrow-data'],
  pooledEthByShares: ['pooledEthByShares'],
  stEthTotalSupply: ['stEthTotalSupply'],
  dgCurrentState: ['dg-current-state'],
  escrowBalances: ['escrow-balances'],
};

export const EscrowContext = createContext<EscrowContextValue>({
  totalStEthInEscrow: 0n,
  stEthTotalSupply: 0n,
  rageQuitSupport: 0n,
  isLoading: true,
  error: null,
  refetch: async () => {},
  ESCROW_QUERY_KEYS: DEFAULT_QUERY_KEYS,
  invalidateEscrowQueries: () => {},
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
  const queryClient = useQueryClient();

  type EscrowData = {
    lockedAssets: LockedAssets;
    rageQuitSupport: bigint;
  };

  const ESCROW_QUERY_KEYS: EscrowQueryKeys = useMemo(() => {
    return {
      escrowData: ['escrow-data'],
      pooledEthByShares: ['pooled-eth-by-shares'],
      stEthTotalSupply: ['steth-total-supply'],
      dgCurrentState: ['dg-current-state'],
      escrowBalances: ['escrow-balances'],
    };
  }, []);

  const invalidateEscrowQueries = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ESCROW_QUERY_KEYS.escrowData,
    });
    void queryClient.invalidateQueries({
      queryKey: ESCROW_QUERY_KEYS.pooledEthByShares,
    });
    void queryClient.invalidateQueries({
      queryKey: ESCROW_QUERY_KEYS.stEthTotalSupply,
    });
    void queryClient.invalidateQueries({
      queryKey: ESCROW_QUERY_KEYS.dgCurrentState,
    });
  }, [
    ESCROW_QUERY_KEYS.dgCurrentState,
    ESCROW_QUERY_KEYS.escrowData,
    ESCROW_QUERY_KEYS.pooledEthByShares,
    ESCROW_QUERY_KEYS.stEthTotalSupply,
    queryClient,
  ]);

  const {
    data: escrowData,
    refetch: refetchEscrowData,
    error: escrowDataError,
  } = useQuery<EscrowData>({
    queryKey: [...ESCROW_QUERY_KEYS.escrowData, vetoSignallingAddress, chainId],
    queryFn: async () => {
      if (!vetoSignallingAddress) {
        throw new Error('vetoSignallingAddress must be defined');
      }

      const readVetoSignalling = readEscrowGetter(vetoSignallingAddress);

      const [lockedAssets, rageQuitSupport] = await Promise.all([
        readVetoSignalling('getSignallingEscrowDetails'),
        readVetoSignalling('getRageQuitSupport'),
      ]);

      return {
        lockedAssets,
        rageQuitSupport,
      };
    },
    enabled: !!vetoSignallingAddress,
    staleTime: 0,
    retry: 2,
  });

  const unfinalizedShares = escrowData?.lockedAssets
    ? escrowData.lockedAssets.totalStETHLockedShares +
      escrowData.lockedAssets.totalUnstETHUnfinalizedShares
    : undefined;

  const {
    data: pooledEthByShares,
    refetch: refetchPooledEth,
    error: pooledEthError,
  } = useQuery<bigint>({
    queryKey: [...ESCROW_QUERY_KEYS.pooledEthByShares, chainId],
    queryFn: async () => {
      if (!unfinalizedShares) {
        throw new Error('unfinalizedShares must be defined');
      }

      return await stEthContract.readContract('getPooledEthByShares', [
        unfinalizedShares,
      ]);
    },
    enabled: !!unfinalizedShares,
    staleTime: 0,
    retry: 2,
  });

  const {
    data: _stEthTotalSupply,
    refetch: refetchTotalSupply,
    error: totalSupplyError,
  } = useQuery<bigint>({
    queryKey: [...ESCROW_QUERY_KEYS.stEthTotalSupply, chainId],
    queryFn: async () => {
      return await stEthContract.readContract('totalSupply');
    },
    staleTime: 0,
    retry: 2,
  });

  const stEthTotalSupply = useMemo(() => {
    if (!escrowData?.lockedAssets || !_stEthTotalSupply) return 0n;
    return _stEthTotalSupply + escrowData.lockedAssets.totalUnstETHFinalizedETH;
  }, [_stEthTotalSupply, escrowData?.lockedAssets]);

  const totalStEthInEscrow = useMemo(() => {
    if (!pooledEthByShares || !escrowData?.lockedAssets) {
      return 0n;
    }

    return pooledEthByShares + escrowData.lockedAssets.totalUnstETHFinalizedETH;
  }, [escrowData?.lockedAssets, pooledEthByShares]);

  const error = useMemo(() => {
    return (
      addressDataError ||
      escrowDataError ||
      pooledEthError ||
      totalSupplyError ||
      null
    );
  }, [addressDataError, escrowDataError, pooledEthError, totalSupplyError]);

  const isLoading =
    isAddressDataLoading ||
    (!!vetoSignallingAddress && !escrowData) ||
    (!!unfinalizedShares && !pooledEthByShares) ||
    !_stEthTotalSupply;

  const refetchAll = useCallback(async () => {
    await Promise.all([
      refetchAddresses(),
      refetchEscrowData(),
      refetchPooledEth(),
      refetchTotalSupply(),
    ]);
  }, [
    refetchAddresses,
    refetchEscrowData,
    refetchPooledEth,
    refetchTotalSupply,
  ]);

  const isEnabled = !!vetoSignallingAddress;

  // Watch for StETHSharesLocked events (when user locks tokens)
  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'StETHSharesLocked',
    enabled: isEnabled,
    onLogs: () => {
      invalidateEscrowQueries();
      void refetchAll();
    },
  });

  // Watch for StETHSharesUnlocked events (when user unlocks stETH tokens)
  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'StETHSharesUnlocked',
    enabled: isEnabled,
    onLogs: () => {
      invalidateEscrowQueries();
      void refetchAll();
    },
  });

  // Watch for UnstETHLocked events (when user locks unstETH tokens)
  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'UnstETHLocked',
    enabled: isEnabled,
    onLogs: () => {
      invalidateEscrowQueries();
      void refetchAll();
    },
  });

  // Watch for UnstETHUnlocked events (when user unlocks unstETH tokens)
  useWatchContractEvent({
    address: vetoSignallingAddress,
    abi: escrowAbi,
    eventName: 'UnstETHUnlocked',
    enabled: isEnabled,
    onLogs: () => {
      invalidateEscrowQueries();
      void refetchAll();
    },
  });

  const value: EscrowContextValue = useMemo(
    () => ({
      vetoSignallingAddress,
      rageQuitAddress,
      historicalEscrowAddresses,
      totalStEthInEscrow,
      stEthTotalSupply,
      rageQuitSupport: escrowData?.rageQuitSupport ?? 0n,
      isLoading,
      error,
      refetch: refetchAll,
      ESCROW_QUERY_KEYS,
      invalidateEscrowQueries,
    }),
    [
      vetoSignallingAddress,
      rageQuitAddress,
      historicalEscrowAddresses,
      totalStEthInEscrow,
      stEthTotalSupply,
      escrowData?.rageQuitSupport,
      isLoading,
      error,
      refetchAll,
      ESCROW_QUERY_KEYS,
      invalidateEscrowQueries,
    ],
  );

  return (
    <EscrowContext.Provider value={value}>{children}</EscrowContext.Provider>
  );
};
