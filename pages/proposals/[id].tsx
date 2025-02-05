import { FC } from 'react';
import { Layout } from 'shared/components';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ProposalPage as ProposalPageComponent } from 'features/dual-governance/pages/proposal-page';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

interface Props {
  id: string;
}

const ProposalPage: FC<Props> = ({ id }) => {
  return (
    <Layout containerSize="full">
      <ProposalPageComponent id={Number(id)} />
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

export default ProposalPage;
