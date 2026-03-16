import styled from 'styled-components';
import { MotionDisplayStatus } from '../types';
import { MOTION_STATUS_COLOR_MAP } from '@easy-track/constants';

export const Wrap = styled.div<{ $displayStatus: MotionDisplayStatus }>`
  color: ${({ $displayStatus }) => MOTION_STATUS_COLOR_MAP[$displayStatus]};
`;

export const Title = styled.div`
  margin-bottom: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
`;

export const Value = styled.div`
  font-weight: 800;
  font-size: 36px;
  line-height: 44px;
  text-transform: uppercase;
`;

export const Subvalue = styled(Value)`
  opacity: 0.6;
`;
