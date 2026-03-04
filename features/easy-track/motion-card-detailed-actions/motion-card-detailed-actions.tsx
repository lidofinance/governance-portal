import { Text } from 'shared/components/text';

import { Actions, Hint, ButtonStyled } from './style';
import { useAccount } from 'wagmi';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { Motion, MotionStatus, RawMotionSubgraph } from '@easy-track/types';
import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EasyTrack, GovernanceToken } from 'shared/blockchain/contracts';
import { formatEther, Hex } from 'viem';
import { useConnect } from 'reef-knot/core-react';
import { useMotions } from '@easy-track/providers/motion-detailed-context';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  motion: Motion | RawMotionSubgraph;
};

const ActionsBody = ({ motion }: Pick<Props, 'motion'>) => {
  const { address: walletAddress } = useAccount();
  const { chainId } = useLidoSDK();
  const { data: governanceTokenData } = useGovernanceToken();
  const { handleObject, handleEnact, isOverPeriodLimit } = useMotions();

  const governanceTokenContract = useReadContract(GovernanceToken);
  const easyTrackContract = useReadContract(EasyTrack);

  const { data: balanceAt, isLoading: isBalanceDataLoading } = useQuery({
    queryKey: [
      'balanceAt',
      chainId,
      String(motion.snapshotBlock),
      walletAddress,
    ],
    enabled: !!walletAddress,
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error('walletAddress is required');
      }
      return await governanceTokenContract.readContract('balanceOfAt', [
        walletAddress,
        BigInt(motion.snapshotBlock),
      ]);
    },
  });

  const balanceAtFormatted = balanceAt ? formatEther(balanceAt) : null;

  const { data: isObjected, isLoading: isIsObjectedLoading } = useQuery({
    queryKey: ['isObjected', chainId, String(motion.id), walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error('walletAddress is required');
      }
      return await easyTrackContract.readContract('objections', [
        BigInt(motion.id),
        walletAddress,
      ]);
    },
  });

  const { data: canObject, isLoading: isCanObjectLoading } = useQuery({
    queryKey: ['canObject', chainId, String(motion.id), walletAddress],
    enabled: !!walletAddress,
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error('walletAddress is required');
      }
      return await easyTrackContract.readContract('canObjectToMotion', [
        BigInt(motion.id),
        walletAddress,
      ]);
    },
  });

  const isLoadingActions =
    isCanObjectLoading || isIsObjectedLoading || isBalanceDataLoading;

  if (isLoadingActions) {
    return (
      <Text size={10} weight={500}>
        Loading...
      </Text>
    );
  }

  const showHintObjected = Boolean(isObjected);
  const showHintCanObject = !showHintObjected && Boolean(canObject);
  const showHintCanNotObject = !showHintObjected && Boolean(!canObject);

  return (
    <>
      <Hint>
        {showHintObjected && balanceAtFormatted && (
          <>
            You have objected this motion with{' '}
            <b>{String(balanceAtFormatted)}</b> {governanceTokenData?.symbol}
          </>
        )}
        {showHintCanObject && balanceAtFormatted && (
          <>
            You can object this motion with <b>{String(balanceAtFormatted)}</b>{' '}
            {governanceTokenData?.symbol}
          </>
        )}
        {showHintCanNotObject && (
          <>
            You didn&#39;t have {governanceTokenData?.symbol} when the motion
            started to object it
          </>
        )}
      </Hint>

      <Actions>
        <ButtonStyled
          size="sm"
          disabled={!canObject}
          onClick={() => handleObject(BigInt(motion.id))}
        >
          Submit objection
        </ButtonStyled>
        {motion.status === MotionStatus.PENDING && (
          <ButtonStyled
            size="sm"
            variant="outlined"
            onClick={() =>
              handleEnact(BigInt(motion.id), motion.evmScriptCalldata as Hex)
            }
            disabled={isOverPeriodLimit}
          >
            Enact
          </ButtonStyled>
        )}
      </Actions>
    </>
  );
};

const AuthStub = () => {
  const { connect } = useConnect();

  return (
    <>
      <Hint>Connect your wallet to interact with this motion</Hint>
      <Actions>
        <ButtonStyled size="sm" onClick={connect}>
          Connect wallet
        </ButtonStyled>
      </Actions>
    </>
  );
};

export const MotionCardDetailedActions = ({ motion }: Props) => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <AuthStub />;
  }

  return <ActionsBody motion={motion} />;
};
