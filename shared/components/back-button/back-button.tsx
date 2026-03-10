import { ArrowLeft } from '@lidofinance/lido-ui';
import { Text } from '../text';
import { Wrap } from './style';

type Props = {
  href: string;
  label: string;
};

export const BackButton = ({ href, label }: Props) => {
  return (
    <Wrap href={href}>
      <Text size={14} color="secondary">
        <ArrowLeft />
        Back to all {label}
      </Text>
    </Wrap>
  );
};
