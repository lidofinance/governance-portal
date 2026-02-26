import { GetStaticPaths, GetStaticProps } from 'next';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';
import { Layout } from 'shared/components';
import { MotionCardDetailed } from 'features/easy-track/motion-card-detailed';

type Props = {
  id: string;
};

const MotionPage = ({ id }: Props) => {
  return (
    <Layout containerSize="full">
      <MotionCardDetailed motionId={id} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = getDefaultStaticProps(
  async ({ params }) => {
    const id = params?.id;
    if (!id) {
      return {
        notFound: true,
      };
    }

    return {
      props: { id },
    };
  },
);

export default MotionPage;
