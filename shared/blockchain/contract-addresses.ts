import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { ChainAddressMap } from './types';

export const DaoToken: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  [CHAINS.Holesky]: '0x14ae7daeecdf57034f3E9db8564e46Dba8D97344',
  [CHAINS.Hoodi]: {
    actual: '0xEf2573966D009CcEA0Fc74451dee2193564198dc',
    test: '0xB8799DAc7A87a3580D6984c8f4cC596520dCf2F2',
  },
};

export const TokenManager: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xf73a1260d222f447210581ddf212d915c09a3249',
  [CHAINS.Holesky]: '0xFaa1692c6eea8eeF534e7819749aD93a1420379A',
  [CHAINS.Hoodi]: '0x8ab4a56721Ad8e68c6Ad86F9D9929782A78E39E5',
};

export const AragonFinance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb9e5cbb9ca5b0d659238807e84d0176930753d86',
  [CHAINS.Holesky]: '0xf0F281E5d7FBc54EAFcE0dA225CDbde04173AB16',
  [CHAINS.Hoodi]: '0x254Ae22bEEba64127F0e59fe8593082F3cd13f6b',
};

export const NodeOperatorsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5',
  [CHAINS.Holesky]: '0x595F64Ddc3856a3b5Ff4f4CC1d1fb4B46cFd2bAC',
  [CHAINS.Hoodi]: '0x5cDbE1590c083b5A2A64427fAA63A7cfDB91FbB5',
};

export const AragonAgent: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c',
  [CHAINS.Holesky]: '0xE92329EC7ddB11D25e25b3c21eeBf11f15eB325d',
  [CHAINS.Hoodi]: '0x0534aA41907c9631fae990960bCC72d75fA7cfeD',
};

export const AragonACL: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb',
  [CHAINS.Holesky]: '0xfd1E42595CeC3E83239bf8dFc535250e7F48E0bC',
  [CHAINS.Hoodi]: '0x78780e70Eae33e2935814a327f7dB6c01136cc62',
};

export const VotingRepo: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x4Ee3118E3858E8D7164A634825BfE0F73d99C792',
  [CHAINS.Holesky]: '0x2997EA0D07D79038D83Cb04b3BB9A2Bc512E3fDA',
  [CHAINS.Hoodi]: '0xc972Cdea5956482Ef35BF5852601dD458353cEbD',
};

export const LidoDAO: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc',
  [CHAINS.Holesky]: '0x3b03f75Ec541Ca11a223bB58621A3146246E1644',
  [CHAINS.Hoodi]: '0xA48DF029Fd2e5FCECB3886c5c2F60e3625A1E87d',
};

export const EasyTrack: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea',
  [CHAINS.Holesky]: '0x1763b9ED3586B08AE796c7787811a2E1bc16163a',
  [CHAINS.Hoodi]: '0x284D91a7D47850d21A6DEaaC6E538AC7E5E6fc2a',
};

export const TokenRecovererForManagerContracts: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x1bdfFe0EBef3FEAdF2723D3330727D73f538959C',
};

export const LidoAppRepo: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF5Dc67E54FC96F993CD06073f71ca732C1E654B1',
  [CHAINS.Holesky]: '0xA37fb4C41e7D30af5172618a863BBB0f9042c604',
  [CHAINS.Hoodi]: '0xd3545AC0286A94970BacC41D3AF676b89606204F',
};

export const NodeOperatorsRegistryRepo: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x0D97E876ad14DB2b183CFeEB8aa1A5C788eB1831',
  [CHAINS.Holesky]: '0x4E8970d148CB38460bE9b6ddaab20aE2A74879AF',
  [CHAINS.Hoodi]: '0x52eff83071275341ef0A5A2cE48ee818Cef44c39',
};

export const OracleRepo: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF9339DE629973c60c4d2b76749c81E6F40960E3A',
  [CHAINS.Holesky]: '0xB3d74c319C0C792522705fFD3097f873eEc71764',
  [CHAINS.Hoodi]: '0x6E0997D68C1930a76413DE7da666D8A531eF1f9b',
};

