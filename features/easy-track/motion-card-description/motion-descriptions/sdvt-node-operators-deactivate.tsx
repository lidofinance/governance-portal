import { deactivateNodeOperatorsAbi } from 'abi/generated/DeactivateNodeOperators';
import { MotionDescriptionProps } from '../types';
import { AddressPop } from 'shared/components/address-pop';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';

export const SdvtNodeOperatorsDeactivate = ({
  callData,
}: MotionDescriptionProps<typeof deactivateNodeOperatorsAbi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Deactivate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and revoke <b>MANAGE_SIGNING_KEYS</b> role from{' '}
            <AddressPop address={item.managerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
