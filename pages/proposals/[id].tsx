import { FC } from 'react';
import { Layout } from 'shared/components';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Proposal } from 'features/dual-governance/proposals/proposal-page';

interface Props {
  id: string;
}

const ProposalPage: FC<Props> = ({ id }) => {
  return (
    <Layout containerSize="full">
      <Proposal id={id} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: { id },
  };
};

export default ProposalPage;
