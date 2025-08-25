import { Wrap } from './style';

type Props = {
  type?: 'error' | 'warning';
  children?: React.ReactNode;
};

export const AttentionBanner = ({ type = 'warning', children }: Props) => {
  return (
    <Wrap type={type}>
      <span>{children}</span>
    </Wrap>
  );
};
