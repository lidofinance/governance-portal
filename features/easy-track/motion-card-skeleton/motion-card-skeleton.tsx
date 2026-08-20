import { CardStatusWrapper } from '../motion-card/style';
import { SkeletonText } from 'shared/components/skeleton-text';
import { Box } from 'shared/components/box';
import {
  ActionBarSkeleton,
  DescSkeleton,
  StatusLabelSkeleton,
  StatusValueSkeleton,
  TailingSkeleton,
  TitleSkeleton,
} from './style';
import { MotionDashboardCard } from '@easy-track/style';
import { MotionDisplayStatus } from '@easy-track/types';

export const MotionCardSkeleton = () => {
  return (
    <MotionDashboardCard>
      <TitleSkeleton width="70%" size={14} />
      <DescSkeleton width="100%" size={12} />
      <TailingSkeleton width="55%" size={12} />
      <CardStatusWrapper $displayStatus={MotionDisplayStatus.DEFAULT}>
        <StatusLabelSkeleton width={50} size={12} />
        <StatusValueSkeleton width={110} size={26} />
      </CardStatusWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap={4}>
          <SkeletonText width={60} size={10} />
          <SkeletonText width={36} size={10} />
        </Box>
        <ActionBarSkeleton />
      </Box>
    </MotionDashboardCard>
  );
};
