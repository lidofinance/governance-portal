import * as abis from 'abi/generated';

/**
 * Maps contract names (as they appear in contract-addresses.ts) to their ABI
 * when the name doesn't directly match the generated ABI key, or when the
 * contract shares an ABI with a differently-named contract.
 */
export const ABI_EXCEPTIONS = {
  StETH: abis.stethAbi,
  HashConsensusAccountingOracle: abis.hashConsensusAbi,
  HashConsensusValidatorsExitBus: abis.hashConsensusAbi,
  LidoAppRepo: abis.repoAbi,
  NodeOperatorsRegistryRepo: abis.repoAbi,
  OracleRepo: abis.repoAbi,
  SimpleDVT: abis.nodeOperatorsRegistryAbi,
  SDVTRegistry: abis.nodeOperatorsRegistryAbi,
  WithdrawalQueue: abis.withdrawalQueueErc721Abi,
  DualGovernanceLegacy: abis.dualGovernanceAbi,
  AllowedRecipientRegistry: abis.allowedRecipientsRegistryAbi,
  AllowedRecipientReferralDaiRegistry: abis.allowedRecipientsRegistryAbi,
  AllowedRecipientTrpLdoRegistry: abis.allowedRecipientsRegistryAbi,
  StethRewardProgramRegistry: abis.allowedRecipientsRegistryAbi,
  StethGasSupplyRegistry: abis.allowedRecipientsRegistryAbi,
  RewardsShareProgramRegistry: abis.allowedRecipientsRegistryAbi,
  SandboxAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  LegoStablesRegistry: abis.registryWithLimitsAbi,
  LegoLDORegistry: abis.registryWithLimitsAbi,
  GasFunderETHRegistry: abis.registryWithLimitsAbi,
  RccStablesRegistry: abis.registryWithLimitsAbi,
  PmlStablesRegistry: abis.registryWithLimitsAbi,
  AtcStablesRegistry: abis.registryWithLimitsAbi,
  SandboxStablesAllowedRecipientRegistry: abis.registryWithLimitsAbi,
  SandboxStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  RccStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  PmlStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  AtcStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  StonksStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  StonksStablesAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  AllianceOpsStablesAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  EcosystemOpsStablesAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  LabsOpsStablesAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  EcosystemOpsStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
  LabsOpsStethAllowedRecipientsRegistry: abis.registryWithLimitsAbi,
} as const;

export type AbiExceptionContractName = keyof typeof ABI_EXCEPTIONS;
