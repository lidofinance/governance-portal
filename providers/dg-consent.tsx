import { ReactNode, createContext, useContext, useState } from 'react';

const ConsentContext = createContext({
  isConsentGiven: false,
  giveConsent: () => {},
});

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [isConsentGiven, setConsentGiven] = useState(false);

  const giveConsent = () => setConsentGiven(true);

  return (
    <ConsentContext.Provider value={{ isConsentGiven, giveConsent }}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsentContext = () => {
  return useContext(ConsentContext);
};
