import clamp from 'lodash/clamp';
import { LimitProgressBar } from './limit-progress-bar';

import {
  ProgressHeader,
  ProgressDesc,
  Limit,
  LimitDesc,
  ProgressPeriodWrapper,
} from './style';

import { FormattedDate } from '../../vote/components/formatted-date';

type MotionLimitProgressProps = {
  spentAmount: string;
  totalLimit: string;
  startDate: number;
  endDate: number;
  token?: string;
  newAmount: number;
  showAmountChange?: boolean;
};

export const MotionLimitProgress = (props: MotionLimitProgressProps) => {
  const {
    spentAmount,
    totalLimit,
    startDate,
    endDate,
    token,
    newAmount,
    showAmountChange,
  } = props;

  const isValidNewValue = !Number.isNaN(Number(newAmount));
  const newSpentValue = isValidNewValue
    ? Number(spentAmount) + newAmount
    : Number(spentAmount);

  const progressPercent = clamp(
    Number(spentAmount) / (Number(totalLimit) / 100),
    0,
    100,
  );
  const newValuePercent = clamp(
    Number(newSpentValue) / (Number(totalLimit) / 100),
    0,
    101,
  );

  const isAboveTheLimit = newValuePercent > 100;

  const amount = showAmountChange ? (
    <span>
      {Number(spentAmount).toLocaleString('en-EN')} +{' '}
      {newAmount.toLocaleString('en-EN')}
    </span>
  ) : (
    <span>{newSpentValue.toLocaleString('en-EN')}</span>
  );

  return (
    <>
      <ProgressHeader>
        <ProgressDesc>Top up limit</ProgressDesc>
        <LimitDesc>
          {amount}{' '}
          <Limit>
            / {Number(totalLimit).toLocaleString('en-EN')} {token}
          </Limit>
        </LimitDesc>
      </ProgressHeader>
      <LimitProgressBar
        progress={progressPercent}
        negative={isAboveTheLimit}
        newProgress={newValuePercent}
      />
      <ProgressPeriodWrapper>
        <span>
          <FormattedDate format="MMM DD, YYYY" date={startDate * 1000} />
        </span>
        <span>
          <FormattedDate format="MMM DD, YYYY" date={endDate * 1000} />
        </span>
      </ProgressPeriodWrapper>
    </>
  );
};
