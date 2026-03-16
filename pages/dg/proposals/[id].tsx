import { FC } from 'react';
import { Layout } from 'shared/components';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ProposalPage as ProposalPageComponent } from 'features/dual-governance/pages/proposal-page';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';
import { DualGovernanceProposalsProvider } from 'providers/dual-governance-proposals';

interface Props {
  id: string;
}

const ProposalPage: FC<Props> = ({ id }) => {
  const numericId = Number(id);

  return (
    <Layout containerSize="full" metaTitle={`Proposal #${numericId}`}>
      <DualGovernanceProposalsProvider id={numericId}>
        <ProposalPageComponent id={numericId} />
      </DualGovernanceProposalsProvider>
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
