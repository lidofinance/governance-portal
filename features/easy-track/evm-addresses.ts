import { flow, map, toPairs, fromPairs, mapValues } from 'lodash/fp';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { MotionType } from './motion-types';
import { Address } from 'viem';

const EvmSupportedChains = [CHAINS.Mainnet, CHAINS.Hoodi] as const;

export type EvmSupportedChain = (typeof EvmSupportedChains)[number];

type EvmAddresses = Record<
  EvmSupportedChain,
  Partial<Record<MotionType, Address | ''>>
>;

export type KeyFromValue<V, T extends Record<PropertyKey, PropertyKey>> = {
  [K in keyof T]: V extends T[K] ? K : never;
}[keyof T];

type Invert<T extends Record<PropertyKey, PropertyKey>> = {
  [V in T[keyof T]]: KeyFromValue<V, T>;
};

export const EvmAddressesByChain: EvmAddresses = {
  // Mainnet
  [CHAINS.Mainnet]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0xFeBd8FAC16De88206d4b18764e826AF38546AfE0',
    [MotionType.AllowedRecipientTopUpTrpLdo]:
      '0xBd2b6dC189EefD51B273F5cb2d99BA1ce565fb8C',
    [MotionType.LegoLDOTopUp]: '0x00caAeF11EC545B192f16313F53912E453c91458',
    [MotionType.StethRewardProgramAdd]:
      '0x935cb3366Faf2cFC415B2099d1F974Fd27202b77',
    [MotionType.StethRewardProgramRemove]:
      '0x22010d1747CaFc370b1f1FBBa61022A313c5693b',
    [MotionType.StethRewardProgramTopUp]:
      '0x1F2b79FE297B7098875930bBA6dd17068103897E',
    [MotionType.StethGasSupplyAdd]:
      '0x48c135Ff690C2Aa7F5B11C539104B5855A4f9252',
    [MotionType.StethGasSupplyRemove]:
      '0x7E8eFfAb3083fB26aCE6832bFcA4C377905F97d7',
    [MotionType.StethGasSupplyTopUp]:
      '0x200dA0b6a9905A377CF8D469664C65dB267009d1',
    [MotionType.RewardsShareProgramAdd]:
      '0x1F809D2cb72a5Ab13778811742050eDa876129b6',
    [MotionType.RewardsShareProgramRemove]:
      '0xd30Dc38EdEfc21875257e8A3123503075226E14B',
    [MotionType.RewardsShareProgramTopUp]:
      '0xbD08f9D6BF1D25Cc7407E4855dF1d46C2043B3Ea',
    [MotionType.LegoStablesTopUp]: '0x6AB39a8Be67D9305799c3F8FdFc95Caf3150d17c',
    [MotionType.SDVTNodeOperatorsAdd]:
      '0xcAa3AF7460E83E665EEFeC73a7a542E5005C9639',
    [MotionType.SDVTNodeOperatorsActivate]:
      '0xCBb418F6f9BFd3525CE6aADe8F74ECFEfe2DB5C8',
    [MotionType.SDVTNodeOperatorsDeactivate]:
      '0x8B82C1546D47330335a48406cc3a50Da732672E7',
    [MotionType.SDVTVettedValidatorsLimitsSet]:
      '0xD75778b855886Fc5e1eA7D6bFADA9EB68b35C19D',
    [MotionType.SDVTTargetValidatorLimitsUpdateV2]:
      '0x161a4552A625844c822954C5AcBac928ee0f399B',
    [MotionType.SDVTNodeOperatorRewardAddressesSet]:
      '0x589e298964b9181D9938B84bB034C3BB9024E2C0',
    [MotionType.SDVTNodeOperatorNamesSet]:
      '0x7d509BFF310d9460b1F613e4e40d342201a83Ae4',
    [MotionType.SDVTNodeOperatorManagerChange]:
      '0xE31A0599A6772BCf9b2bFc9e25cf941e793c9a7D',
    [MotionType.StonksStethTopUp]: '0x6e04aED774B7c89BB43721AcDD7D03C872a51B69',
    [MotionType.StonksStablesTopUp]:
      '0x0d2aefA542aFa8d9D1Ec35376068B88042FEF5f6',
    [MotionType.AllianceOpsStablesTopUp]:
      '0xe5656eEe7eeD02bdE009d77C88247BC8271e26Eb',
    [MotionType.CSMSettleElStealingPenalty]:
      '0xF6B6E7997338C48Ea3a8BCfa4BB64a315fDa76f4',
    [MotionType.EcosystemOpsStablesTopUp]:
      '0xf2476f967C826722F5505eDfc4b2561A34033477',
    [MotionType.LabsOpsStablesTopUp]:
      '0xE1f6BaBb445F809B97e3505Ea91749461050F780',

    [MotionType.MEVBoostRelaysAdd]:
      '0x00A3D6260f70b1660c8646Ef25D0820EFFd7bE60',
    [MotionType.MEVBoostRelaysEdit]:
      '0x6b7863f2c7dEE99D3b744fDAEDbEB1aeCC025535',
    [MotionType.MEVBoostRelaysRemove]:
      '0x9721c0f77E3Ea40eD592B9DCf3032DaF269c0306',

    // Lido Vaults
    [MotionType.RegisterGroupsInOperatorGrid]:
      '0x17305dB55c908e84C58BbDCa57258A7D1f7eEa7c',
    [MotionType.RegisterTiersInOperatorGrid]:
      '0x6b535F441F95046562406F4E2518D9AD7Db2dc0D',
    [MotionType.UpdateGroupsShareLimit]:
      '0xf23559De8ab37fF7a154384B0822dA867Cfa7Eac',
    [MotionType.AlterTiersInOperatorGrid]:
      '0x37d9B09EDA477a84E3913fCB4d032EFb0BF9B62E',
    [MotionType.SetJailStatusInOperatorGrid]:
      '0x6a4f33F05E7412A11100353724Bb6a152Cf0D305',
    [MotionType.UpdateVaultsFeesInOperatorGrid]:
      '0xDfA0bc38113B6d53c2881573FD764CEEFf468610',
    [MotionType.ForceValidatorExitsInVaultHub]:
      '0x6F5c0A5a824773E8f8285bC5aA59ea0Aab2A6400',
    [MotionType.SocializeBadDebtInVaultHub]:
      '0xaf35A63a4114B7481589fDD9FDB3e35Fd65fAed7',

    [MotionType.CuratedExitRequestHashesSubmit]:
      '0x4F716AD3Cc7A3A5cdA2359e5B2c84335c171dCde',
    [MotionType.SDVTExitRequestHashesSubmit]:
      '0x58A59dDC6Aea9b1D5743D024E15DfA4badB56E37',
    [MotionType.CSMSetVettedGateTree]:
      '0xBc5642bDD6F2a54b01A75605aAe9143525D97308',

    // next motion factories are @deprecated
    // we are keeping them here to display history data
    [MotionType.LEGOTopUp]: '0x648C8Be548F43eca4e482C0801Ebccccfb944931',
    [MotionType.GasFunderETHTopUp]:
      '0x41F9daC5F89092dD6061E59578A2611849317dc8',
    [MotionType.RewardProgramAdd]: '0x9D15032b91d01d5c1D940eb919461426AB0dD4e3',
    [MotionType.RewardProgramRemove]:
      '0xc21e5e72Ffc223f02fC410aAedE3084a63963932',
    [MotionType.RewardProgramTopUp]:
      '0x77781A93C4824d2299a38AC8bBB11eb3cd6Bc3B7',
    [MotionType.ReferralPartnerAdd]:
      '0x929547490Ceb6AeEdD7d72F1Ab8957c0210b6E51',
    [MotionType.ReferralPartnerRemove]:
      '0xE9eb838fb3A288bF59E9275Ccd7e124fDff88a9C',
    [MotionType.ReferralPartnerTopUp]:
      '0x54058ee0E0c87Ad813C002262cD75B98A7F59218',
    [MotionType.AllowedRecipientAdd]:
      '0x1dCFc37719A99d73a0ce25CeEcbeFbF39938cF2C',
    [MotionType.AllowedRecipientRemove]:
      '0x00BB68a12180a8f7E20D8422ba9F81c07A19A79E',
    [MotionType.AllowedRecipientTopUp]:
      '0x85d703B2A4BaD713b596c647badac9A1e95bB03d',
    [MotionType.AllowedRecipientAddReferralDai]:
      '0x8F06a7f244F6Bb4B68Cd6dB05213042bFc0d7151',
    [MotionType.AllowedRecipientRemoveReferralDai]:
      '0xd8f9B72Cd97388f23814ECF429cd18815F6352c1',
    [MotionType.AllowedRecipientTopUpReferralDai]:
      '0x009ffa22ce4388d2F5De128Ca8E6fD229A312450',
    [MotionType.RccDAITopUp]: '0x84f74733ede9bFD53c1B3Ea96338867C94EC313e',
    [MotionType.PmlDAITopUp]: '0x4E6D3A5023A38cE2C4c5456d3760357fD93A22cD',
    [MotionType.AtcDAITopUp]: '0x67Fb97ABB9035E2e93A7e3761a0d0571c5d7CD07',
    [MotionType.LegoDAITopUp]: '0x0535a67ea2D6d46f85fE568B7EaA91Ca16824FEC',
    [MotionType.SDVTTargetValidatorLimitsUpdateV1]:
      '0x41CF3DbDc939c5115823Fba1432c4EC5E7bD226C',
    [MotionType.RccStethTopUp]: '0xcD42Eb8a5db5a80Dc8f643745528DD77cf4C7D35',
    [MotionType.PmlStethTopUp]: '0xc5527396DDC353BD05bBA578aDAa1f5b6c721136',
    [MotionType.AtcStethTopUp]: '0x87b02dF27cd6ec128532Add7C8BC19f62E6f1fB9',
    [MotionType.RccStablesTopUp]: '0x75bDecbb6453a901EBBB945215416561547dfDD4',
    [MotionType.PmlStablesTopUp]: '0x92a27C4e5e35cFEa112ACaB53851Ec70e2D99a8D',
    [MotionType.AtcStablesTopUp]: '0x1843Bc35d1fD15AbE1913b9f72852a79457C42Ab',
    [MotionType.RegisterGroupsInOperatorGridPhaseOne]:
      '0x194A46DA1947E98c9D79af13E06Cfbee0D8610cC',
    [MotionType.UpdateGroupsShareLimitPhaseOne]:
      '0x8Bdc726a3147D8187820391D7c6F9F942606aEe6',
    [MotionType.AlterTiersInOperatorGridPhaseOne]:
      '0xa29173C7BCf39dA48D5E404146A652d7464aee14',
    [MotionType.SetJailStatusInOperatorGridPhaseOne]:
      '0x93F1DEE4473Ee9F42c8257C201e33a6Da30E5d67',
    [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]:
      '0x5C3bDFa3E7f312d8cf72F56F2b797b026f6B471c',
    [MotionType.ForceValidatorExitsInVaultHubPhaseOne]:
      '0x6C968cD89CA358fbAf57B18e77a8973Fa869a6aA',
    [MotionType.SocializeBadDebtInVaultHubPhaseOne]:
      '0x1dF50522A1D868C12bF71747Bb6F24A18Fe6d32C',
    [MotionType.RegisterGroupsInOperatorGridOld]:
      '0xE73842AEbEC99Dacf2aAEec61409fD01A033f478',
    [MotionType.RegisterTiersInOperatorGridOld]:
      '0x5292A1284e4695B95C0840CF8ea25A818751C17F',
    [MotionType.AlterTiersInOperatorGridOld]:
      '0x73f80240ad9363d5d3C5C3626953C351cA36Bfe9',
  },

  // Hoodi
  [CHAINS.Hoodi]: {
    [MotionType.NodeOperatorIncreaseLimit]:
      '0x0f121e4069e17a2Dc5bAbF39d769313a1e20f323',
    [MotionType.CuratedExitRequestHashesSubmit]:
      '0x397206ecdbdcb1A55A75e60Fc4D054feC72E5f63',

    [MotionType.AllowedRecipientTopUpTrpLdo]: '',
    [MotionType.LegoLDOTopUp]: '',
    [MotionType.StethRewardProgramAdd]: '',
    [MotionType.StethRewardProgramRemove]: '',
    [MotionType.StethRewardProgramTopUp]: '',
    [MotionType.StethGasSupplyAdd]: '',
    [MotionType.StethGasSupplyRemove]: '',
    [MotionType.StethGasSupplyTopUp]: '',
    [MotionType.RewardsShareProgramAdd]: '',
    [MotionType.RewardsShareProgramRemove]: '',
    [MotionType.RewardsShareProgramTopUp]: '',

    [MotionType.LegoStablesTopUp]: '',

    // SDVT factories
    [MotionType.SDVTNodeOperatorsAdd]:
      '0x42f2532ab3d41dfD6030db1EC2fF3DBC8DCdf89a',
    [MotionType.SDVTNodeOperatorsActivate]:
      '0xfA3B3EE204E1f0f165379326768667300992530e',
    [MotionType.SDVTNodeOperatorsDeactivate]:
      '0x3114bEbC222Faec27DF8AB7f9bD8dF2063d7fc77',
    [MotionType.SDVTVettedValidatorsLimitsSet]:
      '0x956c5dC6cfc8603b2293bF8399B718cbf61a9dda',
    [MotionType.SDVTNodeOperatorNamesSet]:
      '0x2F98760650922cf65f1b596635bC5835b6E561d4',
    [MotionType.SDVTNodeOperatorRewardAddressesSet]:
      '0x3d267e4f8d9dCcc83c2DE66729e6A5B2B0856e31',
    [MotionType.SDVTTargetValidatorLimitsUpdateV2]:
      '0xc3975Bc4091B585c57357990155B071111d7f4f8',
    [MotionType.SDVTNodeOperatorManagerChange]:
      '0x8a437cd5685e270cDDb347eeEfEbD22109Fa42a9',
    [MotionType.SDVTExitRequestHashesSubmit]:
      '0xAa3D6A8B52447F272c1E8FAaA06EA06658bd95E2',
    [MotionType.SandboxStethRemove]:
      '0x86E10ffC7c67A92e0c5E58ae42945213da43D0c7',
    [MotionType.SandboxStablesAdd]:
      '0x8C89b58F1B71C9B2Dc76AF0c99Ed31Bac23E0B88',
    [MotionType.SandboxStablesRemove]:
      '0xc84251D2959E976AfE95201E1e2B88dB56Bc0a69',
    [MotionType.MEVBoostRelaysAdd]:
      '0xF02DbeaA1Bbc90226CaB995db4C190DbE25983af',
    [MotionType.MEVBoostRelaysEdit]:
      '0x27A99a7104190DdA297B222104A6C70A4Ca5A17e',
    [MotionType.MEVBoostRelaysRemove]:
      '0x7FCc2901C6C3D62784cB178B14d44445B038f736',
    [MotionType.SandboxStethAdd]: '0x8f05Cc4cC42745E9723E105D38638683f162e1d9',

    [MotionType.SandboxStablesTopUp]:
      '0x9D735eeDfa96F53BF9d31DbE81B51a5d333198dB',

    [MotionType.SandboxStethTopUp]:
      '0xE5aE943A3AEFA44AD16438Bc3D2cA7654103F985',

    [MotionType.AllowConsolidationPair]:
      '0x22D36e7616F541A527989C5652fDA4d527bB461C',
    [MotionType.CreateOrUpdateOperatorGroup]:
      '0xF5Dd3789AC14fd4be9C0D24f4d2218B4024047DD',
    [MotionType.UpdateStakingModuleShareLimits]:
      '0xEE8E0d3087f09f56E3fdb80dd1DB3Fb37de0bfFF',

    [MotionType.StonksStethTopUp]: '',
    [MotionType.StonksStablesTopUp]: '',
    [MotionType.AllianceOpsStablesTopUp]: '',
    [MotionType.EcosystemOpsStablesTopUp]: '',
    [MotionType.EcosystemOpsStethTopUp]: '',
    [MotionType.LabsOpsStablesTopUp]: '',
    [MotionType.LabsOpsStethTopUp]: '',

    // Vaults
    // Phase one
    [MotionType.RegisterGroupsInOperatorGridPhaseOne]:
      '0xfEF8B796Fea42b3C68E342364Adcf88F1d6145a6',
    [MotionType.UpdateGroupsShareLimitPhaseOne]:
      '0x56Ff87F41a8CF795764E15E496124240Ac17695b',
    [MotionType.AlterTiersInOperatorGridPhaseOne]:
      '0xF21f98cac0Ba38f02b4d5be1667cc345929E8877',
    [MotionType.SetJailStatusInOperatorGridPhaseOne]:
      '0x4e5b0187479854e88A5b18c49047636707a26f0d',
    [MotionType.UpdateVaultsFeesInOperatorGridPhaseOne]:
      '0x615D3f028D1CA549d350403Cd6043Cb515BE08BF',
    [MotionType.ForceValidatorExitsInVaultHubPhaseOne]:
      '0x83DfE5Fe8ac8b7DB38c020F4F54BF09b65D92c63',
    [MotionType.SocializeBadDebtInVaultHubPhaseOne]:
      '0xa11906bBBBaC5207b8FDA4F7F294d7EcB8dcc758',

    [MotionType.RegisterGroupsInOperatorGrid]:
      '0x50ffc44FF526405dBA3e5a4833B003D93301dDDd',
    [MotionType.RegisterTiersInOperatorGrid]:
      '0x8182E168f858514328C06b5C21eec975E105D494',
    [MotionType.UpdateGroupsShareLimit]:
      '0x99a645A4137ea171Ce4D43c22d30A71251D6Ed7d',
    [MotionType.AlterTiersInOperatorGrid]:
      '0x9A3Fe18BcD5e7657f6a78Ab895aF125Cacae2c36',
    [MotionType.SetJailStatusInOperatorGrid]:
      '0x395E6AF61B6Ba3EC0E72E168A2Ec8204589F357c',
    [MotionType.UpdateVaultsFeesInOperatorGrid]:
      '0x2D5b8B082d618A8d5DeFE3f4c2b2869e3f1C1a3D',
    [MotionType.ForceValidatorExitsInVaultHub]:
      '0x820e9924C2059d37871acd6eccB578e4a3B15c30',
    [MotionType.SocializeBadDebtInVaultHub]:
      '0x01C9dB53D7a87c3e47D537c925921fB735bEe6c9',
    [MotionType.SetLiabilitySharesTargetInVaultHub]:
      '0xaccaE3755d63EeaAF2e525E780aEeA8D58700Ab9',

    [MotionType.CSMSetMerkleGateTree]:
      '0xDAf4afD2dD5DcA705900b9e526150C1a00057994',
    [MotionType.CuratedSetMerkleGateTree]:
      '0x9F4BB90d6D0bB3B18a7156F3648c1e5256BAD1a7',

    [MotionType.CSMSettleGeneralDelayedPenalty]:
      '0x029239CDF35d5669d81D32A83EbF783b87aD1AEE',
    [MotionType.CuratedSettleGeneralDelayedPenalty]:
      '0x6B5b2147E2B7Ae08E4486D41741D805A869d2338',

    [MotionType.CSMReportWithdrawalsForSlashedValidators]:
      '0x5732943077210FD18d9d5d2A9d4D8847A5069713',
    [MotionType.CuratedReportWithdrawalsForSlashedValidators]:
      '0xE1EDc1857B47a3188d9cA16E3e6A2DF2Af494FDD',

    // next motion factories are @deprecated
    // we are keeping them here to display history data
    [MotionType.LEGOTopUp]: '',
    [MotionType.GasFunderETHTopUp]: '',
    [MotionType.RewardProgramAdd]: '',
    [MotionType.RewardProgramRemove]: '',
    [MotionType.RewardProgramTopUp]: '',
    [MotionType.ReferralPartnerAdd]: '',
    [MotionType.ReferralPartnerRemove]: '',
    [MotionType.ReferralPartnerTopUp]: '',
    [MotionType.AllowedRecipientAdd]: '',
    [MotionType.AllowedRecipientRemove]: '',
    [MotionType.AllowedRecipientTopUp]: '',
    [MotionType.AllowedRecipientAddReferralDai]: '',
    [MotionType.AllowedRecipientRemoveReferralDai]: '',
    [MotionType.AllowedRecipientTopUpReferralDai]: '',
    [MotionType.LegoDAITopUp]: '',
    [MotionType.SDVTTargetValidatorLimitsUpdateV1]: '',
    [MotionType.RccStethTopUp]: '',
    [MotionType.PmlStethTopUp]: '',
    [MotionType.AtcStethTopUp]: '',
    [MotionType.RccStablesTopUp]: '',
    [MotionType.PmlStablesTopUp]: '',
    [MotionType.AtcStablesTopUp]: '',
    [MotionType.CSMSettleElStealingPenalty]:
      '0x5c0af5b9f96921d3F61503e1006CF0ab9867279E',
    [MotionType.CSMSetVettedGateTree]:
      '0xa890fc73e1b771Ee6073e2402E631c312FF92Cd9',
  },
};

