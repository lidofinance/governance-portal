import styled from 'styled-components';
import { FilterCategory } from '@easy-track/motion-categories';

// mirrors the badge text color of each category variant
const FILTER_CATEGORY_FILL_COLOR_MAP: Record<FilterCategory, string> = {
  Staking: '#175cd3',
  Treasury: '#087c72',
  stVaults: '#a85600',
  'MEV Boost': '#b4238a',
};

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;

  & > p {
    margin-right: 8px;
  }
`;

export const CategoryButton = styled.button<{
  $isActive: boolean;
  $category?: FilterCategory;
}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid var(--lido-color-border);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  background-color: var(--lido-color-foreground);
  color: var(--primary-color-black);
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;

  ${({ $isActive, $category }) =>
    $isActive &&
    `
      background-color: ${
        $category
          ? FILTER_CATEGORY_FILL_COLOR_MAP[$category]
          : 'var(--lido-color-primary)'
      };
      border-color: transparent;
      color: #ffffff;
      ${$category ? 'padding-left: 4px;' : ''}
    `}

  & svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
`;
