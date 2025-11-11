import { csmSettleElStealingPenaltyAbi } from 'abi/generated/CSMSettleElStealingPenalty';
import { pluralize } from 'utils/pluralize';
import { MotionDescriptionProps } from './types';

export const CsmSettleElStealingPenalty = ({
  callData,
}: MotionDescriptionProps<typeof csmSettleElStealingPenaltyAbi>) => {
  return (
    <>
      Settle (confirm) EL Rewards Stealing penalty for the following CSM{' '}
      {pluralize(callData.length, 'operator')}:
      {callData.map((item, index) => {
        const nodeOperatorId = Number(item);

        return <div key={index}>NO #{nodeOperatorId}</div>;
      })}
    </>
  );
};