export const LegacyOracle: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x442af784A788A5bd6F42A01Ebe9F287a871243fb',
  [CHAINS.Holesky]: '0x072f72BE3AcFE2c52715829F2CD9061A6C8fF019',
  [CHAINS.Hoodi]: '0x5B70b650B7E14136eb141b5Bf46a52f962885752',
};

export const CompositePostRebaseBeaconReceiver: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x55a7E1cbD678d9EbD50c7d69Dc75203B0dBdD431',
};

export const DepositSecurityModule: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xffa96d84def2ea035c7ab153d8b991128e3d72fd',
  [CHAINS.Holesky]: '0x045dd46212A178428c088573A7d102B9d89a022A',
  [CHAINS.Hoodi]: '0x2F0303F20E0795E6CCd17BD5efE791A586f28E03',
};

export const WithdrawalVault: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
  [CHAINS.Holesky]: '0xF0179dEC45a37423EAD4FaD5fCb136197872EAd9',
  [CHAINS.Hoodi]: '0x4473dCDDbf77679A643BdB654dbd86D67F8d32f2',
};

export const ShapellaUpgradeTemplate: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xa818ff9ec93122bf9401ab4340c42de638cd600a',
};

export const StakingRouter: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xFdDf38947aFB03C621C71b06C9C70bce73f12999',
  [CHAINS.Holesky]: '0xd6EbF043D30A7fe46D1Db32BA90a0A51207FE229',
  [CHAINS.Hoodi]: '0xCc820558B39ee15C7C45B59390B503b83fb499A8',
};

export const LidoLocator: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb',
  [CHAINS.Holesky]: '0x28FAB2059C713A7F9D8c86Db49f9bb0e96Af1ef8',
  [CHAINS.Hoodi]: '0xe2EF9536DAAAEBFf5b1c130957AB3E80056b06D8',
};

export const OracleReportSanityChecker: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xf1647c86E6D7959f638DD9CE1d90e2F3C9503129',
  [CHAINS.Holesky]: '0xF0d576c7d934bBeCc68FE15F1c5DAF98ea2B78bb',
  [CHAINS.Hoodi]: '0x26AED10459e1096d242ABf251Ff55f8DEaf52348',
};

export const OracleDaemonConfig: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xbf05A929c3D7885a6aeAd833a992dA6E5ac23b09',
  [CHAINS.Holesky]: '0xC01fC1F2787687Bc656EAc0356ba9Db6e6b7afb7',
  [CHAINS.Hoodi]: '0x2a833402e3F46fFC1ecAb3598c599147a78731a9',
};

export const HashConsensusAccountingOracle: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xD624B08C83bAECF0807Dd2c6880C3154a5F0B288',
  [CHAINS.Holesky]: '0xa067FC95c22D51c3bC35fd4BE37414Ee8cc890d2',
  [CHAINS.Hoodi]: '0x32EC59a78abaca3f91527aeB2008925D5AaC1eFC',
};

export const HashConsensusValidatorsExitBus: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7FaDB6358950c5fAA66Cb5EB8eE5147De3df355a',
  [CHAINS.Holesky]: '0xe77Cf1A027d7C10Ee6bb7Ede5E922a181FF40E8f',
  [CHAINS.Hoodi]: '0x30308CD8844fb2DB3ec4D056F1d475a802DCA07c',
};

export const TRPVestingEscrowFactory: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDA1DF6442aFD2EC36aBEa91029794B9b2156ADD0',
  [CHAINS.Holesky]: '0x586f0b51d46ac8ac6058702d99cd066ae514e96b',
};

export const AccountingOracle: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x852deD011285fe67063a08005c71a85690503Cee',
  [CHAINS.Holesky]: '0x4E97A3972ce8511D87F334dA17a2C332542a5246',
  [CHAINS.Hoodi]: '0xcb883B1bD0a41512b42D2dB267F2A2cd919FB216',
};

export const ValidatorsExitBusOracle: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x0De4Ea0184c2ad0BacA7183356Aea5B8d5Bf5c6e',
  [CHAINS.Holesky]: '0xffDDF7025410412deaa05E3E1cE68FE53208afcb',
  [CHAINS.Hoodi]: '0x8664d394C2B3278F26A1B44B967aEf99707eeAB2',
};

