import { useMemo, useState } from 'react';
import { VerticalTabs } from 'shared/components/vertical-tabs';
import { CommitteeLayout, CommitteeSection, TabsSection } from './style';
import {
  CommitteeHeader,
  CommitteeQuorum,
  CommitteeTitle,
} from '../committee-proposal/proposal-card/style';
import { CommitteeProposalCard } from '../committee-proposal';
import { useProposalsCount } from '../../dual-governance/hooks/use-proposals-count';

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
  const { data: proposalsCount, isLoading: isProposalsCountLoading } =
    useProposalsCount();

  const proposalsIds = useMemo(() => {
    if (Number(proposalsCount) === 0) return [] as number[];
    return Array.from(
      { length: Number(proposalsCount) },
      (_, i) => i + 1,
    ).reverse();
  }, [proposalsCount]);

  const [activeCommittee, setActiveCommittee] = useState<Committee>(
    committeesMock[0],
  );

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
        {!isProposalsCountLoading &&
          proposalsIds &&
          proposalsIds
            .slice(0, 4)
            .map((proposalId) => (
              <CommitteeProposalCard
                isTiebreaker={activeCommittee.id === 0}
                key={proposalId}
                proposalId={proposalId}
              />
            ))}
      </CommitteeSection>
    </CommitteeLayout>
  );
};
