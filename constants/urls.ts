// TODO: path + basePath
export const HOME_PATH = '/';
export const SETTINGS_PATH = '/settings';

// DG paths
export const PROPOSALS_PATH = '/governance/proposals';
export const GOVERNANCE_PATH = '/governance';

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
export const EASY_TRACK__MOTIONS_PATH = '/easy-track/active-motions';
export const motionPage = (motionId: string) =>
  `/easy-track/motions/${motionId}`;