export const MEVBoostRelayAllowedList: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xF95f069F9AD107938F6ba802a3da87892298610E',
  [CHAINS.Holesky]: '0x2d86C5855581194a386941806E38cA119E50aEA3',
  [CHAINS.Hoodi]: '0x279d3A456212a1294DaEd0faEE98675a52E8A4Bf',
};

export const ExecutionLayerRewardsVault: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x388C818CA8B9251b393131C08a736A67ccB19297',
  [CHAINS.Holesky]: '0xE73a3602b99f1f913e72F8bdcBC235e206794Ac8',
  [CHAINS.Hoodi]: '0x9b108015fe433F173696Af3Aa0CF7CDb3E104258',
};

export const Burner: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xE76c52750019b80B43E36DF30bf4060EB73F573a',
  [CHAINS.Holesky]: '0x4E46BD7147ccf666E1d73A3A456fC7a68de82eCA',
  [CHAINS.Hoodi]: '0x4e9A9ea2F154bA34BE919CD16a4A953DCd888165',
};

export const SimpleDVT: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433',
  [CHAINS.Holesky]: '0x11a93807078f8BB880c1BD0ee4C387537de4b4b6',
  [CHAINS.Hoodi]: '0x0B5236BECA68004DB89434462DfC3BB074d2c830',
};

export const SimpleDVTRepo: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x2325b0a607808dE42D918DB07F925FFcCfBb2968',
  [CHAINS.Holesky]: '0x889dB59baf032E1dfD4fCA720e0833c24f1404C6',
  [CHAINS.Hoodi]: '0x2b8B52A5e3485853aDccED669B1d0bbF31D40222',
};

// https://docs.snapshot.org/user-guides/delegation
export const Snapshot: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x469788fE6E9E9681C6ebF3bF78e7Fd26Fc015446',
  [CHAINS.Holesky]: '0x575e8c7DD6422e574A0E3e8cf6B23db1F01584CD',
  [CHAINS.Hoodi]: '0x2230be05E8083C11761AE9F98ee309118951b96d',
};

export const L1ERC20TokenBridge: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x76943C0D61395d8F2edF9060e1533529cAe05dE6',
};

// Address reference: https://docs.optimism.io/chain/addresses#ethereum-l1
export const OptimismL1CrossDomainMessengerProxy: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
};

export const CSAccounting: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x4d72BFF1BeaC69925F8Bd12526a39BAAb069e5Da',
  [CHAINS.Holesky]: '0xc093e53e8F4b55A223c18A2Da6fA00e60DD5EFE1',
  [CHAINS.Hoodi]: '0xA54b90BA34C5f326BC1485054080994e38FB4C60',
};

export const CSFeeDistributor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xD99CC66fEC647E68294C6477B40fC7E0F6F618D0',
  [CHAINS.Holesky]: '0xD7ba648C8F72669C6aE649648B516ec03D07c8ED',
  [CHAINS.Hoodi]: '0xaCd9820b0A2229a82dc1A0770307ce5522FF3582',
};

export const CSFeeOracle: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x4D4074628678Bd302921c20573EEa1ed38DdF7FB',
  [CHAINS.Holesky]: '0xaF57326C7d513085051b50912D51809ECC5d98Ee',
  [CHAINS.Hoodi]: '0xe7314f561B2e72f9543F1004e741bab6Fc51028B',
};

export const CSHashConsensus: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x71093efF8D8599b5fA340D665Ad60fA7C80688e4',
  [CHAINS.Holesky]: '0xbF38618Ea09B503c1dED867156A0ea276Ca1AE37',
  [CHAINS.Hoodi]: '0x54f74a10e4397dDeF85C4854d9dfcA129D72C637',
};

export const CSModule: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
  [CHAINS.Holesky]: '0x4562c3e63c2e586cD1651B958C22F88135aCAd4f',
  [CHAINS.Hoodi]: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
};

export const CSMRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdA7dE2ECdDfccC6c3AF10108Db212ACBBf9EA83F',
  [CHAINS.Holesky]: '0x4562c3e63c2e586cd1651b958c22f88135acad4f',
  [CHAINS.Hoodi]: '0x79CEf36D84743222f37765204Bec41E92a93E59d',
};

