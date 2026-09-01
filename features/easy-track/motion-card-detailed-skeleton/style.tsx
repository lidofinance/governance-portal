import styled from 'styled-components';
import { SkeletonText } from 'shared/components/skeleton-text';
import { SkeletonBar } from 'shared/components/skeleton-bar';

export const DescriptionBlock = styled.div`
  margin-bottom: 8px;
`;

export const BadgeSkeleton = styled(SkeletonBar)`
  height: 26px;
  border-radius: 20px;
`;

export const DescLineSkeleton = styled(SkeletonText)`
  margin-bottom: 6px;
`;

export const DescriptionMetaSkeleton = styled(SkeletonText)`
  margin: 16px 0 24px;
`;

export const ScriptSkeleton = styled(SkeletonBar)`
  height: 120px;
  border-radius: 8px;
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

export const AddressSkeleton = styled(SkeletonBar)`
  width: 160px;
  height: 24px;
  border-radius: 12px;
`;
