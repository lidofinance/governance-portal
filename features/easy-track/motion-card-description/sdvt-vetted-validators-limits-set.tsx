import { setVettedValidatorsLimitsAbi } from 'abi/generated/SetVettedValidatorsLimits';
import { MotionDescriptionProps } from './types';
import { useNodeOperatorsList } from '../hooks/use-node-operators-list';

export const SdvtVettedValidatorsLimitsSet = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof setVettedValidatorsLimitsAbi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Set Node Operator <b>{nodeOperator ? nodeOperator.name : ''}</b>{' '}
            (id: {nodeOperatorId}) vetted validators limit{' '}
            {nodeOperator && isOnChain
              ? `from ${nodeOperator.totalVettedValidators} `
              : ''}
            {`to ${item.stakingLimit}`}
          </div>
        );
      })}
    </>
  );
};
