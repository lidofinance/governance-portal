import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';
import { GetServerSideProps } from 'next';

type Props = {
  voteId: string;
};

export default function VotePage({ voteId }: Props) {
  // eslint-disable-next-line no-console
  console.log(voteId);
  return null; // VoteCard
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  // Check if id is a number
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
