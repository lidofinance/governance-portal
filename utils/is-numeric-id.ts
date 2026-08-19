// Route ids are numeric. Anything else reaches the page title and meta tags,
// so it has to be rejected before a page renders it.
export const isNumericId = (value: unknown): value is string =>
  typeof value === 'string' && /^\d+$/.test(value);