export const CSVerifier: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdC5FE1782B6943f318E05230d688713a560063DC',
  [CHAINS.Holesky]: '0xC099dfD61F6E5420e0Ca7e84D820daAd17Fc1D44',
  [CHAINS.Hoodi]: '0xB6bafBD970a4537077dE59cebE33081d794513d6',
};

export const SandboxNodeOperatorsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x0000000000000000000000000000000000000000',
  [CHAINS.Holesky]: '0xD6C2ce3BB8bea2832496Ac8b5144819719f343AC',
  [CHAINS.Hoodi]: '0x682E94d2630846a503BDeE8b6810DF71C9806891',
};

export const StETH: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  [CHAINS.Holesky]: '0x7a955618ff2ad00d58e5c38205bc1f0b33bc5494',
  [CHAINS.Hoodi]: {
    test: '0x7853038c89a91752de79094db32fede15b5c6a4b',
    actual: '0x3508A952176b3c15387C97BE809eaffB1982176a',
  },
};

export const WstETH: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  [CHAINS.Holesky]: '0x67b3c1e122ff0b778c9dedc1de2fb0f451aa12c8',
  [CHAINS.Hoodi]: {
    test: '0xccdc9c43eaa165edeb1fc0c98d781b9fe318582a',
    actual: '0x7E99eE3C66636DE415D2d7C880938F2f40f94De4',
  },
};

export const WithdrawalQueue: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
  [CHAINS.Holesky]: '0x27f793CE9306341a8F4Fd6cDadb0c9785D46978a',
  [CHAINS.Hoodi]: {
    actual: '0xfe56573178f1bcdf53F01A6E9977670dcBBD9186',
    test: '0x7cc545e36c7571782922b075c2976e938a0cda05',
  },
};

export const Voting: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x2e59A20f205bB85a89C53f1936454680651E618e',
  [CHAINS.Holesky]: '0xdA7d2573Df555002503F29aA4003e398d28cc00f',
  [CHAINS.Hoodi]: {
    actual: '0x49B3512c44891bef83F8967d075121Bd1b07a01B',
    test: '0x15379d72Ec5Ff5635F5148d6e0F4a4Dcf8756636',
  },
};

export const DualGovernance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xc1db28b3301331277e307fdcff8de28242a4486e',
  [CHAINS.Holesky]: '0x5A2958dC9532bAaCdF8481C8278735B1b05FB199',
  [CHAINS.Hoodi]: {
    test: '0x3Dec3C5Ef9C53234B55705DDC892b106A1C47bCa',
    actual: '0x9CAaCCc62c66d817CC59c44780D1b722359795bF',
  },
};

export const AdminExecutor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x23E0B465633FF5178808F4A75186E2F2F9537021',
  [CHAINS.Holesky]: '0x06a0256B6D9F913F342a2aeFfc6395949fEfE1C6',
  [CHAINS.Hoodi]: '0x0eCc17597D292271836691358B22340b78F3035B',
};

export const EmergencyProtectedTimelock: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xCE0425301C85c5Ea2A0873A2dEe44d78E02D2316',
  [CHAINS.Holesky]: '0xd70D836D60622D48648AA1dE759361D6B9a4Baa0',
  [CHAINS.Hoodi]: {
    test: '0xbcdD50FEAE9584308c12321b8A0f68Fe81EC04a8',
    actual: '0x0A5E22782C0Bd4AddF10D771f0bF0406B038282d',
  },
};

export const EmergencyExecutionCommitteeProposed: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xC7792b3F2B399bB0EdF53fECDceCeB97FBEB18AF',
  [CHAINS.Hoodi]: '0x8E1Ce8995E370222CbD825fFD7Dce2A5BfE1E631',
};

export const EmergencyActivationCommitteeProposed: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x8B7854488Fde088d686Ea672B6ba1A5242515f45',
  [CHAINS.Hoodi]: '0xA678c29cbFde2C74aF15C7724EE4b1527A50D45B',
};

