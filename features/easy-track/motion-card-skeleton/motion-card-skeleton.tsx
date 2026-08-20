import { CardFooter, CardStatusWrapper } from '../motion-card/style';
import { SkeletonText } from 'shared/components/skeleton-text';
import { Box } from 'shared/components/box';
import { BadgeSkeleton, DescSkeleton, TitleSkeleton } from './style';
import { MotionCardBadges, MotionDashboardCard } from '@easy-track/style';
import { MotionDisplayStatus } from '@easy-track/types';

export const MotionCardSkeleton = () => {
  return (
    <MotionDashboardCard>
      <MotionCardBadges>
        <BadgeSkeleton width={110} />
        <BadgeSkeleton width={80} />
      </MotionCardBadges>
      <TitleSkeleton width="70%" size={16} />
      <DescSkeleton width="100%" size={14} />
      <DescSkeleton width="100%" size={14} />
      <DescSkeleton width="55%" size={14} />
      <CardFooter>
        <CardStatusWrapper $displayStatus={MotionDisplayStatus.DEFAULT}>
          <SkeletonText width={50} size={12} />
          <SkeletonText width={110} size={26} />
        </CardStatusWrapper>
        <Box display="flex" alignItems="center" gap={4}>
          <SkeletonText width={70} size={12} />
          <SkeletonText width={30} size={12} />
        </Box>
      </CardFooter>
    </MotionDashboardCard>
  );
};
