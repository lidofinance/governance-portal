import {
  Description,
  DescriptionMeta,
  EnactWarningBox,
  Header,
  InfoCell,
  InfoCol,
  InfoLabel,
  InfoRow,
  MotionCard,
  MotionContainer,
  HeaderMeta,
  StatusWrap,
  StartDateCell,
  StartDateTime,
  StartDateValue,
  StatusValue,
  Badges,
  AddressWrap,
} from './style';
import { useMotionDetails } from '../hooks/use-motion-details';
import { Container, IdenticonBadge, Link } from '@lidofinance/lido-ui';
import { MotionCardDetailedSkeleton } from '../motion-card-detailed-skeleton/motion-card-detailed-skeleton';
import { Box } from 'shared/components/box';
import { getMotionTypeDisplayName } from '../utils/get-motion-type-display-name';
import { Text } from 'shared/components/text';
import { Motion, MotionStatus, RawMotionSubgraph } from '../types';
import { useAccount } from 'wagmi';
import { MotionCardDetailedCancelButton } from '../motion-card-detailed-cancel-button';
import { MotionDescription } from '../motion-card-description';
import { MotionEvmScript } from '../motion-evm-script';
import { FormattedDate } from 'shared/components/formatted-date';
import { MotionDetailedTime } from '../motion-card-detailed-time';
import { getMotionDisplayStatus } from '../utils/get-motion-status';
import { useMotionTimeCountdown } from '../hooks/use-motion-time-countdown';
import { MOTION_ATTENTION_PERIOD } from '../constants';
import { MotionDetailedObjections } from '../motion-card-detailed-objections';
import { AddressPop } from 'shared/components/address-pop';
import { getMotionEnactWarning } from '@easy-track/utils/get-motion-enact-warning';
import { MotionCardDetailedActions } from '@easy-track/motion-card-detailed-actions';
import {
  MotionsProvider,
  useMotionContext,
} from '@easy-track/providers/motion-detailed-context';
import { MotionDetailedLimits } from '@easy-track/motion-card-detailed-limits';
import { BackButton } from 'shared/components/back-button';
import { EASY_TRACK__MOTIONS_PATH } from 'constants/urls';
import { getMotionCategoryTags } from '@easy-track/utils/get-motion-category-tags';
import { Badge } from 'shared/components/badge';
import { getEtherscanLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';

type Props = {
  motionId: string;
};

const MotionCardDetailedInner = () => {
  const { address: walletAddress } = useAccount();
  const { motion, motionType, isArchived, progress } = useMotionContext();
  const { chainId } = useLidoSDK();

  const timeData = useMotionTimeCountdown(motion);
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

  const motionTags = getMotionCategoryTags(motionType);

  return (
    <MotionCard>
      <HeaderMeta>
        <Text size={16} weight={700} color="textv1-secondary">
          Motion #{Number(motion.id)}
        </Text>
        <StatusWrap>
          <Text size={12} color="textv1-secondary">
            Status:
          </Text>
          <StatusValue $displayStatus={displayStatus}>
            {motion.status === MotionStatus.ACTIVE && isPassed
              ? MotionStatus.PENDING
              : motion.status}
          </StatusValue>
        </StatusWrap>
      </HeaderMeta>
      <Badges>
        {motionTags.map((tag, index) => (
          <Badge
            key={index}
            variant={tag.variant}
            type={tag.isSubCategory ? 'secondary' : 'primary'}
          >
            {tag.text}
          </Badge>
        ))}
      </Badges>
      <Header>
        <Text size={20} weight={700} color="textv1">
          {getMotionTypeDisplayName(motionType)}
          {motionType === 'EvmUnrecognized' && (
            <>
              <br />
              {motion.evmScriptFactory}
            </>
          )}
        </Text>
        {isAuthorConnected &&
          motion.status !== MotionStatus.CANCELED &&
          motion.status !== MotionStatus.ENACTED && (
            <MotionCardDetailedCancelButton />
          )}
      </Header>
      <Description>
        <MotionDescription motion={motion as Motion} />
        <DescriptionMeta>
          Snapshot block:{' '}
          <Link
            href={getEtherscanLink(
              chainId,
              motion.snapshotBlock.toString(),
              'block',
            )}
          >
            {motion.snapshotBlock.toString()}
          </Link>
        </DescriptionMeta>
        <MotionEvmScript motion={motion} />
      </Description>
      <InfoRow>
        <InfoCol>
          <MotionDetailedTime
            motion={motion as RawMotionSubgraph}
            timeData={timeData}
            displayStatus={displayStatus}
            isArchived={isArchived}
          />

          <StartDateCell>
            <InfoLabel>Started on</InfoLabel>
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
          <AddressWrap>
            <InfoLabel>Author</InfoLabel>
            <AddressPop address={motion.creator} isPaddingless>
              <IdenticonBadge address={motion.creator} />
            </AddressPop>
          </AddressWrap>
          <AddressWrap>
            <InfoLabel>Factory</InfoLabel>
            <AddressPop address={motion.evmScriptFactory} isPaddingless>
              <IdenticonBadge address={motion.evmScriptFactory} />
            </AddressPop>
          </AddressWrap>
        </InfoCol>
      </InfoRow>
      <MotionDetailedLimits />
      {!isArchived && motionType !== 'EvmUnrecognized' && (
        <div>
          {motion.status === MotionStatus.PENDING &&
            enactWarningMessage &&
            walletAddress && (
              <EnactWarningBox>{enactWarningMessage}</EnactWarningBox>
            )}
          <MotionCardDetailedActions motion={motion} />
        </div>
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
        <BackButton href={EASY_TRACK__MOTIONS_PATH} label="motions" />
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
        <BackButton href={EASY_TRACK__MOTIONS_PATH} label="motions" />
        <MotionCardDetailedInner />
      </MotionContainer>
    </MotionsProvider>
  );
};
