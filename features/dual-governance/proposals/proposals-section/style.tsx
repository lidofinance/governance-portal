import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';
import { InputNumber } from 'shared/components/input-number/input-number';
import { devicesHeaderMedia } from 'styles/global';

export const ProposalsWrapper = styled.section`
  margin-top: 116px;
  align-items: flex-start;
  width: 100%;
`;

export const ProposalsTitle = styled.h1`
  font-size: 34px;
  color: var(--primary-color-black);
  font-weight: 500;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
`;

export const ProposalsDisclaimer = styled(Text)`
  margin-top: 18px;
  color: var(--primary-color-black-50);
  font-size: 15px;
`;

export const StyledSearchInput = styled(InputNumber)`
  width: 100%;
  span {
    border-radius: 40px;
    background-color: transparent;
    border-color: var(--border-color-fog);
  }
`;

export const SearchInputWrapper = styled.div`
  width: 100%;
  flex-shrink: 1.5;
`;

export const ProposalsDisclaimerWrapper = styled.section`
  display: flex;
  align-items: center;
  width: 100%;

  @media ${devicesHeaderMedia.tablet} {
    flex-direction: column;
    gap: 20px;
  }
`;
