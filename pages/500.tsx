import { FC } from 'react';
import Head from 'next/head';
import { ServicePage } from '@lidofinance/lido-ui';

const Page404: FC = () => (
  <ServicePage title="500">
    <Head>
      <title>Internal Server Error | Lido</title>
    </Head>
    Internal Server Error
  </ServicePage>
);

export default Page404;
