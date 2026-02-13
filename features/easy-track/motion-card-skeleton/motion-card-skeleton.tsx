import { Card, CardStatusWrapper } from '../motion-card/style';
import { SkeletonBar } from '../../vote/components/skeleton-bar';
import { SkeletonText } from '../../vote/components/skeleton-text';
import { Box } from 'shared/components/box';

export const MotionCardSkeleton = () => {
  return (
    <Card>
      <SkeletonText width="70%" size={14} style={{ marginBottom: 8 }} />
      <SkeletonText width="100%" size={12} style={{ marginBottom: 6 }} />
      <SkeletonText
        width="55%"
        size={12}
        style={{ marginBottom: 'auto' as const }}
      />
      <CardStatusWrapper>
        <SkeletonText width={50} size={10} style={{ marginTop: 12 }} />
        <SkeletonText width={110} size={26} style={{ margin: '4px 0 12px' }} />
      </CardStatusWrapper>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" flexDirection="column" gap={4}>
          <SkeletonText width={60} size={10} />
          <SkeletonText width={36} size={10} />
        </Box>
        <SkeletonBar style={{ width: 90, height: 32, borderRadius: 24 }} />
      </Box>
    </Card>
  );
};
