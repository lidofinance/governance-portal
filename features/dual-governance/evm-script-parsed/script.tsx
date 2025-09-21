import { useState, useMemo } from 'react';
import {
  Tabs,
  Tab,
  VoteScriptBodyWrap,
} from 'features/dual-governance/evm-script-parsed/style';
import { ScriptBody } from 'features/dual-governance/evm-script-parsed/script-body';
import { DecodedCall } from 'utils/decode-evm-script-calls';

type Props = {
  decodedCalls: DecodedCall[];
  description?: string;
};

export const Script = ({ decodedCalls, description }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(() => {
    const tabMap = {
      Parsed: decodedCalls.length,
      JSON: decodedCalls.length,
      ...(description ? { Description: description } : {}),
    };
    const TabNames = Object.keys(tabMap) as (keyof typeof tabMap)[];
    return TabNames.filter((key) => tabMap[key]);
  }, [decodedCalls.length, description]);

  return (
    <>
      <Tabs>
        {tabs.map((tab, i) => (
          <Tab
            key={tab}
            $isActive={activeTab === i}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      <VoteScriptBodyWrap>
        {tabs[activeTab] === 'JSON' && (
          <ScriptBody binary={JSON.stringify(decodedCalls, null, 2)} />
        )}

        {tabs[activeTab] === 'Parsed' && <ScriptBody calls={decodedCalls} />}
        {tabs[activeTab] === 'Description' && (
          <ScriptBody>{description}</ScriptBody>
        )}
      </VoteScriptBodyWrap>
    </>
  );
};
