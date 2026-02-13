import { deactivateNodeOperatorsAbi } from 'abi/generated/DeactivateNodeOperators';
import { MotionDescriptionProps } from '../types';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { AddressPopInline } from 'shared/components/address-pop-inline';

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
            <AddressPopInline address={item.managerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
