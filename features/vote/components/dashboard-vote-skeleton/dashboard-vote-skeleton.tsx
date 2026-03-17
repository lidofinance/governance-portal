import { DashboardCard } from 'shared/components/dashboard-card';
import { Footer } from '../dashboard-vote/style';
import { SkeletonBar } from '../skeleton-bar';
import { SkeletonText } from '../skeleton-text';

export const DashboardVoteSkeleton = () => {
  return (
    <DashboardCard>
      <SkeletonBar style={{ height: 40, marginBottom: 20 }} />
      <SkeletonText width={100} size={14} />
      <Footer>
        <SkeletonText width={60} size={12} style={{ marginBottom: 8 }} />
        <SkeletonBar style={{ height: 6, marginBottom: 8 }} />
        <SkeletonText width={90} size={12} />
      </Footer>
    </DashboardCard>
  );
};
