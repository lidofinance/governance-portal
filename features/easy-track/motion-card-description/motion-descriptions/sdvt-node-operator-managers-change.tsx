import { changeNodeOperatorManagersAbi } from 'abi/generated/ChangeNodeOperatorManagers';
import { MotionDescriptionProps } from '../types';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { AddressPopInline } from 'shared/components/address-pop-inline';

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
            <AddressPopInline address={item.oldManagerAddress} />, add{' '}
            <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressPopInline address={item.newManagerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
