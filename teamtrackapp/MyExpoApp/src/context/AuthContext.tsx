import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  jwtToken: string | null;
  userInfo: any;
  setJwtToken: (token: string | null) => void;
  setUserInfo: (info: any) => void;
}

export const AuthContext = createContext<AuthContextType>({
  jwtToken: null,
  userInfo: null,
  setJwtToken: () => {},
  setUserInfo: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ jwtToken, userInfo, setJwtToken, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
