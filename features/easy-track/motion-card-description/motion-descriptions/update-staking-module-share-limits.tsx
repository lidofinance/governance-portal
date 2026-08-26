import { useQuery } from '@tanstack/react-query';
import {
  evmUpdateStakingModuleShareLimitsAbi,
  stakingRouterAbi,
} from 'abi/generated';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { useLidoSDK } from 'providers/lido-sdk';
import { getScriptFactoryByMotionType } from '@easy-track/utils/get-motion-type';
import { MotionDescriptionProps } from '../types';
import { formatBp } from '@easy-track/vaults/utils/format-vault-param';

export const UpdateStakingModuleShareLimits = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof evmUpdateStakingModuleShareLimitsAbi>) => {
  const {
    currentStakeShareLimit,
    newStakeShareLimit,
    currentPriorityExitShareThreshold,
    newPriorityExitShareThreshold,
  } = callData;

  const { chainId } = useLidoSDK();
  const getFactoryContractReader = useReadContractGetter(
    evmUpdateStakingModuleShareLimitsAbi,
  );
  const readStakingRouter = useReadContractGetter(stakingRouterAbi);

  const { data: moduleInfo, isLoading } = useQuery({
    queryKey: [
      'update-staking-module-share-limits-module-info',
      motionType,
      chainId,
    ],
    staleTime: Infinity,
    queryFn: async () => {
      const factoryAddress = getScriptFactoryByMotionType(chainId, motionType);

      if (!factoryAddress) {
        return;
      }

      const readFactory = getFactoryContractReader(factoryAddress);

      const [stakingRouterAddress, stakingModuleId] = await Promise.all([
        readFactory('stakingRouter'),
        readFactory('stakingModuleId'),
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
