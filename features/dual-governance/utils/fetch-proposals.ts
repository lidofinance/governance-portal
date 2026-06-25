import {
  ProposalCombinedData,
  ProposalDetails,
  SubmitProposalCall,
} from '@dg/proposals/types';
type Props = {
  proposalsCount: bigint;
  EPTContract: any;
};

type ProposalDataResult = [ProposalDetails, SubmitProposalCall[]];

export const fetchProposals = async ({
  proposalsCount,
  EPTContract,
}: Props): Promise<(ProposalCombinedData | null)[]> => {
  const proposalIds = Array.from({ length: Number(proposalsCount) }, (_, i) =>
    BigInt(i + 1),
  );

  const getProposalPromises = proposalIds.map(async (propId) => {
    try {
      const proposalData = (await EPTContract.readContract('getProposal', [
        propId,
      ])) as ProposalDataResult;

      const proposal: ProposalCombinedData = {
        proposalId: Number(propId),
        proposalDetails: {
          ...proposalData[0],
          calls: proposalData[1],
        },
      };

      return proposal;
    } catch (e) {
      console.error(`Failed to fetch proposal ${propId}:`, e);
      return null;
    }
  });

  return Promise.all(getProposalPromises);
};
