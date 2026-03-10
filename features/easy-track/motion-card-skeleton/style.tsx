import styled from 'styled-components';
import { SkeletonText } from 'shared/components/skeleton-text';
import { SkeletonBar } from 'shared/components/skeleton-bar';

export const TitleSkeleton = styled(SkeletonText)`
  margin-bottom: 8px;
`;

export const DescSkeleton = styled(SkeletonText)`
  margin-bottom: 6px;
`;

export const TailingSkeleton = styled(SkeletonText)`
  margin-bottom: auto;
`;

export const StatusLabelSkeleton = styled(SkeletonText)`
  margin-top: 12px;
`;

export const StatusValueSkeleton = styled(SkeletonText)`
  margin: 4px 0 12px;
`;

export const ActionBarSkeleton = styled(SkeletonBar)`
  width: 90px;
  height: 32px;
  border-radius: 24px;
`;
