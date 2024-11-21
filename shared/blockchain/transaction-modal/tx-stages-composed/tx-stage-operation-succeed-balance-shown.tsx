import styled from 'styled-components';

import { InlineLoader } from '@lidofinance/lido-ui';
import { SuccessText } from '../tx-stages-parts/success-text';
import { TxStageSuccess } from '../tx-stages-basic';

import { Text } from 'shared/components/text';
import { formatEthFull } from 'shared/blockchain/utils';
import { Token } from 'shared/blockchain/types';

export const SkeletonBalance = styled(InlineLoader).attrs({
  color: 'text',
})`
  margin-left: ${({ theme }) => theme.spaceMap.xs}px;
  width: 100px;
`;

export const BalanceContainer = styled('div')`
  display: inline-block;
  white-space: nowrap;
`;

type Props = {
  balance?: bigint;
  token: Token;
  operationText: string;
  txHash?: string;
  footer?: React.ReactNode;
};

export const TxStageOperationSucceedBalanceShown = ({
  balance,
  token,
  operationText,
  txHash,
  footer,
}: Props) => {
  const balanceEl = balance !== undefined && (
    <Text>
      {formatEthFull(balance)} {token}
    </Text>
  );

  return (
    <TxStageSuccess
      txHash={txHash}
      title={
        <>
          Your new balance is <wbr />
          <BalanceContainer>
            {balance ? balanceEl : <SkeletonBalance />}
          </BalanceContainer>
        </>
      }
      description={
        <SuccessText operationText={operationText} txHash={txHash} />
      }
      showEtherscan={false}
      footer={footer}
    />
  );
};
