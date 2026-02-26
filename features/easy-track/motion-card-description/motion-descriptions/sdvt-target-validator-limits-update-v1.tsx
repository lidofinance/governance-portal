import { updateTargetValidatorLimitsV1Abi } from 'abi/generated/UpdateTargetValidatorLimitsV1';
import { MotionDescriptionProps } from '../types';
import { useSDVTNodeOperatorsSummaryMap } from '../../hooks/use-sdvt-node-operators-summary';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';

export const SdvtTargetValidatorLimitsUpdateV1 = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof updateTargetValidatorLimitsV1Abi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  const { data: operatorsSummaryMap } = useSDVTNodeOperatorsSummaryMap();
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];

        const nodeOperatorName = nodeOperator ? nodeOperator.name : '';

        if (!item.isTargetLimitActive) {
          return (
            <div key={nodeOperatorId}>
              Disable target validator limit for Node Operator{' '}
              <b>{nodeOperatorName}</b> (id: {nodeOperatorId})
              {index === callData.length - 1 ? '.' : '; '}
            </div>
          );
        }

        return (
          <div key={nodeOperatorId}>
            Set target validator limit for Node Operator{' '}
            <b>{nodeOperatorName}</b> (id: {nodeOperatorId}){' '}
            {nodeOperator && isOnChain
              ? `from ${
                  operatorsSummaryMap?.[nodeOperator.id].targetValidatorsCount
                } `
              : ''}
            {`to ${item.targetLimit}`}
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
