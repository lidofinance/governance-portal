import { GetServerSideProps } from 'next';
import { EASY_TRACK__MOTIONS_PATH } from '../../constants/urls';

export default function EasyTrackIndex() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: EASY_TRACK__MOTIONS_PATH,
      permanent: false,
    },
  };
};
