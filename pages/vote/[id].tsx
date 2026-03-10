import { useRouter } from 'next/router';
import { Layout } from 'shared/components';
import { VoteCard } from 'features/vote/components/vote-card';
import { VoteProvider } from '../../features/vote/providers/vote-context';
import { VoteMeta } from '../../features/vote/meta';
import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';
import { BackButton } from 'shared/components/back-button';

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
        <BackButton label="votes" href={VOTE_DASHBOARD_INDEX_PATH} />
        <VoteProvider voteId={id}>
          <VoteCard />
        </VoteProvider>
      </Layout>
    </>
  );
}
