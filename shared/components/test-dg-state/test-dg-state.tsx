import { useRef, useState } from 'react';
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
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { DualGovernance } from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { Address } from 'viem';

export const TestDgState = () => {
  const stateRef = useRef(null);

  const [open, setIsOpen] = useState(false);
  const [isNextStateLoading, setIsNextStateLoading] = useState(false);
  const [tx, setTx] = useState('');

  const { chainId } = useLidoSDK();

  const { data: stateData } = useDualGovernanceState({
    vetoSignallingAddress: undefined,
  });

  const client = usePublicClient();
  const { data: walletClient } = useWalletClient();

  if (!stateData) {
    return null;
  }

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

      console.log('Transaction sent:', tx);
      setTx(tx);
      const receipt = await client.waitForTransactionReceipt({ hash: tx });
      console.log('Transaction receipt:', receipt);
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
            {tx && (
              <>
                <Text>
                  <a
                    target="_blank"
                    href={`https://holesky.etherscan.io/tx/${tx}`}
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