export const EmergencyGovernance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x553337946F2FAb8911774b20025fa776B76a7CcE',
  [CHAINS.Holesky]: '0x1e43c35B1087e7f767Dc36E1E6783A3132497A41',
  [CHAINS.Hoodi]: '0x69E8e916c4A19F42C13C802abDF2767E1fB4F059',
};

export const EmergencyGovernanceProposed: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x553337946F2FAb8911774b20025fa776B76a7CcE',
  [CHAINS.Holesky]: '0x1e43c35B1087e7f767Dc36E1E6783A3132497A41',
  [CHAINS.Hoodi]: '0x69E8e916c4A19F42C13C802abDF2767E1fB4F059',
};

export const TiebreakerCoreCommittee: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xf65614d73952Be91ce0aE7Dd9cFf25Ba15bEE2f5',
  [CHAINS.Holesky]: '0x60778a94619374e24880b53175C6Be21CeffEB6a',
  [CHAINS.Hoodi]: '0x1648dF6CeA35eA413d6bF611aFd6eB9aFE21339A',
};

export const TieBreakerSubCommittee1: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3D3ba54D54bbFF40F2Dfa2A8e27bD4dE3dab2951',
  [CHAINS.Hoodi]: '0xEd27F0d08630685A0cEFb1040596Cb264cf79f14',
};

export const TieBreakerSubCommittee2: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDBfa0B8A15a503f25224fcA5F84a3853230A715C',
  [CHAINS.Hoodi]: '0xE3e3c67997A4Db7d47ac7fa8ef81B677daBe5794',
};

export const TieBreakerSubCommittee3: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xBF048f2111497B6Df5E062811f5fC422804D4baE',
  [CHAINS.Hoodi]: '0xF4F16CB3B9E7a076E55c508035f25E606913Cc9d',
};

export const EVMScriptExecutor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977',
  [CHAINS.Holesky]: '0x2819B65021E13CEEB9AC33E77DB32c7e64e7520D',
  [CHAINS.Hoodi]: '0x79a20FD0FA36453B2F45eAbab19bfef43575Ba9E',
};

export const DualGovernanceLaunchVerifier: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xd48c2fc419569537bb069bad2165dc0ceb160cec',
  [CHAINS.Hoodi]: '0x98FC7b149767302647D8e1dA1463F0051978826B',
};

export const DualGovernanceRolesValidator: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x31534e3aFE219B609da3715a00a1479D2A2d7981',
  [CHAINS.Hoodi]: '0x9CCe5BfAcDcf80DAd2287106b57197284DacaE3F',
};

export const DualGovernanceTimeConstraints: ChainAddressMap = {
  [CHAINS.Hoodi]: '0xB26Fd3b50280AbC55c572EE73071778A51088408',
  [CHAINS.Mainnet]: '0x2a30F5aC03187674553024296bed35Aa49749DDa',
};

export const DualGovernanceEscrow: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x165813A31446a98c84E20Dda8C101BB3C8228e1c',
  [CHAINS.Hoodi]: '0x5e2EE9DCBE8C9433F22Dd3c5EFDe0Af6DC293405',
};

export const DualGovernanceResealManager: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7914b5a1539b97Bd0bbd155757F25FD79A522d24',
  [CHAINS.Hoodi]: '0x05172CbCDb7307228F781436b327679e4DAE166B',
};

export const EVMScriptRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x853cc0D5917f49B57B8e9F89e491F5E18919093A',
};

export const AllowedTokensRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x4ac40c34f8992bb1e5e856a448792158022551ca',
  [CHAINS.Hoodi]: '0x40Db7E8047C487bD8359289272c717eA3C34D1D3',
};

export const InsuranceFund: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x8B3f33234ABD88493c0Cd28De33D583B70beDe35',
};

export const RewardProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3129c041b372ee93a5a8756dc4ec6f154d85bc9a',
};

export const ReferralPartnersRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xfCaD241D9D2A2766979A2de208E8210eDf7b7D4F',
};

export const DAI: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  [CHAINS.Holesky]: '0x2eb8e9198e647f80ccf62a5e291bcd4a5a3ca68c',
  [CHAINS.Hoodi]: '0x17fc691f6EF57D2CA719d30b8fe040123d4ee319',
};

