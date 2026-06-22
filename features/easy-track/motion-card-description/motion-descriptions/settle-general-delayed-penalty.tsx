import { settleGeneralDelayedPenaltyAbi } from 'abi/generated/SettleGeneralDelayedPenalty';
import { pluralize } from 'utils/pluralize';
import { MotionDescriptionProps } from '../types';
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
  const { chainId } = useLidoSDK();
  const getFactoryContractReader = useReadContractGetter(
    settleGeneralDelayedPenaltyAbi,
  );

  const isCSM = motionType === MotionType.CSMSettleGeneralDelayedPenalty;

  const { data: stakingModuleAddress } = useQuery({
    queryKey: [`settle-general-delayed-penalty-module`, motionType, chainId],
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
    callData.map(({ nodeOperatorId }) => nodeOperatorId),
  );

  return (
    <>
      Settle delayed penalty for{' '}
      {pluralize(callData.length, isCSM ? 'CSM operator' : 'node operator')}:
      <ul>
        {callData.map(({ nodeOperatorId }, index) => {
          const idStr = nodeOperatorId.toString();
          const name = nodeOperatorNames?.[index];

          return (
            <li key={index}>
              {name ? (
                <>
                  <b>{name}</b> (id: {idStr})
                </>
              ) : (
                <b>#{idStr}</b>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};
