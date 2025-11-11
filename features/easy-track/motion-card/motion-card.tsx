import { Card, CardTitle } from './style';
import { Motion, MotionStatus } from '../types';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { useLidoSDK } from 'providers/lido-sdk';
import { getMotionTypeByScriptFactory } from '../utils/get-motion-type';
import {
  getMotionDisplayStatus,
  getMotionStatus,
} from '../utils/get-motion-status';
import { Text } from 'shared/components/text';
import { FormattedDate } from '../../vote/components/formatted-date';
import { useMotionTimeCountdown } from '../hooks/use-motion-time-countdown';
import { useMotionProgress } from '../hooks/use-motion-progress';
import { MOTION_ATTENTION_PERIOD } from '../constants';
import { AddressPop } from 'shared/components/address-pop';
import { usePublicClient } from 'wagmi';
import { useReadContract } from 'shared/blockchain/hooks/use-read-contract';
import { EasyTrack } from 'shared/blockchain/contracts';
import {
  AddressLabel,
  AddressWrap,
} from '../../vote/components/voters-list/style';
import { TurnArrow, UnionIcon } from '../../../shared/components/icons';
import { PublicDelegateAvatar } from '../../vote/components/public-delegate-avatar';
import { Identicon, trimAddress } from '@lidofinance/lido-ui';

type Props = {
  motion: Motion;
  isCompact?: boolean;
};

export const MotionCard = ({ motion }: Props) => {
  const { chainId } = useLidoSDK();

  const motionStatus = getMotionStatus(motion);

  const progress = useMotionProgress(motion);

  const easyTrackContract = useReadContract(EasyTrack);

  const isArchived =
    motionStatus !== MotionStatus.ACTIVE &&
    motionStatus !== MotionStatus.PENDING;

  const timeData = useMotionTimeCountdown(motion);
  const { isPassed, diff, diffFormatted } = timeData;

  const isAttentionTime =
    diff <= Number(motion.duration) * MOTION_ATTENTION_PERIOD;

  const client = usePublicClient({ chainId });

  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  });

  return (
    <Card>
      <CardTitle>
        #{motion.id.toString()}{' '}
        {getMotionTypeDisplayName(
          getMotionTypeByScriptFactory(chainId, motion.evmScriptFactory),
        )}
      </CardTitle>
      <Text size={12} weight={400}>
        {motionStatus}
      </Text>
      <>
        {isArchived ? (
          <FormattedDate
            format="MMM DD, YYYY"
            date={
              motion.enacted_at ??
              Number(motion.startDate) + Number(motion.duration)
            }
          />
        ) : isPassed ? (
          '—'
        ) : (
          diffFormatted
        )}
      </>
      <AddressPop address={motion.creator}>
        <Identicon address={motion.creator} diameter={20} />
        {trimAddress(motion.creator, 4)}
      </AddressPop>
      <>
        <Text size={10} strong>
          Objections
        </Text>
        <Text>
          {!progress ? 'Loading...' : `${progress.objectionsPctFormatted}%`}
        </Text>
      </>
    </Card>
  );
};
