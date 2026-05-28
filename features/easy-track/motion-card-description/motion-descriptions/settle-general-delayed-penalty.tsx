import { settleGeneralDelayedPenaltyAbi } from 'abi/generated/SettleGeneralDelayedPenalty';
import { pluralize } from 'utils/pluralize';
import { MotionDescriptionProps } from '../types';
import { formatEth } from 'shared/blockchain/utils';

export const SettleGeneralDelayedPenalty = ({
  callData,
}: MotionDescriptionProps<typeof settleGeneralDelayedPenaltyAbi>) => {
  const [nodeOperatorIds, maxAmounts] = callData;

  return (
    <>
      Settle General Delayed Penalty for the following{' '}
      {pluralize(nodeOperatorIds.length, 'operator')}:
      {nodeOperatorIds.map((id, index) => {
        const nodeOperatorId = Number(id);
        const maxAmount = maxAmounts[index];

        return (
          <div key={index}>
            Node operator #{nodeOperatorId} — max {formatEth(maxAmount)} stETH
          </div>
        );
      })}
    </>
  );
};
