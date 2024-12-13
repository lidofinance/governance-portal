import { Badge, VotePhaseWrapper } from './style';
import { Text } from 'shared/components/text';
import { VoteData, VoteStatus } from 'shared/votes/types';
import { getDateFromTimestamp } from 'utils/get-date-from-timestamp';
import { FlexWrapper } from 'shared/styled-components';

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

  const mainPhaseDateEnd = getDateFromTimestamp({
    timestamp: mainPhaseEndTimestamp,
  });
  const objectionPhaseDateEnd = getDateFromTimestamp({
    timestamp: objectionPhaseEndTimestamp,
  });

  const isWinning = yea > nay;

  return (
    <>
      <FlexWrapper $alignItems="flex-start" $gap="8px">
        <Badge $variant={isWinning ? 'success' : 'danger'}>
          {`Winning: ${isWinning ? 'Yes' : 'No'}`}
        </Badge>
        <Badge $variant={state.isQuorumReached ? 'success' : 'default'}>
          {state.isQuorumReached ? 'Quorum reached' : 'No quorum'}
        </Badge>
      </FlexWrapper>

      {state.status === VoteStatus.ActiveMain &&
        !mainPhaseDateEnd.hasPassed && (
          <VotePhaseWrapper>
            <Text>
              Main phase ends{' '}
              <b>
                {mainPhaseDateEnd.date} {mainPhaseDateEnd.tz}
              </b>
            </Text>
          </VotePhaseWrapper>
        )}

      {state.status === VoteStatus.ActiveObjection &&
        !objectionPhaseDateEnd.hasPassed && (
          <VotePhaseWrapper>
            <Text>
              Objection phase ends{' '}
              <b>
                {objectionPhaseDateEnd.date} {objectionPhaseDateEnd.tz}
              </b>
            </Text>
          </VotePhaseWrapper>
        )}
    </>
  );
};
