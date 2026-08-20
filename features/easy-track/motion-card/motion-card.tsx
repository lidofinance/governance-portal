import { CardFooter, CardStatusWrapper, CardTitle, DescWrapper } from './style';
import { Motion } from '../types';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useLidoSDK } from 'providers/lido-sdk';
import { getMotionTypeByScriptFactory } from '../utils/get-motion-type';
import {
  getIsMotionArchived,
  getMotionDisplayStatus,
  getMotionStatus,
} from '../utils/get-motion-status';
import { Text } from 'shared/components/text';
import { FormattedDate } from 'shared/components/formatted-date';
import { useMotionTimeCountdown } from '../hooks/use-motion-time-countdown';
import { useMotionProgress } from '../hooks/use-motion-progress';
import { MOTION_ATTENTION_PERIOD } from '../constants';
import { MotionDescription } from '../motion-card-description';
import { Box } from 'shared/components/box';
import { motionPage } from 'constants/urls';
import Link from 'next/link';
import { MotionCardBadges, MotionDashboardCard } from '@easy-track/style';
import { Badge } from 'shared/components/badge';
import { getMotionCategoryTags } from '@easy-track/utils/get-motion-category-tags';

type Props = {
  motion: Motion;
};

export const MotionCard = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();

  const motionStatus = getMotionStatus(motion);

  const progress = useMotionProgress(motion);

  const isArchived = getIsMotionArchived(motion);

  const timeData = useMotionTimeCountdown(motion);
  const { isPassed, diffFormatted } = timeData;

  const isAttentionTime =
    timeData.diff <= Number(motion.duration) * MOTION_ATTENTION_PERIOD;

  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  });

  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  );

  const motionTags = getMotionCategoryTags(motionType);

  return (
    <Link passHref href={motionPage(motion.id.toString())}>
      <MotionDashboardCard>
        <MotionCardBadges>
          {motionTags.map((tag, index) => (
            <Badge
              key={index}
              variant={tag.variant}
              type={tag.isSubCategory ? 'secondary' : 'primary'}
            >
              {tag.text}
            </Badge>
          ))}
        </MotionCardBadges>
        <CardTitle>
          #{motion.id.toString()} {getMotionTypeDisplayName(motionType)}
        </CardTitle>
        <DescWrapper>
          <MotionDescription motion={motion} />
        </DescWrapper>
        <CardFooter>
          <CardStatusWrapper $displayStatus={displayStatus}>
            <Text size={12} weight={800}>
              {motionStatus}
            </Text>
            <Text size={26} weight={600}>
              {isArchived ? (
                <FormattedDate
                  format="MMM DD, YYYY"
                  date={
                    motion.enacted_at ??
                    Number(motion.startDate) + Number(motion.duration)
                  }
                />
              ) : isPassed ? (
                `—`
              ) : (
                diffFormatted
              )}
            </Text>
          </CardStatusWrapper>
          <Box display="flex" gap={4}>
            <Text size={12} weight={600} color="secondary">
              OBJECTIONS
            </Text>
            <Text size={12} strong>
              {!progress ? 'Loading...' : `${progress.objectionsPctFormatted}%`}
            </Text>
          </Box>
        </CardFooter>
      </MotionDashboardCard>
    </Link>
  );
};
