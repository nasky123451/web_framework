import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

type Mode = 'standard' | 'assistant';

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<Mode>('standard');

  // 從 cookie 讀取
  useEffect(() => {
    const savedMode = Cookies.get('app_mode') as Mode | undefined;
    if (savedMode === 'standard' || savedMode === 'assistant') {
      setModeState(savedMode);
    }
  }, []);

  // 設定 mode 並同步寫 cookie
  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    Cookies.set('app_mode', newMode, { expires: 365 });
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