export const AllowedRecipientRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xAa47c268e6b2D4ac7d7f7Ffb28A39484f5212c2A',
};

export const AllowedRecipientReferralDaiRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xa295C212B44a48D07746d70d32Aa6Ca9b09Fb846',
};

export const AllowedRecipientTrpLdoRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x231Ac69A1A37649C6B06a71Ab32DdD92158C80b8',
  [CHAINS.Holesky]: '0x5f4E9A917d6556dB91Cf351f49b0edCc5A255bAE',
};

export const LegoLDORegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x97615f72c3428A393d65A84A3ea6BBD9ad6C0D74',
  [CHAINS.Holesky]: '0x77CF728329920E4191a6Edd9b009cD055D3cD29A',
};

export const LegoStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb0FE4D300334461523D9d61AaD90D0494e1Abb43',
  [CHAINS.Holesky]: '0x10Ff9c02C65775379D9E20BFF9AC92Cbaf15Ab8F',
};

export const RccStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDc1A0C7849150f466F07d48b38eAA6cE99079f80',
  [CHAINS.Holesky]: '0x17Ab17290bcDbea381500525A58e16e29093523c',
};

export const PmlStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDFfCD3BF14796a62a804c1B16F877Cf7120379dB',
  [CHAINS.Holesky]: '0x580B23a97F827F2b6E51B3DEc270Ef522Ccf520c',
};

export const AtcStablesRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xe07305F43B11F230EaA951002F6a55a16419B707',
  [CHAINS.Holesky]: '0x37675423796D39C19351c5C322C3692b23a3d9bd',
};

export const GasFunderETHRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xCf46c4c7f936dF6aE12091ADB9897E3F2363f16F',
  [CHAINS.Holesky]: '0x0000000000000000000000000000000000000000',
};

export const StethRewardProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x48c4929630099b217136b64089E8543dB0E5163a',
  [CHAINS.Holesky]: '0x55B304a585D540421F1fD3579Ef12Abab7304492',
};

export const StethGasSupplyRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x49d1363016aA899bba09ae972a1BF200dDf8C55F',
  [CHAINS.Holesky]: '0x1B68a7BeE396e2eaAD9D2716E0A271A4BB568BCd',
};

export const RewardsShareProgramRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdc7300622948a7AdaF339783F6991F9cdDD79776',
  [CHAINS.Holesky]: '0xAc2F596191c75B77c2835Afe83c3a9097f0AC071',
};

export const SandboxStablesAllowedRecipientRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0xF8a63a36B954D72de197097377aa00C238c653Cf',
  [CHAINS.Hoodi]: '0xdf53b1cd4CFE43b6CdA3640Be0e4f1a45126ec61',
};

export const RccStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xAAC4FcE2c5d55D1152512fe5FAA94DB267EE4863',
  [CHAINS.Holesky]: '0x916B909300c4aB5ADC4247cebd840C9278683e78',
};

export const PmlStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7b9B8d00f807663d46Fb07F87d61B79884BC335B',
  [CHAINS.Holesky]: '0xC2Ec8a9285D111de54725FAD1AC6a3B7E3BC6225',
};

export const AtcStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xd3950eB3d7A9B0aBf8515922c0d35D13e85a2c91',
  [CHAINS.Holesky]: '0x955bA61676dAd6091Ff3F9BC498219D6DbD49107',
};

