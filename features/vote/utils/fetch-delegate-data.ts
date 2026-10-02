import { Voting } from 'shared/blockchain/contracts';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { VoterState } from 'shared/votes/types';
import { Address } from 'viem';

const FETCH_BATCH_SIZE = 300;

type DelegateData = {
  delegatedVotersAddresses: Address[];
  delegatedVotersVotingPower: bigint[];
  delegatedVotersVoterState: VoterState[];
  totalDelegatedVotingPower: bigint;
  delegatedVotersCount: number;
};

export const fetchDelegateData = async (
  votingContract: ReturnType<typeof useReadContract<typeof Voting.abi>>,
  delegateAddress: Address,
  voteId?: bigint,
): Promise<DelegateData> => {
  const delegatedVotersCount = await votingContract.readContract(
    'getDelegatedVotersCount',
    [delegateAddress],
  );
  if (delegatedVotersCount === 0n) {
    return {
      delegatedVotersAddresses: [],
      delegatedVotersVotingPower: [],
      delegatedVotersVoterState: [],
      totalDelegatedVotingPower: 0n,
      delegatedVotersCount: 0,
    };
  }

  const batchCount = Math.ceil(Number(delegatedVotersCount) / FETCH_BATCH_SIZE);

  const addressBatches = await Promise.all(
    Array.from({ length: batchCount }, (_, i) =>
      votingContract.readContract('getDelegatedVoters', [
        delegateAddress,
        BigInt(i * FETCH_BATCH_SIZE),
        BigInt(FETCH_BATCH_SIZE),
      ]),
    ),
  );

  if (typeof voteId === 'bigint') {
    const [votingPowerBatches, voterStateBatches] = await Promise.all([
      Promise.all(
        addressBatches.map((batch) =>
          votingContract.readContract('getVotingPowerMultipleAtVote', [
            voteId,
            batch,
          ]),
        ),
      ),
      Promise.all(
        addressBatches.map((batch) =>
          votingContract.readContract('getVoterStateMultipleAtVote', [
            voteId,
            batch,
          ]),
        ),
      ),
    ]);

    const delegatedVotersVotingPower = votingPowerBatches.flat();

    const totalDelegatedVotingPower = delegatedVotersVotingPower.reduce(
      (acc, power) => acc + power,
      0n,
    );

    return {
      delegatedVotersAddresses: addressBatches.flat(),
      delegatedVotersVotingPower,
      delegatedVotersVoterState: voterStateBatches.flat(),
      totalDelegatedVotingPower,
      delegatedVotersCount: Number(delegatedVotersCount),
    };
  } else {
    const delegatedVotersVotingPowerBatches = await Promise.all(
      addressBatches.map((batch) =>
        votingContract.readContract('getVotingPowerMultiple', [batch]),
      ),
    );

    const delegatedVotersVotingPower = delegatedVotersVotingPowerBatches.flat();

    const totalDelegatedVotingPower = delegatedVotersVotingPower.reduce(
      (acc, power) => acc + power,
      0n,
    );

    return {
      delegatedVotersAddresses: addressBatches.flat(),
      delegatedVotersVotingPower,
      delegatedVotersVoterState: [],
      totalDelegatedVotingPower,
      delegatedVotersCount: Number(delegatedVotersCount),
    };
  }
};
