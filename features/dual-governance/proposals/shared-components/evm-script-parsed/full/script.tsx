import { useState, useMemo } from 'react';

import { Loader } from '@lidofinance/lido-ui';
import {
  Tabs,
  Tab,
  VoteScriptBodyWrap,
  ScriptLoaderWrap,
} from 'features/dual-governance/proposals/shared-components/evm-script-parsed/full/style';
import { ScriptBody } from 'features/dual-governance/proposals/shared-components/evm-script-parsed/full/script-body';
import { useDecodedScript } from 'shared/hooks';

type Props = {
  script: string;
  metadata?: string;
};

export const Script = ({ script, metadata = '' }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const { initialLoading, binary, decoded } = useDecodedScript(script);

  const tabs = useMemo(() => {
    const tabMap = {
      Parsed: !initialLoading && decoded?.calls.length,
      JSON: !initialLoading && decoded?.calls.length,
      Raw: true,
      Items: Boolean(metadata),
    };
    const TabNames = Object.keys(tabMap) as (keyof typeof tabMap)[];
    return TabNames.filter((key) => tabMap[key]);
  }, [decoded?.calls.length, initialLoading, metadata]);

  return (
    <>
      <Tabs>
        {tabs.map((tab, i) => (
          <Tab
            key={tab}
            isActive={activeTab === i}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      <VoteScriptBodyWrap>
        {initialLoading && (
          <ScriptLoaderWrap>
            <Loader size="medium" />
          </ScriptLoaderWrap>
        )}

        {tabs[activeTab] === 'Raw' && <ScriptBody binary={binary} />}

        {tabs[activeTab] === 'JSON' && (
          <ScriptBody binary={JSON.stringify(decoded, null, 2)} />
        )}

        {tabs[activeTab] === 'Parsed' && (
          <ScriptBody binary={binary} decoded={decoded} />
        )}
        {tabs[activeTab] === 'Items' && <ScriptBody binary={metadata} />}
      </VoteScriptBodyWrap>
    </>
  );
};
