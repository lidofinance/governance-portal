import { JsonRpcBatchProvider, Network } from '@ethersproject/providers';
import { defineReadOnly } from '@ethersproject/properties';
import { Logger } from '@ethersproject/logger';

const logger = new Logger('StaticJsonRpcBatchProvider');

/**
 * Local copy of the same provider from the "@lido-sdk"
 */
export class StaticJsonRpcBatchProvider extends JsonRpcBatchProvider {
  private _networkInitialized = false;

  async detectNetwork(): Promise<Network> {
    if (this._networkInitialized) {
      return this._network;
    }

    const network = await super.detectNetwork();
    if (!network) {
      logger.throwError('No network detected', Logger.errors.UNKNOWN_ERROR, {});
    }

    defineReadOnly(this, '_network', network);
    this._networkInitialized = true;
    this.emit('network', network, null);

    return network;
  }
}
