import { evmReportWithdrawalsForSlashedValidatorsAbi } from 'abi/generated/EvmReportWithdrawalsForSlashedValidators';
import { pluralize } from 'utils/pluralize';
import { MotionDescriptionProps } from '../types';
import { formatEth } from 'shared/blockchain/utils';

export const ReportWithdrawalsForSlashedValidators = ({
  callData,
}: MotionDescriptionProps<
  typeof evmReportWithdrawalsForSlashedValidatorsAbi
>) => {
  return (
    <>
      Report withdrawals for the following slashed{' '}
      {pluralize(callData.length, 'validator')}:
      <ul>
        {callData.map((info, index) => {
          const nodeOperatorId = Number(info.nodeOperatorId);
          const keyIndex = Number(info.keyIndex);

          return (
            <li key={index}>
              Node operator #{nodeOperatorId}, key index {keyIndex}, exit
              balance {formatEth(info.exitBalance)}, slashing penalty{' '}
              {formatEth(info.slashingPenalty)}
            </li>
          );
        })}
      </ul>
    </>
  );
};
