import { Bar } from './style';

type Props = {
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  showOnBackground?: boolean;
};

export const SkeletonBar = ({
  width,
  className,
  style = {},
  showOnBackground,
}: Props) => {
  return (
    <Bar
      style={{ ...style, width }}
      showOnBackground={showOnBackground}
      className={className}
    />
  );
};
