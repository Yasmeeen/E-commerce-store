'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type StoreConfig = {
  storeName: string;
  logo?: string;
  primaryColor: string;
  whatsappNumber?: string;
  heroMediaType?: 'image' | 'video';
  heroMediaUrl?: string;
};

const defaultConfig: StoreConfig = {
  storeName: 'My Store',
  primaryColor: '#0f172a',
};

const StoreConfigContext = createContext<StoreConfig>(defaultConfig);

export function StoreConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);

  useEffect(() => {
    fetch('/api/store-config')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => data && setConfig({ ...defaultConfig, ...data }))
      .catch(() => {});
  }, []);

  return (
    <StoreConfigContext.Provider value={config}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  return useContext(StoreConfigContext);
}
