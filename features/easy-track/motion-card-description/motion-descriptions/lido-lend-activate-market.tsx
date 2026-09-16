import { formatUnits, type Address } from 'viem';
import { lidoLendActivateMarketAbi } from 'abi/generated';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { useMotionTokenData } from '@easy-track/hooks/use-motion-token-data';
import { MotionDescriptionProps } from '../types';

const abi = lidoLendActivateMarketAbi;

const Token = ({ address, symbol }: { address: Address; symbol?: string }) => (
  <>
    {symbol ? <b>{symbol} </b> : null}
    <AddressPopInline address={address} />
  </>
);

export const LidoLendActivateMarket = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const { marketParams, fee, ...params } = callData;

  const { data: loanToken } = useMotionTokenData(marketParams.loanToken);
  const { data: collateralToken } = useMotionTokenData(
    marketParams.collateralToken,
  );

  return (
    <>
      Activate Lido Lend market{' '}
      {collateralToken && loanToken ? (
        <b>
          {collateralToken.label}/{loanToken.label}
        </b>
      ) : null}
      <ul>
        <li>
          Loan token:{' '}
          <Token address={marketParams.loanToken} symbol={loanToken?.label} />
        </li>
        <li>
          Collateral token:{' '}
          <Token
            address={marketParams.collateralToken}
            symbol={collateralToken?.label}
          />
        </li>
        <li>
          Oracle: <AddressPopInline address={marketParams.oracle} />
        </li>
        <li>
          IRM: <AddressPopInline address={marketParams.irm} />
        </li>
        <li>
          LLTV: <b>{formatUnits(marketParams.lltv, 16)}%</b>
        </li>
        <li>
          IRM config: <AddressPopInline address={params.irmConfig} />
        </li>
        <li>
          Market controller: <AddressPopInline address={params.controller} />
        </li>
        <li>
          Settlement: <b>{params.enableSettlement ? 'enabled' : 'disabled'}</b>
        </li>
        <li>
          Risk steward: <AddressPopInline address={params.steward} />
        </li>
        <li>
          Pauser committee:{' '}
          <AddressPopInline address={params.pauserCommittee} />
        </li>
        <li>
          Preseed vault: <AddressPopInline address={params.preseedVault} />
        </li>
        <li>
          Fee:{' '}
          {fee === 0n ? (
            <>
              <b>not set</b> (setFee call skipped)
            </>
          ) : (
            <b>{formatUnits(fee, 16)}%</b>
          )}
        </li>
      </ul>
    </>
  );
};
