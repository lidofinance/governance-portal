import { decodeFunctionResult, formatUnits } from 'viem';
import { lidoLendMarketManagerActionsAbi } from 'abi/generated';
import { LidoLendMarketManagerAction } from '@easy-track/lido-lend/actions';
import { AddressPopInline } from 'shared/components/address-pop-inline';
import { MotionDescriptionProps } from '../types';
import { Amount, MarketId, TokenAmount } from './lido-lend-parts';

const abi = lidoLendMarketManagerActionsAbi;

export const LidoLendMarketManagerActions = ({
  callData,
}: MotionDescriptionProps<typeof abi>) => {
  const [action, payload] = callData;

  switch (action) {
    case LidoLendMarketManagerAction.SetInstantActivation: {
      const [marketId, caller, enabled] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetInstantActivationPayload',
        data: payload,
      });

      return (
        <>
          {enabled ? 'Enable' : 'Disable'} instant activation for{' '}
          <AddressPopInline address={caller} /> on market{' '}
          <MarketId marketId={marketId} />
        </>
      );
    }

    case LidoLendMarketManagerAction.SetCollateralActivationConfig: {
      const [marketId, cfg] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetCollateralActivationConfigPayload',
        data: payload,
      });

      return (
        <>
          Set collateral activation config for market{' '}
          <MarketId marketId={marketId} />
          <ul>
            <li>
              Min activation delay (s):{' '}
              <Amount value={cfg.minActivationDelay} />
            </li>
            <li>
              Max activation delay (s):{' '}
              <Amount value={cfg.maxActivationDelay} />
            </li>
            <li>
              Max delay inflow:{' '}
              <TokenAmount
                marketId={marketId}
                value={cfg.maxDelayInflow}
                isCollateral
              />
            </li>
            <li>
              Min deposit amount:{' '}
              <TokenAmount
                marketId={marketId}
                value={cfg.minDepositAmount}
                isCollateral
              />
            </li>
            <li>
              Activating lock duration (s):{' '}
              <Amount value={cfg.activatingLockDuration} />
            </li>
            <li>
              Min activation amount:{' '}
              <TokenAmount
                marketId={marketId}
                value={cfg.minActivationAmount}
                isCollateral
              />
            </li>
            <li>
              Max guardians quorum delay (s):{' '}
              <Amount value={cfg.maxGuardiansQuorumDelay} />
            </li>
            <li>
              Delay per strike (s): <Amount value={cfg.delayPerStrike} />
            </li>
            <li>
              Delay per suspect (s): <Amount value={cfg.delayPerSuspect} />
            </li>
          </ul>
        </>
      );
    }

    case LidoLendMarketManagerAction.SetSettlementConfig: {
      const [marketId, config] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetSettlementConfigPayload',
        data: payload,
      });

      return (
        <>
          Set settlement config for market <MarketId marketId={marketId} />
          <ul>
            <li>
              Slice floor BPS: <Amount value={config.sliceFloorBps} />
            </li>
            <li>
              Slice floor assets:{' '}
              <TokenAmount
                marketId={marketId}
                value={config.sliceFloorAssets}
              />
            </li>
            <li>
              Full cut below collateral:{' '}
              <TokenAmount
                marketId={marketId}
                value={config.fullCutBelowCollateral}
                isCollateral
              />
            </li>
            <li>
              LTV step BPS: <Amount value={config.ltvStepBps} />
            </li>
          </ul>
        </>
      );
    }

    case LidoLendMarketManagerAction.SetSupplyCap: {
      const [marketId, newCap] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetSupplyCapPayload',
        data: payload,
      });

      return (
        <>
          Set supply cap of market <MarketId marketId={marketId} /> to{' '}
          <TokenAmount marketId={marketId} value={newCap} />
        </>
      );
    }

    case LidoLendMarketManagerAction.UnfreezeMarkets: {
      const marketIds = decodeFunctionResult({
        abi,
        functionName: 'decodeUnfreezeMarketsPayload',
        data: payload,
      });

      return (
        <>
          Unfreeze <b>{marketIds.length}</b> market
          {marketIds.length === 1 ? '' : 's'}
          <ul>
            {marketIds.map((marketId, index) => (
              <li key={index}>
                <MarketId marketId={marketId} />
              </li>
            ))}
          </ul>
        </>
      );
    }

    case LidoLendMarketManagerAction.SetFee: {
      const [marketId, newFee] = decodeFunctionResult({
        abi,
        functionName: 'decodeSetFeePayload',
        data: payload,
      });

      return (
        <>
          Set fee of market <MarketId marketId={marketId} /> to{' '}
          <b>{formatUnits(newFee, 16)}%</b> of accrued interest
        </>
      );
    }

    default:
      return <>Unknown Lido Lend market manager action ({action})</>;
  }
};
