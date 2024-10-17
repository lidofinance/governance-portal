import { useCallback, useState } from 'react';
import { Link, Text } from '@lidofinance/lido-ui';
import { BigNumber } from 'ethers';
import { ReactComponent as StethIcon } from 'assets/icons/tokens/steth.svg';
import { ReactComponent as WstethIcon } from 'assets/icons/tokens/wsteth.svg';
import { ReactComponent as UnstethIcon } from 'assets/icons/tokens/unsteth.svg';
import { Tabs, Tab } from 'shared/components/tabs';

import {
  TabContentWrapper,
  FormWrapper,
  TokenWrapper,
  SummaryRow,
  ActionButton,
  ActionsWrapper,
} from './style';

import { StyledInput } from '../../style';
import { NftMultiselect } from '../../nft/nft-multiselect';

export const SupportForm = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const handleInputChange = useCallback((e: any) => {
    console.log(e);
  }, []);

  return (
    <FormWrapper>
      <Text style={{ marginBottom: '24px' }}>
        Select a token to add to the VetoSignaling <Link>contract</Link>
      </Text>
      <Tabs>
        <Tab isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
          <TabContentWrapper>
            <TokenWrapper>
              <StethIcon />
              <Text size="md" strong>
                stETH
              </Text>
            </TokenWrapper>
            <Text size="sm" color="secondary">
              1,000,000
            </Text>
          </TabContentWrapper>
        </Tab>
        <Tab isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
          <TabContentWrapper>
            <TokenWrapper>
              <WstethIcon />
              <Text size="md" strong>
                wstETH
              </Text>
            </TokenWrapper>
            <Text size="sm" color="secondary">
              9.740782
            </Text>
          </TabContentWrapper>
        </Tab>
        <Tab isActive={activeTab === 2} onClick={() => setActiveTab(2)}>
          <TabContentWrapper>
            <TokenWrapper>
              <UnstethIcon />
              <Text size="md" strong>
                unstETH
              </Text>
            </TokenWrapper>
            <Text size="sm" color="secondary">
              9.740782
            </Text>
          </TabContentWrapper>
        </Tab>
      </Tabs>
      {activeTab === 0 && (
        <>
          <StyledInput
            onChange={handleInputChange}
            maxValue={BigNumber.from(10000)}
            fullwidth
            disabled={false}
            placeholder="Enter your amount of stETH"
          />
          <SummaryRow>
            <Text size="sm" color="secondary">
              Percent of total stETH supply
            </Text>
            <Text size="sm" color="secondary">
              0.31%
            </Text>
          </SummaryRow>
          <SummaryRow>
            <Text size="sm" color="secondary">
              Max transaction cost
            </Text>
            <Text size="sm" color="secondary">
              0.000212 ETH ($10.62)
            </Text>
          </SummaryRow>
        </>
      )}
      {activeTab === 1 && (
        <>
          <StyledInput
            onChange={handleInputChange}
            maxValue={BigNumber.from(10000)}
            fullwidth
            disabled={false}
            placeholder="Enter your amount of wstETH"
          />
        </>
      )}
      {activeTab === 2 && (
        <>
          <NftMultiselect></NftMultiselect>
        </>
      )}
      <ActionsWrapper>
        <ActionButton>Support Veto</ActionButton>
      </ActionsWrapper>
    </FormWrapper>
  );
};
