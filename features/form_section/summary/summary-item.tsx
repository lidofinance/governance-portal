import {
  SummaryItemWrap,
  SummaryItemLabel,
  SummaryItemContent,
} from './styles';

type Props = {
  label?: string;
  stickBottom?: boolean;
  children?: React.ReactNode;
};

export const SummaryItem = ({ label, stickBottom, children }: Props) => {
  return (
    <SummaryItemWrap $stickBottom={stickBottom}>
      {label && <SummaryItemLabel>{label}</SummaryItemLabel>}
      <SummaryItemContent>{children}</SummaryItemContent>
    </SummaryItemWrap>
  );
};
