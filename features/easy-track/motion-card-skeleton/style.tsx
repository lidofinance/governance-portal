import styled from 'styled-components';
import { SkeletonText } from 'shared/components/skeleton-text';
import { SkeletonBar } from 'shared/components/skeleton-bar';

export const BadgeSkeleton = styled(SkeletonBar)`
  height: 26px;
  border-radius: 20px;
`;

export const TitleSkeleton = styled(SkeletonText)`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const DescSkeleton = styled(SkeletonText)`
  margin-bottom: 6px;
`;
