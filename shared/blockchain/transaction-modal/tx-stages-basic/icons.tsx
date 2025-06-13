import { useConnectorInfo } from 'reef-knot/core-react';

import {
  LedgerFail,
  LedgerConfirm,
  LedgerLoading,
  LedgerSuccess,
  Warning,
} from '@lidofinance/lido-ui';

import {
  LedgerIconWrapper,
  IconWrapper,
  SuccessIcon,
  FailIcon,
  TxLoader,
  WarningIcon,
} from './icons-styles';

const createStageIcon = (
  iconEl: React.ReactNode,
  ledgerEl: React.ReactNode,
) => {
  return () => {
    const { isLedger } = useConnectorInfo();
    if (isLedger) {
      return <LedgerIconWrapper>{ledgerEl}</LedgerIconWrapper>;
    }
    return <IconWrapper>{iconEl}</IconWrapper>;
  };
};

export const StageIconSuccess = createStageIcon(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <SuccessIcon />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <LedgerSuccess fill="transparent" />,
);

export const StageIconFail = createStageIcon(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <FailIcon />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <LedgerFail fill="transparent" />,
);

export const StageIconSign = createStageIcon(
  <TxLoader size="large" />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <LedgerConfirm fill="transparent" />,
);

export const StageIconLoader = createStageIcon(
  <TxLoader size="large" />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <LedgerLoading fill="transparent" />,
);

export const StageIconLimit = createStageIcon(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <Warning />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <LedgerFail fill="transparent" />,
);

export const StageIconDialog = createStageIcon(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <WarningIcon />,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <WarningIcon />,
);
