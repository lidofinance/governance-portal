import {
  MOTION_CATEGORY_VARIANT_MAP,
  MOTION_TAGS,
  MotionCategory,
} from '@easy-track/motion-categories';
import { MotionType } from '@easy-track/motion-types';
import { BadgeVariant } from 'shared/components/badge';

export const getMotionCategoryTags = (
  motionType: MotionType | 'EvmUnrecognized',
): { text: string; isSubCategory: boolean; variant: BadgeVariant }[] => {
  const tags = MOTION_TAGS[motionType];
  const variant = MOTION_CATEGORY_VARIANT_MAP[tags[0] as MotionCategory];

  return MOTION_TAGS[motionType].map((tag, index) => ({
    text: tag,
    variant,
    isSubCategory: index > 0,
  }));
};
