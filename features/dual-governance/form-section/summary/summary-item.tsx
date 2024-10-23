import { SummaryItemWrap, SummaryItemLabel, SummaryItemContent } from './style';

type Props = {
  label?: string;
  stickBottom?: boolean;
  withBorder?: boolean;
  children?: React.ReactNode;
};

export const SummaryItem = ({
  label,
  stickBottom,
  children,
  withBorder,
}: Props) => {
  return (
    <SummaryItemWrap $stickBottom={stickBottom} $withBorder={withBorder}>
      {label && <SummaryItemLabel>{label}</SummaryItemLabel>}
      <SummaryItemContent>{children}</SummaryItemContent>
    </SummaryItemWrap>
  );
};
