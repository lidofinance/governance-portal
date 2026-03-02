import { useCallback } from 'react';

import { Button, Container } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';
import { useConnect } from 'reef-knot/core-react';

import { Layout } from 'shared/components';
import {
  PageTitle,
  PageSubtitle,
  PageConnectMessageBox,
} from 'features/easy-track/start-motion/style';
import { StartMotion } from '../../features/easy-track/start-motion';

export default function StartMotionPage() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  const openConnectWalletModal = useCallback(async () => {
    await connect();
  }, [connect]);

  // const [complete, setComplete] = useState<ResultTx | null>(null);

  // if (complete) {
  //   return (
  //     <Container as="main" size="tight">
  //       <Title
  //         title="Motion transaction created"
  //         subtitle="Check out transaction status"
  //       />
  //       <MotionFormComplete
  //         resultTx={complete}
  //         onReset={() => setComplete(null)}
  //       />
  //     </Container>
  //   );
  // }

  return (
    <Layout containerSize="tight">
      <PageTitle>Start Motion</PageTitle>
      <PageSubtitle>Fill in the fields below</PageSubtitle>
      {!isConnected && (
        <Container as="main" size="tight">
          <PageConnectMessageBox>
            Connect your wallet first
          </PageConnectMessageBox>
          <br />
          <Button type="submit" fullwidth onClick={openConnectWalletModal}>
            Connect wallet
          </Button>
        </Container>
      )}
      {isConnected && <StartMotion />}
    </Layout>
  );
}
