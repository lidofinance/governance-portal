import { SkeletonBar } from 'shared/components/skeleton-bar';
import { Layout, MainCard, SideCard } from '@vote/components/vote-card/style';
import { Column } from './style';

export const VoteCardSkeleton = () => {
  return (
    <Layout>
      <MainCard>
        <Column>
          <SkeletonBar width="40%" style={{ height: 24 }} />
          <SkeletonBar width="70%" style={{ height: 32 }} />
          <SkeletonBar width="100%" style={{ height: 16 }} />
          <SkeletonBar width="100%" style={{ height: 16 }} />
          <SkeletonBar width="85%" style={{ height: 16 }} />
          <SkeletonBar width="100%" style={{ height: 220 }} />
        </Column>
      </MainCard>
      <SideCard>
        <Column>
          <SkeletonBar width="100%" style={{ height: 120 }} />
          <SkeletonBar width="100%" style={{ height: 88 }} />
          <SkeletonBar width="100%" style={{ height: 160 }} />
          <SkeletonBar width="100%" style={{ height: 44 }} />
        </Column>
      </SideCard>
    </Layout>
  );
};
