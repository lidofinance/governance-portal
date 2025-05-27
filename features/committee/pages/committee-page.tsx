import { useState } from 'react';
import { VerticalTabs } from 'shared/components/vertical-tabs';
import { CommitteeProposalCard } from '../committee-proposal';
import { CommitteeLayout, CommitteeSection, TabsSection } from './style';
import {
  CommitteeHeader,
  CommitteeQuorum,
  CommitteeTitle,
} from '../committee-proposal/proposal-card/style';
import { useDualGovernanceProposalsContext } from 'providers/dual-governance-proposals';

type Committee = {
  id: number;
  label: string;
};

const committeesMock = [
  {
    id: 0,
    label: 'Overview',
  },
  {
    id: 1,
    label: 'NO Committee',
  },
  {
    id: 2,
    label: 'DAO Committee',
  },
  {
    id: 4,
    label: 'ETH Committee',
  },
];

export const CommitteePage = () => {
  const [activeCommittee, setActiveCommittee] = useState<Committee>(
    committeesMock[0],
  );

  const { proposals, isLoading } = useDualGovernanceProposalsContext();

  const handleCommitteeTabChange = (id: number) => {
    const committee = committeesMock.find(
      (committee) => committee.id === id,
    ) as Committee;

    setActiveCommittee(committee);
  };

  return (
    <CommitteeLayout>
      <TabsSection>
        <VerticalTabs
          tabs={committeesMock}
          onTabChange={handleCommitteeTabChange}
        />
      </TabsSection>
      <CommitteeSection>
        <CommitteeHeader>
          {activeCommittee.id === 0 && (
            <CommitteeTitle>Tiebreaker Committee</CommitteeTitle>
          )}
          {activeCommittee.id !== 0 && (
            <CommitteeTitle>
              {activeCommittee.label || 'Committee'}
            </CommitteeTitle>
          )}
          {activeCommittee.id !== 0 && <CommitteeQuorum>4/5</CommitteeQuorum>}
        </CommitteeHeader>
        {!isLoading &&
          proposals &&
          proposals
            .slice(0, 4)
            .map((proposal) => (
              <CommitteeProposalCard
                isTiebreaker={activeCommittee.id === 0}
                key={proposal.proposalId}
                proposalId={proposal.proposalId}
              />
            ))}
      </CommitteeSection>
    </CommitteeLayout>
  );
};
