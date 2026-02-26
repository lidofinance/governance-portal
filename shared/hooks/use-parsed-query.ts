import { useRouter } from 'next/router';

export const useParsedQuery = (queryKey: string): (string | undefined)[] => {
  const router = useRouter();

  const queryValue = router.query[queryKey];

  if (typeof queryValue === 'string') {
    return [queryValue];
  }

  if (Array.isArray(queryValue)) {
    return queryValue;
  }

  return [undefined];
};
