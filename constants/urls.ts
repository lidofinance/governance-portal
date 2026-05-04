// TODO: path + basePath
export const HOME_PATH = '/';
export const SETTINGS_PATH = '/settings';

// DG paths
export const PROPOSALS_PATH = '/dg/proposals';
export const GOVERNANCE_PATH = '/dg';

// Vote paths
export const VOTE_PATH = '/vote';
export const VOTE_DASHBOARD_INDEX_PATH = `${VOTE_PATH}/dashboard`;
export const voteDashboardPage = (page: string | number) =>
  `${VOTE_DASHBOARD_INDEX_PATH}/${page}`;

export const votePage = (voteId: string | number) => `${VOTE_PATH}/${voteId}`;

export const VOTE_DELEGATION_PATH = `${VOTE_PATH}/delegation`;
export const VOTE_DELEGATORS_PATH = `${VOTE_DELEGATION_PATH}/delegators`;

// ET paths

export const EASY_TRACK_PATH = '/easy-track';
export const EASY_TRACK__MOTIONS_PATH = `${EASY_TRACK_PATH}/motions`;
export const EASY_TRACK__START_MOTION_PATH = `${EASY_TRACK_PATH}/start-motion`;
export const motionPage = (motionId: string) =>
  `${EASY_TRACK_PATH}/motions/${motionId}`;

// Stonks paths
export const STONKS_PATH = '/stonks';
export const STONKS_CREATE_ORDER_PATH = `${STONKS_PATH}/create-order`;
export const STONKS_MANAGE_ORDER_PATH = `${STONKS_PATH}/manage-order`;
export const stonksOrderPage = (orderAddress: string) =>
  `${STONKS_PATH}/orders/${orderAddress}`;
export const stonksInstancePage = (stonksAddress: string) =>
  `${STONKS_PATH}/${stonksAddress}`;

export const CALLDATA_DECODER_PATH = '/calldata-decoder';
