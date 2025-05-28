// TODO: path + basePath
export const HOME_PATH = '/';
export const SETTINGS_PATH = '/settings';
export const PROPOSALS_PATH = '/proposals';

export const getPathWithoutFirstSlash = (path: string): string => {
  if (path.length === 0 || path[0] !== '/') return path;

  return path.slice(1, path.length);
};
