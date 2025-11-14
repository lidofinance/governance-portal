import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { MotionDescriptionProps } from '../types';
import { getNodeOperatorRegistryType } from '../../utils/get-node-operator-registry-type';
import { evmIncreaseNodeOperatorStakingLimitAbi } from 'abi/generated/EvmIncreaseNodeOperatorStakingLimit';
import { IncreaseLimitMotionType } from '../../constants';

export const DescNodeOperatorIncreaseLimit = ({
  callData,
  motionType,
}: MotionDescriptionProps<typeof evmIncreaseNodeOperatorStakingLimitAbi> & {
  motionType: IncreaseLimitMotionType;
}) => {
  const nodeOperatorId = Number(callData[0]);
  const registryType = getNodeOperatorRegistryType(motionType);
  const { data: nodeOperators } = useNodeOperatorsList(registryType);
  const nodeOperatorName = nodeOperators?.[nodeOperatorId]?.name ?? '';

  return (
    <div>
      Node operator <b>{nodeOperatorName}</b> (id: {nodeOperatorId}) wants to
      increase staking limit to {Number(callData[1])}
    </div>
  );
};
