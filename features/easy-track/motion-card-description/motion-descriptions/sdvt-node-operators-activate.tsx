import { activateNodeOperatorsAbi } from 'abi/generated/ActivateNodeOperators';
import { MotionDescriptionProps } from '../types';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { AddressPopInline } from 'shared/components/address-pop-inline';

export const SdvtNodeOperatorsActivate = ({
  callData,
}: MotionDescriptionProps<typeof activateNodeOperatorsAbi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Activate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and add <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressPopInline address={item.managerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
