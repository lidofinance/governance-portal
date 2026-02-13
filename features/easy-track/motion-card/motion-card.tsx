import {
  BadgeWrapper,
  Card,
  CardStatus,
  CardStatusWrapper,
  CardTitle,
  DescWrapper,
  EnactDate,
} from './style';
import { Motion, MotionStatus } from '../types';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useLidoSDK } from 'providers/lido-sdk';
import { getMotionTypeByScriptFactory } from '../utils/get-motion-type';
import { getMotionStatus } from '../utils/get-motion-status';
import { Text } from 'shared/components/text';
import { FormattedDate } from '../../vote/components/formatted-date';
import { useMotionTimeCountdown } from '../hooks/use-motion-time-countdown';
import { useMotionProgress } from '../hooks/use-motion-progress';
// import { MOTION_ATTENTION_PERIOD } from '../constants';
import { AddressPop } from 'shared/components/address-pop';
import { Identicon, trimAddress } from '@lidofinance/lido-ui';
import { MotionDescription } from '../motion-card-description';
import { Box } from 'shared/components/box';

type Props = {
  motion: Motion;
  isCompact?: boolean;
};

export const MotionCard = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();

  const motionStatus = getMotionStatus(motion);

  const progress = useMotionProgress(motion);

  const isArchived =
    motionStatus !== MotionStatus.ACTIVE &&
    motionStatus !== MotionStatus.PENDING;

  const timeData = useMotionTimeCountdown(motion);
  const { isPassed, diffFormatted } = timeData;

  // const isAttentionTime =
  //   diff <= Number(motion.duration) * MOTION_ATTENTION_PERIOD;

  return (
    <Card>
      <CardTitle>
        #{motion.id.toString()}{' '}
        {getMotionTypeDisplayName(
          getMotionTypeByScriptFactory(chainId, motion.evmScriptFactory),
        )}
      </CardTitle>
      <DescWrapper>
        <MotionDescription motion={motion} />
      </DescWrapper>
      <CardStatusWrapper $status={motionStatus}>
        <CardStatus>{motionStatus}</CardStatus>
        <>
          {isArchived ? (
            <EnactDate>
              <FormattedDate
                format="MMM DD, YYYY"
                date={
                  motion.enacted_at ??
                  Number(motion.startDate) + Number(motion.duration)
                }
              />
            </EnactDate>
          ) : isPassed ? (
            <Text size={24} weight={600}>
              —
            </Text>
          ) : (
            diffFormatted
          )}
        </>
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
    </Card>
  );
};
