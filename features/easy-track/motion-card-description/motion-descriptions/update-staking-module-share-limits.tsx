import { useQuery } from '@tanstack/react-query';
import {
  evmUpdateStakingModuleShareLimitsAbi,
  stakingRouterAbi,
} from 'abi/generated';
import {
  useReadContract,
  useReadContractGetter,
} from 'shared/blockchain/hooks/use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';
import { UpdateStakingModuleShareLimits as UpdateStakingModuleShareLimitsContract } from 'shared/blockchain/contracts';
import { MotionDescriptionProps } from '../types';
import { formatBp } from '@easy-track/vaults/utils/format-vault-param';

export const UpdateStakingModuleShareLimits = ({
  callData,
}: MotionDescriptionProps<typeof evmUpdateStakingModuleShareLimitsAbi>) => {
  const {
    currentStakeShareLimit,
    newStakeShareLimit,
    currentPriorityExitShareThreshold,
    newPriorityExitShareThreshold,
  } = callData;

  const { chainId } = useLidoSDK();
  const factoryContract = useReadContract(
    UpdateStakingModuleShareLimitsContract,
  );
  const readStakingRouter = useReadContractGetter(stakingRouterAbi);

  const { data: moduleInfo, isLoading } = useQuery({
    queryKey: [
      'update-staking-module-share-limits-module-info',
      chainId,
      factoryContract.address,
    ],
    staleTime: Infinity,
    queryFn: async () => {
      const [stakingRouterAddress, stakingModuleId] = await Promise.all([
        factoryContract.readContract('stakingRouter'),
        factoryContract.readContract('stakingModuleId'),
      ]);

      const stakingModule = await readStakingRouter(stakingRouterAddress)(
        'getStakingModule',
        [stakingModuleId],
      );

      return {
        stakingModuleId: stakingModuleId.toString(),
        name: stakingModule.name,
      };
    },
  });

  if (isLoading || !moduleInfo) {
    return <>Loading...</>;
  }

  return (
    <>
      For{' '}
      <b>
        {moduleInfo.name} (id: {moduleInfo.stakingModuleId})
      </b>{' '}
      module:
      <ul>
        {currentStakeShareLimit !== newStakeShareLimit && (
          <li>
            {currentStakeShareLimit > newStakeShareLimit
              ? 'Decrease '
              : 'Increase '}
            stake share limit from <b>{formatBp(currentStakeShareLimit)}</b> to{' '}
            <b>{formatBp(newStakeShareLimit)}</b>
          </li>
        )}
        {currentPriorityExitShareThreshold !==
          newPriorityExitShareThreshold && (
          <li>
            {currentPriorityExitShareThreshold > newPriorityExitShareThreshold
              ? 'Decrease '
              : 'Increase '}
            priority exit share threshold from{' '}
            <b>{formatBp(currentPriorityExitShareThreshold)}</b> to{' '}
            <b>{formatBp(newPriorityExitShareThreshold)}</b>
          </li>
        )}
      </ul>
    </>
  );
};
