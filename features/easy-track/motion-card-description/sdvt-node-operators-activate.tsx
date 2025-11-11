import { ActivateNodeOperatorsAbi } from 'generated';
import { NestProps } from './types';
import { AddressInlineWithPop } from 'shared/components/address-pop';
import { useNodeOperatorsList } from '../hooks/use-node-operators-list';

export const SdvtNodeOperatorsActivate = ({
  callData,
}: NestProps<ActivateNodeOperatorsAbi['decodeEVMScriptCallData']>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = item.nodeOperatorId.toNumber();
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Activate Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            ) and add <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressInlineWithPop address={item.managerAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
