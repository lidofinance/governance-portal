import { FC } from 'react';

// import { config } from 'config';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

const settings: FC = () => {
  return (
    <Layout>
      <h1>settings</h1>
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps(async () => {
  // if (!config.ipfsMode) return { notFound: true };

  return { props: {} };
});

export default settings;
