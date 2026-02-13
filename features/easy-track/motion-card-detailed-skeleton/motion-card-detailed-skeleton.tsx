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
import { SkeletonBar } from '../../vote/components/skeleton-bar';
import { SkeletonText } from '../../vote/components/skeleton-text';

export const MotionCardDetailedSkeleton = () => {
  return (
    <MotionContainer>
      <MotionCard>
        {/* Header */}
        <Header>
          <div>
            <SkeletonText width={80} size={14} style={{ marginBottom: 3 }} />
            <SkeletonText width={200} size={14} />
          </div>
          <HeaderAside>
            <div>
              <SkeletonText width={40} size={12} style={{ marginBottom: 3 }} />
              <SkeletonText width={70} size={14} />
            </div>
          </HeaderAside>
        </Header>

        {/* Description */}
        <div style={{ marginBottom: 64 }}>
          <SkeletonText width="100%" size={12} style={{ marginBottom: 6 }} />
          <SkeletonText width="90%" size={12} style={{ marginBottom: 6 }} />
          <SkeletonText width="75%" size={12} style={{ marginBottom: 6 }} />
          <SkeletonText width="55%" size={12} />
        </div>

        {/* InfoRow */}
        <InfoRow>
          <InfoCol>
            <div>
              <SkeletonText width={60} size={12} style={{ marginBottom: 4 }} />
              <SkeletonText width={120} size={36} />
            </div>
            <StartDateCell>
              <SkeletonText width={70} size={12} style={{ marginBottom: 4 }} />
              <SkeletonText width={130} size={14} />
            </StartDateCell>
          </InfoCol>
          <InfoCol>
            <InfoCell>
              <SkeletonText width={80} size={12} style={{ marginBottom: 6 }} />
              <SkeletonText width={90} size={12} style={{ marginBottom: 8 }} />
              <SkeletonText width={100} size={36} />
            </InfoCell>
            <div>
              <SkeletonText width={90} size={12} style={{ marginBottom: 4 }} />
              <SkeletonBar
                style={{ width: 140, height: 28, borderRadius: 6 }}
              />
            </div>
          </InfoCol>
        </InfoRow>
      </MotionCard>
    </MotionContainer>
  );
};
