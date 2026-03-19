// context/AppProvider.tsx
'use client'

import { AppProvider } from "./AppContext";
import { ProduccionProvider } from "./AppContextProducc";
import { PrendasProvider } from "./PrendasContext";


export const AppProviderPrincipal = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProvider>
      <ProduccionProvider>
        <PrendasProvider>
            {children}
        </PrendasProvider>
      </ProduccionProvider>
    </AppProvider>
       
  );
};
