import { evmReportWithdrawalsForSlashedValidatorsAbi } from 'abi/generated/EvmReportWithdrawalsForSlashedValidators';
import { MotionDescriptionProps } from '../types';
import { formatEth } from 'shared/blockchain/utils';
import { useLidoSDK } from 'providers/lido-sdk';
import { useReadContractGetter } from 'shared/blockchain/hooks/use-read-contract';
import { useQuery } from '@tanstack/react-query';
import { getScriptFactoryByMotionType } from '@easy-track/utils/get-motion-type';
import { useNodeOperatorNames } from '@easy-track/hooks/use-node-operator-names';
import { MotionType } from '@easy-track/motion-types';

export const ReportWithdrawalsForSlashedValidators = ({
  callData,
  motionType,
}: MotionDescriptionProps<
  typeof evmReportWithdrawalsForSlashedValidatorsAbi
>) => {
  const { chainId } = useLidoSDK();
  const getFactoryContractReader = useReadContractGetter(
    evmReportWithdrawalsForSlashedValidatorsAbi,
  );

  const isCSM =
    motionType === MotionType.CSMReportWithdrawalsForSlashedValidators;

  const { data: stakingModuleAddress } = useQuery({
    queryKey: [`report-withdrawals-for-slashed-validators-module`, chainId],
    enabled: !isCSM,
    queryFn: async () => {
      // CSM operators don't have names, so no need to fetch the module address to get them
      if (isCSM) {
        return;
      }

      const factoryAddress = getScriptFactoryByMotionType(chainId, motionType);

      if (!factoryAddress) {
        return;
      }

      return getFactoryContractReader(factoryAddress)('module');
    },
  });

  const { data: nodeOperatorNames } = useNodeOperatorNames(
    stakingModuleAddress,
    callData.map((info) => info.nodeOperatorId),
  );

  return (
    <ul>
      {callData.map((info, index) => {
        const idStr = info.nodeOperatorId.toString();
        const keyIndex = Number(info.keyIndex);
        const name = nodeOperatorNames?.[index];

        const nameEl = name ? (
          <>
            <b>{name}</b> (id: {idStr})
          </>
        ) : (
          <b>#{idStr}</b>
        );

        return (
          <li key={index}>
            {isCSM ? 'CSM' : 'Node'} operator {nameEl}:
            <ul>
              <li>
                key index <b>{keyIndex}</b>;
              </li>
              <li>
                exit balance <b>{formatEth(info.exitBalance)} ETH</b>;
              </li>
              <li>
                slashing penalty <b>{formatEth(info.slashingPenalty)} ETH</b>.
              </li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
};
