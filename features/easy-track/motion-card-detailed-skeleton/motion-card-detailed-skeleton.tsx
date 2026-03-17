import {
  Header,
  HeaderAside,
  InfoCell,
  InfoCol,
  InfoRow,
  MotionCard,
  MotionContainer,
  StartDateCell,
} from '../motion-card-detailed/style';
import { SkeletonText } from 'shared/components/skeleton-text';
import {
  DescriptionBlock,
  DescLineSkeleton,
  InfoLabelSkeleton,
  LabelSkeleton,
  ObjectionsLabelSkeleton,
  ObjectionsSubLabelSkeleton,
  TimerBarSkeleton,
} from './style';
import { BackButton } from 'shared/components/back-button';
import { EASY_TRACK__MOTIONS_PATH } from 'constants/urls';

export const MotionCardDetailedSkeleton = () => {
  return (
    <MotionContainer>
      <BackButton href={EASY_TRACK__MOTIONS_PATH} label="motions" />
      <MotionCard>
        {/* Header */}
        <Header>
          <div>
            <LabelSkeleton width={80} size={14} />
            <SkeletonText width={200} size={14} />
          </div>
          <HeaderAside>
            <div>
              <LabelSkeleton width={40} size={12} />
              <SkeletonText width={70} size={14} />
            </div>
          </HeaderAside>
        </Header>

        {/* Description */}
        <DescriptionBlock>
          <DescLineSkeleton width="100%" size={12} />
          <DescLineSkeleton width="90%" size={12} />
          <DescLineSkeleton width="75%" size={12} />
          <SkeletonText width="55%" size={12} />
        </DescriptionBlock>

        {/* InfoRow */}
        <InfoRow>
          <InfoCol>
            <div>
              <InfoLabelSkeleton width={60} size={12} />
              <SkeletonText width={120} size={36} />
            </div>
            <StartDateCell>
              <InfoLabelSkeleton width={70} size={12} />
              <SkeletonText width={130} size={14} />
            </StartDateCell>
          </InfoCol>
          <InfoCol>
            <InfoCell>
              <ObjectionsLabelSkeleton width={80} size={12} />
              <ObjectionsSubLabelSkeleton width={90} size={12} />
              <SkeletonText width={100} size={36} />
            </InfoCell>
            <div>
              <InfoLabelSkeleton width={90} size={12} />
              <TimerBarSkeleton />
            </div>
          </InfoCol>
        </InfoRow>
      </MotionCard>
    </MotionContainer>
  );
};
