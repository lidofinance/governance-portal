import { useMemo } from 'react';
import {
  useRewardProgramsAll,
  useRewardProgramsMapAll,
} from '../../hooks/use-reward-programs';

import { formatEther } from 'viem';
import { evmAddRewardProgramAbi } from 'abi/generated/EvmAddRewardProgram';
import { evmRemoveRewardProgramAbi } from 'abi/generated/EvmRemoveRewardProgram';
import { evmTopUpRewardProgramsAbi } from 'abi/generated/EvmTopUpRewardPrograms';
import { MotionDescriptionProps } from '../types';
import { useGovernanceToken } from 'shared/hooks/use-governance-token';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const RewardProgramAdd = ({
  callData,
}: MotionDescriptionProps<typeof evmAddRewardProgramAbi>) => {
  return (
    <div>
      Add reward program <b>&#34;{callData[1]}&#34;</b> with address{' '}
      <AddressPopInline address={callData[0]} />
    </div>
  );
};

export const RewardProgramTopUp = ({
  callData,
}: MotionDescriptionProps<typeof evmTopUpRewardProgramsAbi>) => {
  const { data: governanceToken } = useGovernanceToken();
  const { data: rewardProgramsMap } = useRewardProgramsMapAll();

  const programs = useMemo(() => {
    if (!rewardProgramsMap) return null;
    return callData[0].map((address) => rewardProgramsMap[address]);
  }, [callData, rewardProgramsMap]);

  return (
    <div>
      Top up reward programs:
      {callData[0].map((address, i) => (
        <div key={i}>
          <b>{programs?.[i]}</b> <AddressPopInline address={address} /> with{' '}
          {Number(formatEther(callData[1][i])).toLocaleString('en-EN')}{' '}
          {governanceToken?.symbol}
        </div>
      ))}
    </div>
  );
};

export const RewardProgramRemove = ({
  callData,
}: MotionDescriptionProps<typeof evmRemoveRewardProgramAbi>) => {
  const { data: rewardPrograms } = useRewardProgramsAll();

  const program = useMemo(() => {
    if (!rewardPrograms) return null;
    return rewardPrograms.find((p) => p.address === callData);
  }, [callData, rewardPrograms]);

  return (
    <div>
      Remove reward program <b>{program?.title}</b> with address{' '}
      <AddressPopInline address={callData} />
    </div>
  );
};
