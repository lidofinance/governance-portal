import { addNodeOperatorsAbi } from 'abi/generated/AddNodeOperators';
import { MotionDescriptionProps } from '../types';
import { AddressPop } from 'shared/components/address-pop';

export const SdvtNodeOperatorsAdd = ({
  callData,
}: MotionDescriptionProps<typeof addNodeOperatorsAbi>) => {
  const [nodeOperatorsCount, nodeOperators] = callData;
  return (
    <>
      {nodeOperators.map((nodeOperator, index) => {
        return (
          <div key={nodeOperator.managerAddress}>
            Add Node Operator <b>{nodeOperator.name}</b>(id:{' '}
            {Number(nodeOperatorsCount) + index}){' '}
            <AddressPop address={nodeOperator.rewardAddress} /> and add{' '}
            <b>MANAGE_SIGNING_KEYS</b> role to{' '}
            <AddressPop address={nodeOperator.managerAddress} />
            {index === nodeOperators.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