export const parseEvmSupportedChainId = (
  chainId: CHAINS,
): EvmSupportedChain => {
  const numChainId = Number(chainId);

  if (!(numChainId in EvmAddressesByChain)) {
    throw new Error(`Chain ${chainId} is not supported`);
  }

  return numChainId;
};

export const EvmUnrecognized = 'EvmUnrecognized';
// intentionally
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type EvmUnrecognized = typeof EvmUnrecognized;

export const EvmTypesByAddress = mapValues(
  flow(
    toPairs,
    map(([type, address]) => [address.toLowerCase(), type]),
    fromPairs,
  ),
  EvmAddressesByChain,
) as {
  [key in EvmSupportedChain]: Invert<EvmAddresses[key]>;
};

export const EvmAddressesByType = Object.values(MotionType).reduce(
  (res, motionType) => ({
    ...res,
    [motionType]: EvmSupportedChains.reduce(
      (resIn, chainId) => {
        const address = EvmAddressesByChain[chainId][motionType];
        if (!address) {
          return resIn;
        }

        return {
          ...resIn,
          [chainId]: address,
        };
      },
      {} as { [C in EvmSupportedChain]: EvmAddresses[C][typeof motionType] },
    ),
  }),
  {} as {
    [M in MotionType]: { [C in EvmSupportedChain]: EvmAddresses[C][M] };
  },
);
