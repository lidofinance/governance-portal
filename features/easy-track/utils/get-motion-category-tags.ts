import {
  MOTION_CATEGORY_VARIANT_MAP,
  MOTION_TAGS,
} from '@easy-track/motion-categories';
import { EvmUnrecognized } from '@easy-track/evm-addresses';
import { MotionType } from '@easy-track/motion-types';
import { BadgeVariant } from 'shared/components/badge';

export const getMotionCategoryTags = (
  motionType: MotionType | EvmUnrecognized,
): { text: string; isSubCategory: boolean; variant: BadgeVariant }[] => {
  const tags = MOTION_TAGS[motionType];
  const variant = MOTION_CATEGORY_VARIANT_MAP[tags[0]];

  return tags.map((tag, index) => ({
    text: tag,
    variant,
    isSubCategory: index > 0,
  }));
};
