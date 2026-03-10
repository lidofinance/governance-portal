import { useCallback, useState } from 'react';

import { Button, Container } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { useConnect } from 'reef-knot/core-react';

import { Layout } from 'shared/components';
import {
  PageTitle,
  PageSubtitle,
  PageConnectMessageBox,
} from 'features/easy-track/start-motion/style';
import { StartMotion } from '@easy-track/start-motion';
import { MotionFormComplete } from '@easy-track/motion-form-complete';
import { Title } from '@easy-track/style';
import { Text } from 'shared/components/text';
import { Box } from 'shared/components/box';
import { Hex } from 'viem';

export default function StartMotionPage() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  const openConnectWalletModal = useCallback(async () => {
    await connect();
  }, [connect]);

  const [completeHash, setCompleteHash] = useState<Hex | null>(null);

  if (completeHash) {
    return (
      <Layout containerSize="tight">
        <Box textAlign="center" marginBottom={24}>
          <Title>Motion transaction created</Title>
          <Text>Check out transaction status</Text>
        </Box>
        <MotionFormComplete
          txHash={completeHash}
          onReset={() => setCompleteHash(null)}
        />
      </Layout>
    );
  }

  return (
    <Layout containerSize="content">
      <PageTitle>Start Motion</PageTitle>
      <PageSubtitle>Fill in the fields below</PageSubtitle>
      {isConnected ? (
        <StartMotion onComplete={setCompleteHash} />
      ) : (
        <Container as="main" size="tight">
          <PageConnectMessageBox>
            Connect your wallet first
          </PageConnectMessageBox>
          <Button type="submit" fullwidth onClick={openConnectWalletModal}>
            Connect wallet
          </Button>
        </Container>
      )}
    </Layout>
  );
}
