import { useState, useEffect, useCallback } from 'react';

import { Button } from '@lidofinance/lido-ui';
import { Text } from 'shared/components/text';
import { Hash, Status, StatusWrap, StatusLoader } from './style';
import { Fieldset, MessageBox } from '@easy-track/start-motion/parts/style';
import { TxStatus } from 'shared/blockchain/types';
import { useAccount, usePublicClient } from 'wagmi';
import { ButtonExternalView } from 'shared/components/copy-open-actions/button-external-view';
import { CopyOpenActions } from 'shared/components/copy-open-actions';
import { useGnosisOpener } from 'shared/blockchain/hooks/use-gnosis-opener';
import { getEtherscanLink } from 'utils/etherscan';
import { useLidoSDK } from 'providers/lido-sdk';
import { useIsContract } from 'shared/blockchain/hooks/use-is-contract';
import { Hex } from 'viem';

type BodySafeProps = {
  txHash: Hex;
};

const BodySafe = ({ txHash }: BodySafeProps) => {
  const { address } = useAccount();
  const openGnosis = useGnosisOpener({ address, txHash });
  return (
    <div>
      <Text size={14} weight={500}>
        Gnosis Safe transaction hash:
      </Text>
      <Hash>{txHash}</Hash>
      <ButtonExternalView onClick={openGnosis}>
        View at gnosis safe
      </ButtonExternalView>
    </div>
  );
};

type BodyRegularProps = {
  txHash: Hex;
};

const BodyRegular = ({ txHash }: BodyRegularProps) => {
  const { chainId } = useLidoSDK();
  const [status, setStatus] = useState<TxStatus>('pending');
  const client = usePublicClient();

  const openEtherscan = useCallback(() => {
    const url = getEtherscanLink(chainId, txHash, 'tx');
    window.open(url, '_blank');
  }, [chainId, txHash]);

  useEffect(() => {
    if (!client) return;

    const checkTransaction = (e: any) => {
      if (!e) {
        setStatus('pending');
      } else if (e.status === 'success' || e.status === 1) {
        setStatus('success');
      } else if (e.status === 'reverted' || e.status === 0) {
        setStatus('failed');
      }
    };

    const onError = (error: any) => {
      console.error(error);
      setStatus('failed');
    };

    void client
      .waitForTransactionReceipt({ hash: txHash })
      .then(checkTransaction)
      .catch(onError);
  }, [client, txHash]);

  const renderStatusText = () =>
    status === 'failed'
      ? 'Failed (click to see why)'
      : status === 'success'
        ? 'Confirmed'
        : 'Pending';

  return (
    <>
      <StatusWrap>
        Status:
        <Status status={status} onClick={openEtherscan}>
          {renderStatusText()}
        </Status>
        {status === 'pending' && <StatusLoader />}
      </StatusWrap>
      <Text size={14} weight={500}>
        Transaction hash:
      </Text>
      <Hash>{txHash}</Hash>
      <CopyOpenActions value={txHash} entity="tx" />
    </>
  );
};

type Props = {
  txHash: Hex;
  onReset: () => void;
};

export const MotionFormComplete = ({ txHash, onReset }: Props) => {
  const { data: isMultisig } = useIsContract();

  return (
    <>
      <MessageBox>
        {isMultisig ? (
          <BodySafe txHash={txHash} />
        ) : (
          <BodyRegular txHash={txHash} />
        )}
      </MessageBox>
      <Fieldset>
        <Button variant="filled" onClick={onReset} fullwidth>
          Create another Motion
        </Button>
      </Fieldset>
    </>
  );
};
