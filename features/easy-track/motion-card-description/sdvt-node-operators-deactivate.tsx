import { DeactivateNodeOperatorsAbi } from 'generated';
import { NestProps } from './types';
import { AddressInlineWithPop } from 'shared/components/address-pop';
import { useNodeOperatorsList } from '../hooks/use-node-operators-list';

export const SdvtNodeOperatorsDeactivate = ({
  callData,
}: NestProps<DeactivateNodeOperatorsAbi['decodeEVMScriptCallData']>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber();
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Deactivate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and revoke <b>MANAGE_SIGNING_KEYS</b> role from{' '}
            <AddressInlineWithPop address={item.managerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
