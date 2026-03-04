import styled from 'styled-components';
import { SkeletonText } from 'shared/components/skeleton-text';
import { SkeletonBar } from 'shared/components/skeleton-bar';

export const DescriptionBlock = styled.div`
  margin-bottom: 64px;
`;

export const LabelSkeleton = styled(SkeletonText)`
  margin-bottom: 3px;
`;

export const DescLineSkeleton = styled(SkeletonText)`
  margin-bottom: 6px;
`;

export const InfoLabelSkeleton = styled(SkeletonText)`
  margin-bottom: 4px;
`;

export const ObjectionsLabelSkeleton = styled(SkeletonText)`
  margin-bottom: 6px;
`;

export const ObjectionsSubLabelSkeleton = styled(SkeletonText)`
  margin-bottom: 8px;
`;

export const TimerBarSkeleton = styled(SkeletonBar)`
  width: 140px;
  height: 28px;
  border-radius: 6px;
`;
