import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';
import { VoteCard } from '@vote/components/vote-card';
import { VoteProvider } from '@vote/providers/vote-context';
import { VoteMeta } from '@vote/meta';
import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';
import { BackButton } from 'shared/components/back-button';
import { VotePageWrap } from '@vote/styles';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps = getDefaultStaticProps();

export default function VotePage() {
  const { query, isReady } = useRouter();
  const id = query.id;

  if (!isReady || typeof id !== 'string') {
    return null;
  }

  const returnQuery = typeof query.q === 'string' ? query.q : '';
  const backHref = returnQuery
    ? `${VOTE_DASHBOARD_INDEX_PATH}?q=${encodeURIComponent(returnQuery)}`
    : VOTE_DASHBOARD_INDEX_PATH;

  return (
    <>
      <VoteMeta />
      <Layout containerSize="full" metaTitle={`Vote #${id}`}>
        <VotePageWrap>
          <BackButton label="votes" href={backHref} />
        </VotePageWrap>
        <VoteProvider voteId={id}>
          <VoteCard />
        </VoteProvider>
      </Layout>
    </>
  );
}
