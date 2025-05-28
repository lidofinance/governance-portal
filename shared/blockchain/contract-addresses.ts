import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { ChainAddressMap } from './types';

export const GovernanceToken: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
  [CHAINS.Holesky]: '0x14ae7daeecdf57034f3E9db8564e46Dba8D97344',
  [CHAINS.Hoodi]: '0xEf2573966D009CcEA0Fc74451dee2193564198dc',
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
  [CHAINS.Mainnet]: '0x710b3303fb508a84f10793c1106e32be873c24cd',
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
  [CHAINS.Mainnet]: '0x9305c1Dbfe22c12c66339184C0025d7006f0f1cC',
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
  [CHAINS.Mainnet]: '0xD15a672319Cf0352560eE76d9e89eAB0889046D3',
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

export const DepositSecurityModuleV2: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xffa96d84def2ea035c7ab153d8b991128e3d72fd',
};

export const OracleReportSanityCheckerV2: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x6232397ebac4f5772e53285b26c47914e9461e75',
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

export const CSVerifier: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x3Dfc50f22aCA652a0a6F28a0F892ab62074b5583',
  [CHAINS.Holesky]: '0x6FDAA094227CF8E1593f9fB9C1b867C1f846F916',
  [CHAINS.Hoodi]: '0xB6bafBD970a4537077dE59cebE33081d794513d6',
};

export const SandboxNodeOperatorsRegistry: ChainAddressMap = {
  [CHAINS.Holesky]: '0xD6C2ce3BB8bea2832496Ac8b5144819719f343AC',
  [CHAINS.Hoodi]: '0x682E94d2630846a503BDeE8b6810DF71C9806891',
};

export const StETH: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  [CHAINS.Holesky]: '0x7a955618ff2ad00d58e5c38205bc1f0b33bc5494',
  [CHAINS.Hoodi]: '0x3508A952176b3c15387C97BE809eaffB1982176a',
};

export const WstETH: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  [CHAINS.Holesky]: '0x67b3c1e122ff0b778c9dedc1de2fb0f451aa12c8',
  [CHAINS.Hoodi]: '0x7E99eE3C66636DE415D2d7C880938F2f40f94De4',
};

export const WithdrawalQueue: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
  [CHAINS.Holesky]: '0x27f793CE9306341a8F4Fd6cDadb0c9785D46978a',
  [CHAINS.Hoodi]: '0x7cc545e36c7571782922b075c2976e938a0cda05',
};

export const Voting: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x2e59A20f205bB85a89C53f1936454680651E618e',
  [CHAINS.Holesky]: '0xdA7d2573Df555002503F29aA4003e398d28cc00f',
  [CHAINS.Hoodi]: '0x49B3512c44891bef83F8967d075121Bd1b07a01B',
};

export const DualGovernance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xcdF49b058D606AD34c5789FD8c3BF8B3E54bA2db',
  [CHAINS.Holesky]: '0x5A2958dC9532bAaCdF8481C8278735B1b05FB199',
  [CHAINS.Hoodi]: '0x4d12b9f6aCAB54FF6a3a776BA3b8724D9B77845F',
};

export const AdminExecutor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x23E0B465633FF5178808F4A75186E2F2F9537021',
  [CHAINS.Holesky]: '0x06a0256B6D9F913F342a2aeFfc6395949fEfE1C6',
  [CHAINS.Hoodi]: '0x8ef12c8bB0f544e4741cC594d07739e670c37959',
};

export const EmergencyProtectedTimelock: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xCE0425301C85c5Ea2A0873A2dEe44d78E02D2316',
  [CHAINS.Holesky]: '0xd70D836D60622D48648AA1dE759361D6B9a4Baa0',
  [CHAINS.Hoodi]: '0x0A5E22782C0Bd4AddF10D771f0bF0406B038282d',
};

export const EmergencyExecutionCommittee: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x0000000000000000000000000000000000000000',
  [CHAINS.Hoodi]: '0x8E1Ce8995E370222CbD825fFD7Dce2A5BfE1E631',
};

