import { createContext, FC, useCallback, useContext } from 'react';
import invariant from 'tiny-invariant';
import { useAccount } from 'wagmi';
import { useVote } from '../hooks/use-vote';
import { VoteMode, voteModeDict } from '../types';
import { useTxModalVote } from '../write-actions/vote/modal-stages';
import { useVoteTxSender } from '../write-actions/vote/tx-sender';
import { Address } from 'viem';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from 'shared/hooks/use-tx-conformation';
import { useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';

type Value = {
  voteId: bigint;
  handleDelegatedVote: ({ mode }: { mode: VoteMode }) => Promise<void>;
  handleOwnVote: ({ mode }: { mode: VoteMode }) => Promise<void>;
  handleEnact: () => Promise<void>;
} | null;

type VoteActionsProviderProps = {
  voteId: string;
  children?: React.ReactNode;
};

const VoteActionsContext = createContext<Value>(null);

export const useVoteActionsContext = () => {
  const value = useContext(VoteActionsContext);
  invariant(
    value,
    'useVoteActionsContext was used outside the VoteContext provider',
  );
  return value;
};

export const VoteActionsProvider: FC<VoteActionsProviderProps> = ({
  voteId,
  children,
}) => {
  const { data: voteData, refetch } = useVote({ voteId: BigInt(voteId) });
  const { txModalStages } = useTxModalVote();
  const { data: isMultisig } = useIsContract();
  const { voteOwnTxSender, voteDelegatedTxSender, voteEnactTxSender } =
    useVoteTxSender();
  const waitForTx = useTxConfirmation();
  const queryClient = useQueryClient();
  const { isConnected, address: accountAddress } = useAccount();
  const { chainId } = useLidoSDK();

  const onOwnVoteSubmit = useCallback(
    async (mode: VoteMode) => {
      if (!voteData) {
        return;
      }
      try {
        const txHash = await voteOwnTxSender({
          mode,
          voteId: BigInt(voteId),
        });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(mode, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        let updatedVoteData = voteData;
        if (refetch) {
          const refetchResult = await refetch();
          updatedVoteData = refetchResult.data || voteData;

          await queryClient.invalidateQueries({
            queryKey: ['vote', String(voteId), chainId, accountAddress],
          });
        }

        txModalStages.success({
          mode,
          txHash,
          onVoteWithOwnTokens: onOwnVoteSubmit,
          onVoteWithRemainingDelegated: (
            selectedVoters: Address[],
            voteMode: VoteMode,
          ) => onDelegateVoteSubmit(voteMode, selectedVoters),
          voteEvents: updatedVoteData?.voteEvents,
          votePhase: updatedVoteData?.phase,
          votePower: updatedVoteData?.votePowerWei || 0n,
          voteId: BigInt(voteId),
          title: `You voted "${voteModeDict[mode]}"`,
        });
      } catch (error) {
        console.error('Error during vote:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error occurred'),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      accountAddress,
      chainId,
      isMultisig,
      queryClient,
      refetch,
      txModalStages,
      voteData,
      voteId,
      voteOwnTxSender,
      waitForTx,
    ],
  );

  const onDelegateVoteSubmit = useCallback(
    async (mode: VoteMode, voters: Address[]) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet to vote'));
        return;
      }

      try {
        const txHash = await voteDelegatedTxSender({
          mode,
          voteId: BigInt(voteId),
          voters,
        });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(mode, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        let updatedVoteData = voteData;
        if (refetch) {
          const refetchResult = await refetch();
          updatedVoteData = refetchResult.data || voteData;

          await queryClient.invalidateQueries({
            queryKey: ['vote', String(voteId), chainId, accountAddress],
          });
        }

        txModalStages.success({
          mode,
          txHash,
          onVoteWithOwnTokens: onOwnVoteSubmit,
          onVoteWithRemainingDelegated: (
            selectedVoters: Address[],
            voteMode: VoteMode,
          ) => onDelegateVoteSubmit(voteMode, selectedVoters),
          voteEvents: updatedVoteData?.voteEvents,
          votePhase: updatedVoteData?.phase,
          votePower: updatedVoteData?.votePowerWei || 0n,
          voteId: BigInt(voteId),
          title: `You voted "${voteModeDict[mode]}" as a Delegate`,
        });
      } catch (error) {
        console.error('Error during delegated vote:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error occurred'),
        );
      }
    },
    [
      accountAddress,
      chainId,
      isConnected,
      isMultisig,
      onOwnVoteSubmit,
      queryClient,
      refetch,
      txModalStages,
      voteData,
      voteDelegatedTxSender,
      voteId,
      waitForTx,
    ],
  );

  const onVoteEnact = useCallback(async () => {
    try {
      const txHash = await voteEnactTxSender({
        voteId: BigInt(voteId),
      });

      if (isMultisig) {
        txModalStages.successMultisig();
        return true;
      }

      txModalStages.pendingEnact({ voteId, txHash });

      const response = await waitForTx(txHash);

      if (response.status === 'reverted') {
        txModalStages.failed(new Error('Transaction was reverted'));
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ['vote', String(voteId), chainId, accountAddress],
      });

      txModalStages.successEnact({ voteId, txHash });
    } catch (e) {
      console.error('Error during enacting vote:', e);
    }
  }, [
    accountAddress,
    chainId,
    isMultisig,
    queryClient,
    txModalStages,
    voteEnactTxSender,
    voteId,
    waitForTx,
  ]);

  const handleDelegatedVote = useCallback(
    async ({ mode }: { mode: VoteMode }) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet to vote'));
        return;
      }

      txModalStages.confirm({
        mode,
        voteId: BigInt(voteId),
        onSubmit: (voters: Address[]) => onDelegateVoteSubmit(mode, voters),
      });
    },
    [isConnected, txModalStages, voteId, onDelegateVoteSubmit],
  );

  const handleOwnVote = useCallback(
    async ({ mode }: { mode: VoteMode }) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet to vote'));
        return;
      }

      txModalStages.sign({
        mode,
      });

      await onOwnVoteSubmit(mode);
    },
    [isConnected, onOwnVoteSubmit, txModalStages],
  );

  const handleEnact = useCallback(async () => {
    if (!isConnected) {
      txModalStages.failed(new Error('Please connect your wallet to enact'));
      return;
    }

    txModalStages.signEnact({ voteId });

    await onVoteEnact();
  }, [isConnected, onVoteEnact, txModalStages, voteId]);

  return (
    <VoteActionsContext.Provider
      value={{
        voteId: BigInt(voteId),
        handleDelegatedVote,
        handleOwnVote,
        handleEnact,
      }}
    >
      {children}
    </VoteActionsContext.Provider>
  );
};
