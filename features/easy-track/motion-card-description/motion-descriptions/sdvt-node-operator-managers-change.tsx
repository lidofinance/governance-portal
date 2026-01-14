import { changeNodeOperatorManagersAbi } from 'abi/generated/ChangeNodeOperatorManagers';
import { MotionDescriptionProps } from '../types';
import { AddressPop } from 'shared/components/address-pop';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';

export const SdvtNodeOperatorManagersChange = ({
  callData,
}: MotionDescriptionProps<typeof changeNodeOperatorManagersAbi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Update Node Operator <b>{nodeOperator ? nodeOperator.name : ''}</b>{' '}
            (id: {nodeOperatorId}): revoke <b>MANAGE_SIGNING_KEYS</b> role from{' '}
            <AddressPop address={item.oldManagerAddress} />, add{' '}
            <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressPop address={item.newManagerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
