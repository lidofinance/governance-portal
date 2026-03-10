import { setNodeOperatorRewardAddressesAbi } from 'abi/generated/SetNodeOperatorRewardAddresses';
import { MotionDescriptionProps } from '../types';
import { useNodeOperatorsList } from '../../hooks/use-node-operators-list';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { Address } from 'viem';

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
                from{' '}
                <AddressPopInline
                  address={nodeOperator.rewardAddress as Address}
                />
              </>
            ) : null}{' '}
            to <AddressPopInline address={item.rewardAddress} />
            {index === callData.length - 1 ? '.' : '; '}
          </div>
        );
      })}
    </>
  );
};
