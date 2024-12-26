import { VerticalTab, VerticalTabsWrapper } from './style';
import { useEffect, useState } from 'react';

type Tab = {
  id: number;
  label: string;
};

type Props = {
  tabs: Tab[];
  onTabChange: (id: number) => void;
  hasBorder?: boolean;
  borderSide?: 'left' | 'right';
};

export const VerticalTabs = ({
  tabs,
  onTabChange,
  hasBorder,
  borderSide,
}: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id || 0);

  const handleTabChange = (id: number) => {
    setActiveTab(id);
    onTabChange(id);
  };

  useEffect(() => {
    onTabChange(activeTab);
  }, []);

  return (
    <VerticalTabsWrapper $hasGap={hasBorder}>
      {tabs.map(({ id, label }) => (
        <VerticalTab
          $active={activeTab === id}
          $hasBorder={hasBorder}
          $borderSide={borderSide}
          key={id}
          onClick={() => handleTabChange(id)}
        >
          {label}
        </VerticalTab>
      ))}
    </VerticalTabsWrapper>
  );
};
