import { useLidoSDK } from 'providers/lido-sdk';
import Head from 'next/head';
import { getAddressesList } from 'utils/get-addresses-list';
import React from 'react';

export const VoteMeta = () => {
  const { chainId } = useLidoSDK();

  return (
    <Head>
      <title>Governance Portal UI</title>
      <meta name="currentChain" content={String(chainId)} />
      {getAddressesList(chainId).map(({ contractName, address }) => (
        <meta key={contractName} name={contractName} content={address} />
      ))}
    </Head>
  );
};
