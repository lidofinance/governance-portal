import { Badge, VotePhaseWrapper } from './style';
import { Text } from 'shared/components/text';
import { VoteData, VoteStatus } from 'shared/votes/types';
import { FlexWrapper } from 'shared/styled-components';
import { useCountdown } from 'shared/hooks/use-countdown';
import { useMemo } from 'react';
import { Box } from 'shared/components/box';

type Props = {
  startDate: bigint;
  yea: bigint;
  nay: bigint;
} & Pick<VoteData, 'state' | 'voteTime' | 'objectionPhaseTime'>;

export const VoteStatusBadge = ({
  state,
  startDate,
  voteTime,
  objectionPhaseTime,
  yea,
  nay,
}: Props) => {
  const mainPhaseEndTimestamp = Number(
    startDate + (BigInt(voteTime) - BigInt(objectionPhaseTime)),
  );
  const objectionPhaseEndTimestamp = Number(startDate + BigInt(voteTime));

  const { timeFormatted: mainPhaseCountdown, isFinished: isMainPhaseFinished } =
    useCountdown(mainPhaseEndTimestamp);

  const readyToEnact = useMemo(
    () =>
      state.status === VoteStatus.Pending || state.status === VoteStatus.Passed,
    [state.status],
  );

  const {
    timeFormatted: objectionPhaseCountdown,
    isFinished: isObjectionPhaseFinished,
  } = useCountdown(objectionPhaseEndTimestamp);

  const isWinning = useMemo(() => yea > nay, [yea, nay]);

  const showIsWinning = useMemo(
    () => [yea, nay].some((votePower) => votePower !== 0n),
    [yea, nay],
  );

  if (readyToEnact) {
    return (
      <Box alignItems="flex-start" gap={8}>
        <Badge $variant={'default'}>Ready to enact</Badge>
      </Box>
    );
  }

  return (
    <>
      <FlexWrapper $alignItems="flex-start" $gap="8px" $flexWrap="wrap">
        {showIsWinning && (
          <Badge $variant={isWinning ? 'success' : 'danger'}>
            {`Winning: ${isWinning ? 'Yes' : 'No'}`}
          </Badge>
        )}
        <Badge $variant={state.isQuorumReached ? 'success' : 'default'}>
          {state.isQuorumReached ? 'Quorum reached' : 'No quorum'}
        </Badge>
      </FlexWrapper>

      {state.status === VoteStatus.ActiveMain && !isMainPhaseFinished && (
        <VotePhaseWrapper>
          <Text>
            Main phase ends in <br /> <b>{mainPhaseCountdown}</b>
          </Text>
        </VotePhaseWrapper>
      )}

      {state.status === VoteStatus.ActiveObjection &&
        !isObjectionPhaseFinished && (
          <VotePhaseWrapper>
            <Text>
              Objection phase ends in <br />
              <b>{objectionPhaseCountdown}</b>
            </Text>
          </VotePhaseWrapper>
        )}
    </>
  );
};
