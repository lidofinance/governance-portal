// TODO: path + basePath
export const HOME_PATH = '/';
export const SETTINGS_PATH = '/settings';
export const PROPOSALS_PATH = '/proposals';

// Vote paths
export const VOTE_PATH = '/vote';
export const VOTE_DASHBOARD_INDEX_PATH = `${VOTE_PATH}/dashboard`;
export const voteDashboardPage = (page: string | number) =>
  `${VOTE_DASHBOARD_INDEX_PATH}/${page}`;

export const votePage = (voteId: string | number) => `${VOTE_PATH}/${voteId}`;
