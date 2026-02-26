import {
  Description,
  Header,
  HeaderAside,
  InfoCell,
  InfoCol,
  InfoLabel,
  InfoRow,
  MotionCard,
  MotionContainer,
  MotionNumber,
  StartDateCell,
  StartDateTime,
  StartDateValue,
  StatusLabel,
  StatusValue,
} from './style';
import { useMotionDetails } from '../hooks/use-motion-details';
import { IdenticonBadge, InlineLoader } from '@lidofinance/lido-ui';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { getMotionTypeByScriptFactory } from '../utils/get-motion-type';
import { Text } from 'shared/components/text';
import { useLidoSDK } from 'providers/lido-sdk';
import { Motion, MotionStatus, RawMotionSubgraph } from '../types';
import { useMotionTimeCountdown } from '../hooks/use-motion-time-countdown';
import { useAccount } from 'wagmi';
import { MotionCardDetailedCancelButton } from '../motion-card-detailed-cancel-button';
import { MotionDescription } from '../motion-card-description';
import { MotionEvmScript } from '../motion-evm-script';
import { FormattedDate } from '../../vote/components/formatted-date';
import { MotionDetailedTime } from '../motion-card-detailed-time';
import { getMotionDisplayStatus } from '../utils/get-motion-status';
import { useMotionProgress } from '../hooks/use-motion-progress';
import { MOTION_ATTENTION_PERIOD } from '../constants';
import { MotionDetailedObjections } from '../motion-card-detailed-objections';
import { AddressPop } from 'shared/components/address-pop';

type Props = {
  motionId: string;
};

export const MotionCardDetailed = ({ motionId }: Props) => {
  const { chainId } = useLidoSDK();
  const { address: walletAddress } = useAccount();

  const { data: motion, isLoading } = useMotionDetails({ motionId });

  const timeData = useMotionTimeCountdown(motion ?? null);
  const progress = useMotionProgress(motion ?? null);

  if (isLoading || !motion) {
    return <InlineLoader />;
  }

  const { isPassed, diff } = timeData;
  const isAttentionTime =
    diff <= Number(motion.duration) * MOTION_ATTENTION_PERIOD;

  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  });

  const motionType = getMotionTypeByScriptFactory(
    chainId,
    motion.evmScriptFactory,
  );

  const isAuthorConnected = walletAddress === motion.creator;

  return (
    <MotionContainer key={motionId}>
      <MotionCard>
        <Header>
          <div>
            <MotionNumber>Motion #{Number(motion.id)}</MotionNumber>
            <Text size={14} weight={800}>
              {getMotionTypeDisplayName(motionType)}
              {motionType === 'EvmUnrecognized' && (
                <>
                  <br />
                  {motion.evmScriptFactory}
                </>
              )}
            </Text>
          </div>
          <HeaderAside>
            <div>
              <StatusLabel>Status</StatusLabel>
              <StatusValue
                isActive={motion.status === MotionStatus.ACTIVE}
                isRejected={motion.status === MotionStatus.REJECTED}
              >
                {motion.status === MotionStatus.ACTIVE && isPassed
                  ? MotionStatus.PENDING
                  : motion.status}
              </StatusValue>
            </div>

            {isAuthorConnected && (
              <MotionCardDetailedCancelButton motion={motion} />
            )}
          </HeaderAside>
        </Header>
        <Description>
          <MotionDescription motion={motion as Motion} />
          {/*{stonksRecipientAddress && (*/}
          {/*  <Link*/}
          {/*    passHref*/}
          {/*    href={{*/}
          {/*      pathname: stonksInstance(stonksRecipientAddress),*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <StonksButton size="xs">Create Stonks Order</StonksButton>*/}
          {/*  </Link>*/}
          {/*)}*/}
          <br />
          <br />
          <div>Snapshot: {motion.snapshotBlock.toString()}</div>
          <br />
          <div>Script:</div>
          <br />
          <MotionEvmScript motion={motion} />
        </Description>
        <InfoRow>
          <InfoCol>
            <MotionDetailedTime
              motion={motion as RawMotionSubgraph}
              timeData={timeData}
              displayStatus={displayStatus}
            />

            <StartDateCell>
              <InfoLabel>Started on:</InfoLabel>
              <StartDateValue>
                <FormattedDate
                  date={Number(motion.startDate)}
                  format="MMM DD, YYYY "
                />
                <StartDateTime>
                  <FormattedDate
                    date={Number(motion.startDate)}
                    format="hh:mma"
                  />
                </StartDateTime>
              </StartDateValue>
            </StartDateCell>
          </InfoCol>
          <InfoCol>
            <InfoCell>
              <MotionDetailedObjections motion={motion} />
            </InfoCell>
            <AddressPop address={motion.creator}>
              <Text size={14} color="secondary">
                <InfoLabel>Author Address:</InfoLabel>
                <IdenticonBadge address={motion.creator} />
              </Text>
            </AddressPop>
          </InfoCol>
        </InfoRow>
      </MotionCard>
    </MotionContainer>
  );
};
