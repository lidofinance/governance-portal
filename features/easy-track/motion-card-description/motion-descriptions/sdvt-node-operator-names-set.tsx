import { setNodeOperatorNamesAbi } from 'abi/generated/SetNodeOperatorNames';
import { MotionDescriptionProps } from '../types';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';

export const SdvtNodeOperatorNamesSet = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof setNodeOperatorNamesAbi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Change Node Operator{' '}
            <b>{nodeOperator && isOnChain ? nodeOperator.name : ''}</b> (id:{' '}
            {nodeOperatorId}) name to <b>{item.name}</b>
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
