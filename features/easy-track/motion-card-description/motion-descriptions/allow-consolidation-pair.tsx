import { useQuery } from '@tanstack/react-query';
import { allowConsolidationPairAbi } from 'abi/generated';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import {
  AllowConsolidationPair as AllowConsolidationPairContract,
  StakingRouter,
} from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { MotionDescriptionProps } from '../types';
import { useNodeOperatorNames } from '@easy-track/hooks/use-node-operator-names';

export const AllowConsolidationPair = ({
  callData,
}: MotionDescriptionProps<typeof allowConsolidationPairAbi>) => {
  const { submitter, sourceOperatorId, targetOperatorIds } = callData;

  const { chainId } = useLidoSDK();
  const factoryContract = useReadContract(AllowConsolidationPairContract);
  const stakingRouter = useReadContract(StakingRouter);

  const { data: modulesData, isLoading: isModulesDataLoading } = useQuery({
    queryKey: [
      'allow-consolidation-pair-modules',
      chainId,
      factoryContract.address,
    ],
    enabled: !!factoryContract.address,
    staleTime: Infinity,
    queryFn: async () => {
      const [targetModuleId, sourceModuleId] = await Promise.all([
        factoryContract.readContract('targetModuleId'),
        factoryContract.readContract('sourceModuleId'),
      ]);

      const [targetModule, sourceModule] = await Promise.all([
        stakingRouter.readContract('getStakingModule', [targetModuleId]),
        stakingRouter.readContract('getStakingModule', [sourceModuleId]),
      ]);

      return {
        targetModuleAddress: targetModule.stakingModuleAddress,
        targetModuleName: targetModule.name,
        targetModuleId: targetModuleId.toString(),
        sourceModuleAddress: sourceModule.stakingModuleAddress,
        sourceModuleName: sourceModule.name,
        sourceModuleId: sourceModuleId.toString(),
      };
    },
  });

  const {
    data: sourceModuleOperatorsNames,
    isLoading: isSourceNamesDataLoading,
  } = useNodeOperatorNames(modulesData?.sourceModuleAddress, [
    sourceOperatorId,
  ]);

  const {
    data: targetModuleOperatorsNames,
    isLoading: isTargetNamesDataLoading,
  } = useNodeOperatorNames(modulesData?.targetModuleAddress, targetOperatorIds);

  const sourceOperatorName = sourceModuleOperatorsNames?.[0];
  const sourceIdStr = sourceOperatorId.toString();

  const sourceModuleNameEl = modulesData?.sourceModuleName ? (
    <>
      from <b>{modulesData.sourceModuleName}</b> (id:{' '}
      {modulesData.sourceModuleId}) module
    </>
  ) : (
    ''
  );

  const targetModuleNameEl = modulesData?.targetModuleName ? (
    <>
      from module <b>{modulesData.targetModuleName}</b> (id:{' '}
      {modulesData.targetModuleId})
    </>
  ) : (
    ''
  );

  if (
    isModulesDataLoading ||
    isSourceNamesDataLoading ||
    isTargetNamesDataLoading
  ) {
    return <>Loading...</>;
  }

  return (
    <>
      Node operator{' '}
      {sourceOperatorName ? (
        <>
          <b>{sourceOperatorName}</b> (id: {sourceIdStr})
        </>
      ) : (
        <b>#{sourceIdStr}</b>
      )}{' '}
      {sourceModuleNameEl} and:
      <ul>
        {targetOperatorIds.map((targetId, index) => {
          const idStr = targetId.toString();
          const name = targetModuleOperatorsNames?.[index];

          const nameEl = name ? (
            <>
              <b>{name}</b> (id: {idStr})
            </>
          ) : (
            <b>#{idStr}</b>
          );

          return (
            <li key={index}>
              sub-operator {nameEl} {targetModuleNameEl} with consolidation
              manager <AddressPopInline address={submitter} />;
            </li>
          );
        })}
      </ul>
    </>
  );
};
