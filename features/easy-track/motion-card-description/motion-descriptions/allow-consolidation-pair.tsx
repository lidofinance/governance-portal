import { useQuery } from '@tanstack/react-query';
import { Address, zeroAddress } from 'viem';
import { allowConsolidationPairAbi } from 'abi/generated';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import {
  AllowConsolidationPair as AllowConsolidationPairContract,
  ConsolidationMigrator,
} from 'shared/blockchain/contracts';
import { useLidoSDK } from 'providers/lido-sdk';
import { MotionDescriptionProps } from '../types';

type PairState = {
  isAllowed: boolean;
  currentSubmitter: Address;
};

export const AllowConsolidationPair = ({
  callData,
  isOnChain,
}: MotionDescriptionProps<typeof allowConsolidationPairAbi>) => {
  const { submitter, sourceOperatorId, targetOperatorIds } = callData;
  const sourceId = Number(sourceOperatorId);

  const { chainId } = useLidoSDK();
  const factoryContract = useReadContract(AllowConsolidationPairContract);
  const consolidationMigrator = useReadContract(ConsolidationMigrator);

  const { data: pairStates } = useQuery<PairState[]>({
    queryKey: [
      'allow-consolidation-pair-states',
      chainId,
      sourceOperatorId.toString(),
      targetOperatorIds.map((id) => id.toString()).join(','),
    ],
    enabled: !!isOnChain && !!factoryContract.address,
    queryFn: async () => {
      const submitters = await Promise.all(
        targetOperatorIds.map((targetId) =>
          consolidationMigrator.readContract('getSubmitter', [
            sourceOperatorId,
            targetId,
          ]),
        ),
      );

      return submitters.map((currentSubmitter) => ({
        isAllowed: !!currentSubmitter && currentSubmitter !== zeroAddress,
        currentSubmitter: currentSubmitter ?? zeroAddress,
      }));
    },
  });

  return (
    <>
      For source node operator <b>#{sourceId}</b>:
      <ul>
        {targetOperatorIds.map((id, index) => {
          const targetId = Number(id);
          const state = pairStates?.[index];

          if (state?.isAllowed) {
            return (
              <li key={index}>
                Update consolidation manager for target sub-operator{' '}
                <b>#{targetId}</b> from{' '}
                <AddressPopInline address={state.currentSubmitter} /> to{' '}
                <AddressPopInline address={submitter} />
              </li>
            );
          }

          return (
            <li key={index}>
              Allow consolidation to target sub-operator <b>#{targetId}</b> with
              consolidation manager <AddressPopInline address={submitter} />
            </li>
          );
        })}
      </ul>
    </>
  );
};
