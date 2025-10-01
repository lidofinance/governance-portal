import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { useAccount } from 'wagmi';
import { useVote } from '../hooks/use-vote';
import { VoteMode, voteModeDict } from '../types';
import { useTxModalVote } from '../write-actions/vote/modal-stages';
import { useVoteTxSender } from '../write-actions/vote/tx-sender';
import { Address } from 'viem';
import { useIsContract } from '../../../shared/blockchain/hooks/use-is-contract';
import { useTxConfirmation } from '../../../shared/hooks/use-tx-conformation';
import { useQueryClient } from '@tanstack/react-query';
import { useLidoSDK } from '../../../providers/lido-sdk';

type Value = {
  voteId: bigint;
  handleDelegatedVote: ({ mode }: { mode: VoteMode }) => Promise<void>;
  handleOwnVote: ({ mode }: { mode: VoteMode }) => Promise<void>;
  currentMode: VoteMode;
  setCurrentMode: Dispatch<SetStateAction<VoteMode>>;
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
  const voteData = useVote({ voteId: BigInt(voteId) });
  const { txModalStages } = useTxModalVote();
  const { data: isMultisig } = useIsContract();
  const { voteOwnTxSender, voteDelegatedTxSender } = useVoteTxSender();
  const waitForTx = useTxConfirmation();
  const queryClient = useQueryClient();
  const { isConnected, address: accountAddress } = useAccount();
  const { chainId } = useLidoSDK();

  const [currentMode, setCurrentMode] = useState<VoteMode>('yay');

  const onOwnVoteSubmit = useCallback(
    async (mode: VoteMode) => {
      try {
        const txHash = await voteOwnTxSender({
          mode,
          voteId: BigInt(voteId),
        });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(currentMode, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        if (voteData?.refetch) {
          await voteData.refetch();
          await queryClient.invalidateQueries({
            queryKey: ['vote', String(voteId), chainId, accountAddress],
          });
        }

        txModalStages.success({
          mode: currentMode,
          txHash,
          onVoteWithOwnTokens: onOwnVoteSubmit,
          onVoteWithRemainingDelegated: onDelegateVoteSubmit,
          voteEvents: voteData?.voteEvents,
          votePhase: voteData?.phase,
          votePower: voteData?.votePowerWei || 0n,
          voteId: BigInt(voteId),
          title: `You voted "${voteModeDict[currentMode]}"`,
        });
      } catch (error) {
        console.error('Error during vote:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error occurred'),
        );
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [
      accountAddress,
      chainId,
      currentMode,
      isMultisig,
      queryClient,
      txModalStages,
      voteData,
      voteId,
      voteOwnTxSender,
      waitForTx,
    ],
  );

  const onDelegateVoteSubmit = useCallback(
    async (voters: Address[]) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet to vote'));
        return;
      }

      try {
        const txHash = await voteDelegatedTxSender({
          mode: currentMode,
          voteId: BigInt(voteId),
          voters,
        });

        if (isMultisig) {
          txModalStages.successMultisig();
          return true;
        }

        txModalStages.pending(currentMode, txHash);

        const response = await waitForTx(txHash);

        if (response.status === 'reverted') {
          txModalStages.failed(new Error('Transaction was reverted'));
          return;
        }

        if (voteData?.refetch) {
          await voteData.refetch();
          await queryClient.invalidateQueries({
            queryKey: ['vote', String(voteId), chainId, accountAddress],
          });
        }

        txModalStages.success({
          mode: currentMode,
          txHash,
          onVoteWithOwnTokens: onOwnVoteSubmit,
          onVoteWithRemainingDelegated: onDelegateVoteSubmit,
          voteEvents: voteData?.voteEvents,
          votePhase: voteData?.phase,
          votePower: voteData?.votePowerWei || 0n,
          voteId: BigInt(voteId),
          title: `You voted "${voteModeDict[currentMode]}" as a Delegate`,
        });
      } catch (error) {
        console.error('Error during delegated vote:', error);
        txModalStages.failed(
          error instanceof Error ? error : new Error('Unknown error occurred'),
        );
      }
    },
    [
      isConnected,
      txModalStages,
      voteDelegatedTxSender,
      currentMode,
      voteId,
      isMultisig,
      waitForTx,
      voteData,
      onOwnVoteSubmit,
      queryClient,
      chainId,
      accountAddress,
    ],
  );

  const handleDelegatedVote = useCallback(
    async ({ mode }: { mode: VoteMode }) => {
      if (!isConnected) {
        txModalStages.failed(new Error('Please connect your wallet to vote'));
        return;
      }

      setCurrentMode(mode);

      txModalStages.confirm({
        mode,
        voteId: BigInt(voteId),
        onSubmit: onDelegateVoteSubmit,
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

      setCurrentMode(mode);

      txModalStages.sign({
        mode,
      });

      await onOwnVoteSubmit(mode);
    },
    [isConnected, onOwnVoteSubmit, txModalStages],
  );

  return (
    <VoteActionsContext.Provider
      value={{
        voteId: BigInt(voteId),
        handleDelegatedVote,
        handleOwnVote,
        currentMode,
        setCurrentMode,
      }}
    >
      {children}
    </VoteActionsContext.Provider>
  );
};
