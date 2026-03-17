import {
  BadgeWrapper,
  CardStatusWrapper,
  CardTitle,
  DescWrapper,
} from './style';
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
import { FormattedDate } from '../../vote/components/formatted-date';
import { useMotionTimeCountdown } from '../hooks/use-motion-time-countdown';
import { useMotionProgress } from '../hooks/use-motion-progress';
import { MOTION_ATTENTION_PERIOD } from '../constants';
import { AddressPop } from 'shared/components/address-pop';
import { Identicon, trimAddress } from '@lidofinance/lido-ui';
import { MotionDescription } from '../motion-card-description';
import { Box } from 'shared/components/box';
import { motionPage } from 'constants/urls';
import Link from 'next/link';
import { DashboardCard } from 'shared/components/dashboard-card';

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

  return (
    <Link passHref href={motionPage(motion.id.toString())}>
      <DashboardCard>
        <CardTitle>
          #{motion.id.toString()}{' '}
          {getMotionTypeDisplayName(
            getMotionTypeByScriptFactory(chainId, motion.evmScriptFactory),
          )}
        </CardTitle>
        <DescWrapper>
          <MotionDescription motion={motion} textSize="small" />
        </DescWrapper>
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

        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column" gap={4}>
            <Text size={10} weight={600} color="secondary">
              OBJECTIONS
            </Text>
            <Text size={10} strong>
              {!progress ? 'Loading...' : `${progress.objectionsPctFormatted}%`}
            </Text>
          </Box>
          <AddressPop address={motion.creator}>
            <BadgeWrapper>
              <Text size={12} color="secondary">
                {trimAddress(motion.creator, 4)}
              </Text>
              <Identicon address={motion.creator} diameter={20} />
            </BadgeWrapper>
          </AddressPop>
        </Box>
      </DashboardCard>
    </Link>
  );
};
