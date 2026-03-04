import {
  Description,
  DescriptionMeta,
  EnactWarningBox,
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
import { Container, IdenticonBadge } from '@lidofinance/lido-ui';
import { MotionCardDetailedSkeleton } from '../motion-card-detailed-skeleton/motion-card-detailed-skeleton';
import { Box } from 'shared/components/box';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { Text } from 'shared/components/text';
import { Motion, MotionStatus, RawMotionSubgraph } from '../types';
import { useAccount } from 'wagmi';
import { MotionCardDetailedCancelButton } from '../motion-card-detailed-cancel-button';
import { MotionDescription } from '../motion-card-description';
import { MotionEvmScript } from '../motion-evm-script';
import { FormattedDate } from '../../vote/components/formatted-date';
import { MotionDetailedTime } from '../motion-card-detailed-time';
import { getMotionDisplayStatus } from '../utils/get-motion-status';
import { MOTION_ATTENTION_PERIOD } from '../constants';
import { MotionDetailedObjections } from '../motion-card-detailed-objections';
import { AddressPop } from 'shared/components/address-pop';
import { getMotionEnactWarning } from '@easy-track/utils/get-motion-enact-warning';
import { MotionCardDetailedActions } from '@easy-track/motion-card-detailed-actions';
import {
  MotionsProvider,
  useMotions,
} from '@easy-track/providers/motion-detailed-context';
import { MotionDetailedLimits } from '@easy-track/motion-card-detailed-limits';

type Props = {
  motionId: string;
};

const MotionCardDetailedInner = () => {
  const { address: walletAddress } = useAccount();
  const { motion, motionType, isArchived, timeData, progress } = useMotions();

  const { isPassed, diff } = timeData;
  const isAttentionTime =
    diff <= Number(motion.duration) * MOTION_ATTENTION_PERIOD;

  const displayStatus = getMotionDisplayStatus({
    motion,
    progress,
    isAttentionTime,
  });

  const enactWarningMessage = getMotionEnactWarning(motionType);

  const isAuthorConnected =
    walletAddress?.toLowerCase() === motion.creator.toLowerCase();

  return (
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

          {isAuthorConnected && motion.status !== MotionStatus.CANCELED && (
            <MotionCardDetailedCancelButton />
          )}
        </HeaderAside>
      </Header>
      <Description>
        <MotionDescription motion={motion as Motion} />
        <DescriptionMeta>
          <div>Snapshot: {motion.snapshotBlock.toString()}</div>
          <div>Script:</div>
        </DescriptionMeta>

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
            <Text size={14} color="secondary" as="span">
              <InfoLabel>Author Address:</InfoLabel>
              <IdenticonBadge address={motion.creator} />
            </Text>
          </AddressPop>
        </InfoCol>
      </InfoRow>
      <MotionDetailedLimits />
      {!isArchived && motionType !== 'EvmUnrecognized' && (
        <>
          {motion.status === MotionStatus.PENDING &&
            enactWarningMessage &&
            walletAddress && (
              <EnactWarningBox>{enactWarningMessage}</EnactWarningBox>
            )}
          <MotionCardDetailedActions motion={motion} />
        </>
      )}
    </MotionCard>
  );
};

export const MotionCardDetailed = ({ motionId }: Props) => {
  const { data: motion, isLoading } = useMotionDetails({ motionId });

  if (isLoading) {
    return <MotionCardDetailedSkeleton />;
  }

  if (!motion) {
    return (
      <Container as="main" size="tight" key={motionId}>
        <Box textAlign="center">
          <Text size={18} strong>
            No results found for motion #{motionId}
          </Text>
          <Text size={14} color="secondary">
            Sorry, we weren&#39;t able to find any motions for your search. Try
            another search.
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <MotionsProvider motion={motion}>
      <MotionContainer key={motionId}>
        <MotionCardDetailedInner />
      </MotionContainer>
    </MotionsProvider>
  );
};
