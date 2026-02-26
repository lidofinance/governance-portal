import { GetServerSideProps } from 'next';
import { VOTE_DASHBOARD_INDEX_PATH } from 'constants/urls';

export default function VoteIndex() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: VOTE_DASHBOARD_INDEX_PATH,
      permanent: false,
    },
  };
};
