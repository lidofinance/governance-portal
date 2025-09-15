import { UseQueryResult } from '@tanstack/react-query';

export type Manifest = Record<string, ManifestEntry>;

export type ManifestEntry = {
  cid?: string;
  ens?: string;
  leastSafeVersion?: string;
  config: ManifestConfig;
};

export type ManifestConfig = {
  multiChainBanner: number[];
};

export type ExternalConfig = Omit<ManifestEntry, 'config'> &
  ManifestConfig & {
    fetchMeta: UseQueryResult<ManifestEntry>;
  };

export enum ManifestConfigPageEnum {
  DualGovernance = '/',
  Proposal = '/proposal',
}

export type ManifestConfigPage = `${ManifestConfigPageEnum}`;
