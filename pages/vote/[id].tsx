import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';
import { Layout } from 'shared/components';
import { VoteCard } from 'features/vote/components/vote-card';
import React from 'react';
import { GetServerSideProps } from 'next';

type Props = {
  voteId: string;
};

export default function VotePage({ voteId }: Props) {
  return (
    <Layout containerSize="full">
      <VoteCard voteId={voteId} />
    </Layout>
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
