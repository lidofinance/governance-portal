import { setNodeOperatorRewardAddressesAbi } from 'abi/generated/SetNodeOperatorRewardAddresses';
import { MotionDescriptionProps } from './types';
import { AddressPop } from 'shared/components/address-pop';
import { useNodeOperatorsList } from '../hooks/use-node-operators-list';

export const SdvtNodeOperatorRewardAddressesSet = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof setNodeOperatorRewardAddressesAbi>) => {
  const { data: nodeOperatorsList } = useNodeOperatorsList('sdvt');
  return (
    <>
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item.nodeOperatorId);
        const nodeOperator = nodeOperatorsList?.[nodeOperatorId];
        return (
          <div key={nodeOperatorId}>
            Change reward address of Node Operator{' '}
            <b>{nodeOperator ? nodeOperator.name : ''}</b> (id: {nodeOperatorId}
            )
            {nodeOperator?.rewardAddress && isOnChain ? (
              <>
                {' '}
                from <AddressPop address={nodeOperator.rewardAddress} />
              </>
            ) : null}{' '}
            to <AddressPop address={item.rewardAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
