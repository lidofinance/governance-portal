import { updateTargetValidatorLimitsV2Abi } from 'abi/generated/UpdateTargetValidatorLimitsV2';
import { MotionDescriptionProps } from '../types';
import { useSDVTNodeOperatorsSummaryMap } from '../../hooks/use-sdvt-node-operators-summary';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';

export const SdvtTargetValidatorLimitsUpdateV2 = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof updateTargetValidatorLimitsV2Abi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  const { data: operatorsSummaryMap } = useSDVTNodeOperatorsSummaryMap();
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        const targetLimitMode = Number(item.targetLimitMode);

        let targetLimitModeDesc = 'disabled';
        if (targetLimitMode == 1) targetLimitModeDesc = 'soft';
        if (targetLimitMode == 2) targetLimitModeDesc = 'boosted exits';

        const nodeOperatorName = nodeOperator ? nodeOperator.name : '';

        if (targetLimitMode == 0) {
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
            {`to ${item.targetLimit} in ${targetLimitModeDesc} mode`}
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
