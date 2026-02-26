import { Layout } from 'shared/components';
import { VoteCard } from 'features/vote/components/vote-card';
import { GetServerSideProps } from 'next';
import { VoteProvider } from '../../features/vote/providers/vote-context';
import { VoteActionsProvider } from '../../features/vote/providers/vote-actions-context';
import { VoteMeta } from '../../features/vote/meta';
import { Text } from 'shared/components/text';
import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';
import Link from 'next/link';
import { Box } from '@lidofinance/lido-ui';

type Props = {
  voteId: string;
};

export default function VotePage({ voteId }: Props) {
  return (
    <>
      <VoteMeta />
      <Layout metaTitle={`Vote #${voteId}`}>
        <VoteProvider voteId={voteId}>
          <VoteActionsProvider voteId={voteId}>
            <Box marginBottom={8}>
              <Link href={VOTE_DASHBOARD_INDEX_PATH}>
                <Text size={14} color="secondary">
                  ← To all votes
                </Text>
              </Link>
            </Box>
            <VoteCard voteId={voteId} />
          </VoteActionsProvider>
        </VoteProvider>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (typeof id === 'string' && !/^\d+$/.test(id)) {
    return {
      redirect: {
        destination: VOTE_DASHBOARD_INDEX_PATH,
        permanent: false,
      },
    };
  }

  return {
    props: {
      voteId: id,
    },
  };
};