export const EmergencyActivationCommittee: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x0000000000000000000000000000000000000000',
  [CHAINS.Hoodi]: '0xA678c29cbFde2C74aF15C7724EE4b1527A50D45B',
};

export const EmergencyGovernance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x553337946F2FAb8911774b20025fa776B76a7CcE',
  [CHAINS.Holesky]: '0x1e43c35B1087e7f767Dc36E1E6783A3132497A41',
  [CHAINS.Hoodi]: '0x69E8e916c4A19F42C13C802abDF2767E1fB4F059',
};

export const EmergencyTimelockedGovernance: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x0000000000000000000000000000000000000000',
  [CHAINS.Holesky]: '0x2D99B1Fe6AFA9d102C7125908081414b5C3Cc759',
  [CHAINS.Hoodi]: '0x69E8e916c4A19F42C13C802abDF2767E1fB4F059',
};

export const ResealManager: ChainAddressMap = {
  [CHAINS.Holesky]: '0x3c752Ad7e079FbcCC337f72C7Fd1DEFd06F1De5D',
  [CHAINS.Hoodi]: '0x758f8625E8e79B3Aec176126c63e617af511171F',
};

export const TiebreakerCoreCommittee: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x175742c3DDD88B0192df3EcF98f180A79cb259D0',
  [CHAINS.Holesky]: '0x60778a94619374e24880b53175C6Be21CeffEB6a',
  [CHAINS.Hoodi]: '0x1648dF6CeA35eA413d6bF611aFd6eB9aFE21339A',
};

export const TieBreakerSubCommittee1: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x74836470337Ba5d2a92fe16E44AD862E28fcf9B3',
  [CHAINS.Hoodi]: '0x32F9CA8B1621E5AC2E38e1b8715633DE237F58Db',
};

export const TieBreakerSubCommittee2: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb9d82E1A49f6a66E8a07260BA05Cf9Ac8a938B1C',
  [CHAINS.Hoodi]: '0x2Dd5D6216843D456dc33CAF241031e37eA3C9c5f',
};

export const TieBreakerSubCommittee3: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7dAdae4e1a0DB43F6bcfA75295666fc044605679',
  [CHAINS.Hoodi]: '0x7aDD2cFf6D61D0496d1E2Aa3C4089e126ef88D74',
};

export const EVMScriptExecutor: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xFE5986E06210aC1eCC1aDCafc0cc7f8D63B3F977',
  [CHAINS.Hoodi]: '0x79a20FD0FA36453B2F45eAbab19bfef43575Ba9E',
};

export const DualGovernanceLaunchVerifier: ChainAddressMap = {
  [CHAINS.Hoodi]: '0x98FC7b149767302647D8e1dA1463F0051978826B',
};

export const DualGovernanceRolesValidator: ChainAddressMap = {
  [CHAINS.Hoodi]: '0x9CCe5BfAcDcf80DAd2287106b57197284DacaE3F',
};

export const DualGovernanceTimeConstraints: ChainAddressMap = {
  [CHAINS.Hoodi]: '0xB26Fd3b50280AbC55c572EE73071778A51088408',
  [CHAINS.Mainnet]: '0x2a30F5aC03187674553024296bed35Aa49749DDa',
};

export const EscrowMasterCopy: ChainAddressMap = {
  [CHAINS.Mainnet]: '0xb84317C0E142D8911A0d69Dc32c48d87753B8d1C',
  [CHAINS.Hoodi]: '0xD82Ea63b6196dbd100a1067341EEC8aec9eEd4Af',
};

export const DualGovernanceResealManager: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x7914b5a1539b97Bd0bbd155757F25FD79A522d24',
  [CHAINS.Hoodi]: '0x05172CbCDb7307228F781436b327679e4DAE166B',
};

export const DualGovernanceTieBreakerCore: ChainAddressMap = {
  [CHAINS.Mainnet]: '0x175742c3DDD88B0192df3EcF98f180A79cb259D0',
  [CHAINS.Hoodi]: '0x1648dF6CeA35eA413d6bF611aFd6eB9aFE21339A',
};
