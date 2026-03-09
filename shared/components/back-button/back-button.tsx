import { ArrowLeft, Box } from '@lidofinance/lido-ui';
import Link from 'next/link';
import { Text } from '../text';

type Props = {
  href: string;
  label: string;
};

export const BackButton = ({ href, label }: Props) => {
  const canGoBack =
    typeof window !== 'undefined' && window.history.state?.url !== undefined;

  return (
    <Box marginBottom={8}>
      <Link href={href}>
        <Text size={14} color="secondary">
          <ArrowLeft /> {canGoBack ? `Back to` : ''}
          {label}
        </Text>
      </Link>
    </Box>
  );
};
