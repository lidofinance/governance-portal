import { useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Layout } from 'shared/components';
import { getDefaultStaticProps } from 'utils-api/get-default-static-props';
import { Text } from 'shared/components/text';
import { Motions, MotionsSkeleton } from '@easy-track/motions';
import { Button } from 'shared/components/button';
import { EASY_TRACK__START_MOTION_PATH } from 'constants/urls';
import Link from 'next/link';
import { MotionCategoryFilter } from '@easy-track/motion-category-filter';
import {
  FILTER_CATEGORIES,
  FilterCategory,
} from '@easy-track/motion-categories';

const Title = styled.div`
  height: 48px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const parseQueryCategories = (raw: string | string[] | undefined) => {
  if (typeof raw !== 'string') {
    return [];
  }

  return raw
    .split(',')
    .filter((item): item is FilterCategory =>
      FILTER_CATEGORIES.includes(item as FilterCategory),
    );
};

const MotionsPage = () => {
  const router = useRouter();

  const categories = useMemo(
    () => parseQueryCategories(router.query.categories),
    [router.query.categories],
  );

  const handleCategoriesChange = (next: FilterCategory[]) => {
    const { categories: _, ...query } = router.query;

    void router.replace(
      {
        query:
          next.length > 0 ? { ...query, categories: next.join(',') } : query,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Layout containerSize="full" metaTitle="Easy Track">
      <Title>
        <Text size={26} weight={700}>
          All motions
        </Text>
        <Link href={EASY_TRACK__START_MOTION_PATH}>
          <Button variant="outlined" size="sm" buttonStyleVersion="default">
            Start Motion
          </Button>
        </Link>
      </Title>
      <MotionCategoryFilter
        selected={categories}
        onChange={handleCategoriesChange}
      />
      {router.isReady ? (
        <Motions categories={categories} />
      ) : (
        <MotionsSkeleton />
      )}
    </Layout>
  );
};

export const getStaticProps = getDefaultStaticProps();

export default MotionsPage;
