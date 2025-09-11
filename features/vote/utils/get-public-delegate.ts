import { PUBLIC_DELEGATES } from '../public-delegates';
import { PublicDelegate } from '../types';

export const getPublicDelegate = (address: string): PublicDelegate | null =>
  PUBLIC_DELEGATES.find(
    (delegate) => delegate.address.toLowerCase() === address.toLowerCase(),
  ) ?? null;