export const Stonks = {
  [CHAINS.Mainnet]: [
    '0x3e2D251275A92a8169A3B17A2C49016e2de492a7',
    '0xf4F6A03E3dbf0aA22083be80fDD340943d275Ea5',
    '0x7C2a1E25cA6D778eCaEBC8549371062487846aAF',
    '0x79f5E20996abE9f6a48AF6f9b13f1E55AED6f06D',
    '0x8Ba6D367D15Ebc52f3eBBdb4a8710948C0918d42',
    '0x281e6BB6F26A94250aCEb24396a8E4190726C97e',
    '0x64B6aF9A108dCdF470E48e4c0147127F26221A7C',
    '0x278f7B6CBB3Cc37374e6a40bDFEBfff08f65A5C7',
    '0x2B5a3944A654439379B206DE999639508bA2e850',
  ],
  [CHAINS.Holesky]: [
    '0x7949418C1C8a45b453114568fD3a5526100Eb0D9',
    '0x1939e7466c21703620F672D994ad1Df03d418B66',
    '0x28b91E39A7E67C473d7886BD1284231e99bE7939',
    '0x1305492Fd4677349Ca335EaD9127D2BDEAD7fd6f',
    '0xeFd6014CbE75D782Cd672e8A1a7bA6FCAB0572EC',
    '0x43E190221729c223B453d75ADC8548679EcC222a',
    '0x8f86792A0C1F1AecF87C5e4E2f01fCAF3E9360a0',
    '0xDCBC0AE0141aEdEec14e418a173A6b3fA3724AE4',
    '0x507D0971ffd5de64Ba1fb30Ee6Bb93376035DD00',
  ],
  [CHAINS.Hoodi]: [],
};

export const StonksStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x1a7cFA9EFB4D5BfFDE87B0FaEb1fC65d653868C0',
  [CHAINS.Holesky]: '0x4283839a5a92A3A6ed39E48cAD5e4c180b97800B',
};

export const StonksStablesAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3f0534CCcFb952470775C516DC2eff8396B8A368',
  [CHAINS.Holesky]: '0xDd553C1F88EDCFc2033141Cb908eFf9189988A90',
};

export const CSMVettedGate: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xB314D4A76C457c93150d308787939063F4Cc67E0',
  [CHAINS.Hoodi]: '0x10a254E724fe2b7f305F76f3F116a3969c53845f',
};

export const AllianceOpsAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3b525f4c059f246ca4aa995d21087204f30c9e2f',
  [CHAINS.Holesky]: '0xe1ba8dee84a4df8e99e495419365d979cdb19991',
};

export const EcosystemOpsStablesAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xDAdC4C36cD8F468A398C25d0D8aaf6A928B47Ab4',
  [CHAINS.Holesky]: '0x0214CEBDEc06dc2729382860603d01113F068388',
};

export const EcosystemOpsStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0x193d0bA65cf3a2726e12c5568c068D1B3ea51740',
};

export const LabsOpsStablesAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x68267f3D310E9f0FF53a37c141c90B738E1133c2',
  [CHAINS.Holesky]: '0x303F5b60e3cf6Ea11d8509A1546401e311A13B92',
};

export const LabsOpsStethAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0x02CD05c1cBa16113680648a8B3496A5aE312a935',
};

export const USDC: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [CHAINS.Holesky]: '0x9715b2786f1053294fc8952df923b95cab9aac42',
  [CHAINS.Hoodi]: '0x97bb030B93faF4684eAC76bA0bf3be5ec7140F36',
};

export const USDT: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  [CHAINS.Holesky]: '0x86f6c353a0965eb069cd7f4f91c1afef8c725551',
  [CHAINS.Hoodi]: '0x64f1904d1b419c6889BDf3238e31A138E258eA68',
};

export const SDVTRegistry: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xaE7B191A31f627b4eB1d4DaC64eaB9976995b433',
  [CHAINS.Holesky]: '0x11a93807078f8BB880c1BD0ee4C387537de4b4b6',
  [CHAINS.Hoodi]: '0x0B5236BECA68004DB89434462DfC3BB074d2c830',
};

export const SandboxAllowedRecipientsRegistry: ChainAddressMap = {
  [CHAINS.Hoodi]: '0x7E33f2192c2cEC339493B9193110BC0510d6CBD2',
};

export const VaultsAdapter: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x28F9Ac198C4E0FA6A9Ad2c2f97CB38F1A3120f27',
  [CHAINS.Hoodi]: '0x854CF0D7446Faa7AdDFE557cc8aa9FA9b7017910',
};

export const VaultHub: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x1d201BE093d847f6446530Efb0E8Fb426d176709',
  [CHAINS.Hoodi]: '0x4C9fFC325392090F789255b9948Ab1659b797964',
};

export const OperatorGrid: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xC69685E89Cefc327b43B7234AC646451B27c544d',
  [CHAINS.Hoodi]: '0x501e678182bB5dF3f733281521D3f3D1aDe69917',
};
