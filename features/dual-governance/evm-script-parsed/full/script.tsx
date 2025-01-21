import { useState, useMemo } from 'react';
import {
  Tabs,
  Tab,
  VoteScriptBodyWrap,
} from 'features/dual-governance/evm-script-parsed/full/style';
import { ScriptBody } from 'features/dual-governance/evm-script-parsed/full/script-body';
import { decodeCalls } from 'features/dual-governance/evm-script-parsed/utils/decode-calls';
import { useLidoSDK } from 'providers/lido-sdk';
import { SubmitProposalCall } from 'features/dual-governance/proposals/types';

type Props = {
  rawCalls: SubmitProposalCall[];
  description?: string;
};

export const Script = ({ rawCalls, description }: Props) => {
  const { chainId } = useLidoSDK();
  const decodedCalls = decodeCalls({
    calls: rawCalls,
    chainId,
  });

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
            isActive={activeTab === i}
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
