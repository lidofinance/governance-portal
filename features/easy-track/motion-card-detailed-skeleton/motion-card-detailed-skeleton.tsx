import {
  AddressWrap,
  Badges,
  Header,
  HeaderMeta,
  InfoCell,
  InfoCol,
  InfoRow,
  MotionCard,
  MotionContainer,
  StartDateCell,
  StatusWrap,
} from '../motion-card-detailed/style';
import { SkeletonText } from 'shared/components/skeleton-text';
import {
  AddressSkeleton,
  BadgeSkeleton,
  DescriptionBlock,
  DescriptionMetaSkeleton,
  DescLineSkeleton,
  InfoLabelSkeleton,
  ObjectionsLabelSkeleton,
  ObjectionsSubLabelSkeleton,
  ScriptSkeleton,
} from './style';
import { BackButton } from 'shared/components/back-button';
import { EASY_TRACK__MOTIONS_PATH } from 'constants/urls';

export const MotionCardDetailedSkeleton = () => {
  return (
    <MotionContainer>
      <BackButton href={EASY_TRACK__MOTIONS_PATH} label="motions" />
      <MotionCard>
        {/* Header */}
        <HeaderMeta>
          <SkeletonText width={110} size={16} />
          <StatusWrap>
            <SkeletonText width={40} size={12} />
            <SkeletonText width={70} size={12} />
          </StatusWrap>
        </HeaderMeta>
        <Badges>
          <BadgeSkeleton width={110} />
          <BadgeSkeleton width={80} />
        </Badges>
        <Header>
          <SkeletonText width={220} size={20} />
        </Header>

        {/* Description */}
        <DescriptionBlock>
          <DescLineSkeleton width="100%" size={14} />
          <DescLineSkeleton width="90%" size={14} />
          <DescLineSkeleton width="75%" size={14} />
          <DescriptionMetaSkeleton width={180} size={12} />
          <ScriptSkeleton />
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
              <ObjectionsSubLabelSkeleton width={90} size={14} />
              <SkeletonText width={100} size={36} />
            </InfoCell>
            <AddressWrap>
              <InfoLabelSkeleton width={50} size={12} />
              <AddressSkeleton />
            </AddressWrap>
            <AddressWrap>
              <InfoLabelSkeleton width={55} size={12} />
              <AddressSkeleton />
            </AddressWrap>
          </InfoCol>
        </InfoRow>
      </MotionCard>
    </MotionContainer>
  );
};
