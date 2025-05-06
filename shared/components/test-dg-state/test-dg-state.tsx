import { useCallback, useRef, useState } from 'react';
import { usePublicClient, useWalletClient } from 'wagmi';
import { Button } from 'shared/components/button';
import { StyledPopupMenu } from 'shared/styled-components';
import {
  GovernanceState,
  VisibleGovernanceState,
} from 'features/dual-governance/types';

import { Text } from 'shared/components/text';

import {
  Actions,
  CurrentState,
  Indicator,
  StateItem,
  States,
  Wrapper,
} from './style';
import { useDualGovernanceState } from 'features/dual-governance/hooks';
import { DualGovernance, WithdrawalQueue } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { Address } from 'viem';
import { useDualGovernanceContext } from 'providers/dual-governance';
import { useWriteContract } from '../../blockchain/hooks/use-write-contract';
import {
  useReadContract,
  useReadContractGetter,
} from '../../blockchain/hooks/use-read-contract';
import { escrowAbi } from 'abi/ts';
import { withdrawalQueueMockAbi } from 'abi/ts/withdrawalQueueMock.abi';

export const TestDgState = () => {
  const stateRef = useRef(null);

  const [open, setIsOpen] = useState(false);
  const [isNextStateLoading, setIsNextStateLoading] = useState(false);
  const [tx, setTx] = useState('');

  const { chainId } = useLidoSDK();

  const { data: stateData } = useDualGovernanceState({
    vetoSignallingAddress: undefined,
  });

  const { rageQuitAddress: currentRageQuitEscrowAddress } =
    useDualGovernanceContext();

  const writeEscrowContract = useWriteContract(escrowAbi);

  const writeWithdrawalQueueContract = useWriteContract(withdrawalQueueMockAbi);
  const readWithdrawalQueueContract = useReadContract(WithdrawalQueue);
  const readEscrowContract = useReadContractGetter(escrowAbi);

  const readRQEscrowContract = currentRageQuitEscrowAddress
    ? readEscrowContract(currentRageQuitEscrowAddress)
    : null;

  const client = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const finalizeWQ = useCallback(async () => {
    const lastRequestId =
      await readWithdrawalQueueContract.readContract('getLastRequestId');

    if (lastRequestId) {
      await writeWithdrawalQueueContract({
        address: WithdrawalQueue.chainAddressMap[chainId] as Address,
        functionName: 'finalize',
        args: [lastRequestId, 1000000000000000000000000000n],
      });
    }
  }, [chainId, readWithdrawalQueueContract, writeWithdrawalQueueContract]);

  if (!stateData) {
    return null;
  }

  const requestNextWithdrawalsBatch = async () => {
    if (currentRageQuitEscrowAddress) {
      await writeEscrowContract({
        address: currentRageQuitEscrowAddress,
        functionName: 'requestNextWithdrawalsBatch',
        args: [10n],
      });
    }
  };

  const claimNextWithdrawalsBatch = async () => {
    if (currentRageQuitEscrowAddress && readRQEscrowContract) {
      // const unclaimedBatchesCount = await readRQEscrowContract(
      //   'getUnclaimedUnstETHIdsCount',
      // );

      await writeEscrowContract({
        address: currentRageQuitEscrowAddress,
        functionName: 'claimNextWithdrawalsBatch',
        args: [126000000000000000n],
      });
    }
  };

  const startRQExtensionPeriod = async () => {
    if (currentRageQuitEscrowAddress) {
      await writeEscrowContract({
        address: currentRageQuitEscrowAddress,
        functionName: 'startRageQuitExtensionPeriod',
        args: [],
      });
    }
  };

  const activateNextState = async () => {
    setIsNextStateLoading(true);
    if (!walletClient || !client) {
      console.error(
        'Client not connected',
        `WalletClient: ${walletClient}`,
        `Client: ${client}`,
      );
      return;
    }

    try {
      const tx = await walletClient.writeContract({
        address: DualGovernance.chainAddressMap[chainId] as Address,
        abi: DualGovernance.abi,
        functionName: 'activateNextState',
        account: walletClient.account.address,
      });

      setTx(tx);
      // const receipt = await client.waitForTransactionReceipt({ hash: tx });
    } catch (error) {
      console.error('Error activating next state:', error);
    } finally {
      setIsNextStateLoading(false);
    }
  };

  return (
    <>
      <Button ref={stateRef} size="sm" onClick={() => setIsOpen(true)}>
        DG state actions
      </Button>
      <StyledPopupMenu
        open={open}
        anchorRef={stateRef}
        onClose={() => setIsOpen(false)}
      >
        <Wrapper>
          <States>
            <StateItem>
              <Indicator $state={VisibleGovernanceState.Normal} />
              <Text>
                Normal: <b>{'<30% of VetoSignaling threshold added'}</b>
              </Text>
            </StateItem>
            <StateItem>
              <Indicator $state={VisibleGovernanceState.Warning} />
              <Text>
                Normal:{' '}
                <b>
                  {`>30% of VetoSignaling threshold added, active proposal scheduled`}
                </b>
              </Text>
            </StateItem>
            <StateItem>
              <Indicator
                $state={VisibleGovernanceState.BlockedVetoSignalling}
              />
              <Text>
                Blocked VetoSignaling: <b>VetoSignalling threshold reached</b>
              </Text>
            </StateItem>
            <StateItem>
              <Indicator $state={VisibleGovernanceState.BlockedRageQuit} />
              <Text>
                Blocked RageQuit: <b>RageQuit threshold reached</b>
              </Text>
            </StateItem>
            <StateItem>
              <Indicator $state={VisibleGovernanceState.BlockedDeactivation} />
              <Text>
                Blocked, Deactivation: <b>VetoSignaling Timelock finished</b>
              </Text>
            </StateItem>
            <StateItem>
              <Indicator $state={VisibleGovernanceState.Cooldown} />
              <Text>Cooldown</Text>
            </StateItem>
          </States>
          <CurrentState>
            <Text>
              Persisted state:{' '}
              <b>{GovernanceState[stateData.detailedState.persistedState]}</b>
            </Text>
            <Text>
              Effective state:{' '}
              <b>{GovernanceState[stateData.detailedState.effectiveState]}</b>
            </Text>
          </CurrentState>

          <Actions>
            <Button
              loading={isNextStateLoading}
              size="xs"
              onClick={activateNextState}
            >
              Activate next state
            </Button>
            <Text>Finalize RQ</Text>
            <hr style={{ width: '100%' }} />
            <Text> 1 - Request next withdrawals batch </Text>
            <Button
              loading={isNextStateLoading}
              size="xs"
              onClick={requestNextWithdrawalsBatch}
            >
              Request! Args(10)
            </Button>
            <Text>2 - Finalize WQ</Text>
            <Button loading={isNextStateLoading} size="xs" onClick={finalizeWQ}>
              Finalize
            </Button>
            <Text>3 - Claim next Withdrawals batch</Text>
            <Button
              loading={isNextStateLoading}
              size="xs"
              onClick={claimNextWithdrawalsBatch}
            >
              Claim! Args(10)
            </Button>
            <Text>4 - Start RQ extension period</Text>
            <Button
              loading={isNextStateLoading}
              size="xs"
              onClick={startRQExtensionPeriod}
            >
              Start!
            </Button>
            {tx && (
              <>
                <Text>
                  <a
                    target="_blank"
                    href={`https://hoodi.etherscan.io/tx/${tx}`}
                    rel="noreferrer"
                  >
                    See transaction
                  </a>
                </Text>
              </>
            )}
          </Actions>
        </Wrapper>
      </StyledPopupMenu>
    </>
  );
};
