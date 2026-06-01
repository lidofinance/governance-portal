import { settleGeneralDelayedPenaltyAbi } from 'abi/generated/SettleGeneralDelayedPenalty';
import { MotionDescriptionProps } from '../types';
import { formatEth } from 'shared/blockchain/utils';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { getScriptFactoryByMotionType } from '@easy-track/utils/get-motion-type';
import { useNodeOperatorNames } from '@easy-track/hooks/use-node-operator-names';
import { MotionType } from '@easy-track/motion-types';

export const SettleGeneralDelayedPenalty = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof settleGeneralDelayedPenaltyAbi>) => {
  const [nodeOperatorIds, maxAmounts] = callData;
  const { chainId } = useLidoSDK();
  const getFactoryContractReader = useReadContractGetter(
    settleGeneralDelayedPenaltyAbi,
  );

  const isCSM = motionType === MotionType.CSMSettleGeneralDelayedPenalty;

  const { data: stakingModuleAddress } = useQuery({
    queryKey: [`settle-general-delayed-penalty-module`, chainId],
    enabled: !isCSM,
    queryFn: async () => {
      // CSM operators don't have names, so no need to fetch the module address to get them
      if (isCSM) {
        return;
      }

      const factoryAddress = getScriptFactoryByMotionType(chainId, motionType);

      if (!factoryAddress) {
        return;
      }

      return getFactoryContractReader(factoryAddress)('module');
    },
  });

  const { data: nodeOperatorNames } = useNodeOperatorNames(
    stakingModuleAddress,
    nodeOperatorIds,
  );

  return (
    <ul>
      {nodeOperatorIds.map((id, index) => {
        const idStr = id.toString();
        const maxAmount = maxAmounts[index];
        const name = nodeOperatorNames?.[index];

        const nameEl = name ? (
          <>
            <b>{name}</b> (id: {idStr})
          </>
        ) : (
          <b>#{idStr}</b>
        );

        return (
          <li key={index}>
            {isCSM ? 'CSM' : 'Node'} operator {nameEl}: max amount{' '}
            <b>{formatEth(maxAmount)} stETH</b>;
          </li>
        );
      })}
    </ul>
  );
};
