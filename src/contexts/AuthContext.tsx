import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { User, UserRole } from '../types';
import { CURRENT_NETWORK } from '../constants';

interface AuthContextType {
  isAuthenticated: boolean;
  userData: User | null;
  login: () => void;
  logout: () => void;
  userSession: UserSession;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  userData: null,
  login: () => {},
  logout: () => {},
  userSession: new UserSession({
    appConfig: new AppConfig(['store_write', 'publish_data']),
  }),
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [userSession] = useState<UserSession>(defaultAuthContext.userSession);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setIsAuthenticated(true);
      
      // In a real app, you would fetch the user's role from your API/smart contract
      // For now, we'll assign a role based on the last character of the address
      const address = userData.profile.stxAddress[CURRENT_NETWORK];
      const lastChar = address.charAt(address.length - 1);
      
      let role: UserRole;
      switch (lastChar) {
        case '1':
          role = UserRole.Manufacturer;
          break;
        case '2':
          role = UserRole.Shipper;
          break;
        case '3':
          role = UserRole.Retailer;
          break;
        case '4':
          role = UserRole.Consumer;
          break;
        case '5':
          role = UserRole.Admin;
          break;
        default:
          role = UserRole.Consumer;
      }
      
      setUserData({
        address,
        role,
      });
    }
  }, [userSession]);

  const login = () => {
    const network = CURRENT_NETWORK === 'mainnet' 
      ? new StacksMainnet() 
      : new StacksTestnet();
    
    showConnect({
      appDetails: {
        name: 'ChainTrack',
        icon: window.location.origin + '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
      network,
    });
  };

  const logout = () => {
    userSession.signUserOut('/');
    setIsAuthenticated(false);
    setUserData(null);
  };

  const value = {
    isAuthenticated,
    userData,
    login,
    logout,
    userSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}