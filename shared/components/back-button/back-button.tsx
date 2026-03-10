import { ArrowLeft } from '@lidofinance/lido-ui';
import { Text } from '../text';
import { Wrap } from './style';

type Props = {
  href: string;
  label: string;
};

export const BackButton = ({ href, label }: Props) => {
  const canGoBack =
    typeof window !== 'undefined' && window.history.state?.url !== undefined;

  return (
    <Wrap href={href}>
      <Text size={14} color="secondary">
        <ArrowLeft /> {canGoBack ? `Back to all ` : 'All '}
        {label}
      </Text>
    </Wrap>
  );
};
