import { useRouter } from 'next/router';
import { Layout } from 'shared/components';
import { VoteCard } from 'features/vote/components/vote-card';
import { VoteProvider } from '../../features/vote/providers/vote-context';
import { VoteMeta } from '../../features/vote/meta';
import { Text } from 'shared/components/text';
import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';
import Link from 'next/link';
import { Box } from '@lidofinance/lido-ui';

export default function VotePage() {
  const { query, isReady } = useRouter();
  const id = query.id;

  if (!isReady || typeof id !== 'string') {
    return null;
  }

  return (
    <>
      <VoteMeta />
      <Layout metaTitle={`Vote #${id}`}>
        <VoteProvider voteId={id}>
          <Box marginBottom={8}>
            <Link href={VOTE_DASHBOARD_INDEX_PATH}>
              <Text size={14} color="secondary">
                {'< Back to all votes'}
              </Text>
            </Link>
          </Box>
          <VoteCard voteId={id} />
        </VoteProvider>
      </Layout>
    </>
  );
}
