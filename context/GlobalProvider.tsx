import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser } from '../lib/appwrite';

export interface UserProps {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    fullName: string;
}

export interface GlobalContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: UserProps | null;
    setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
    isLoading: boolean;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
      throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};

const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<UserProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    const userData: UserProps = {
                        id: res.$id,
                        name: res.name,
                        avatarUrl: res.avatar,
                        email: res.email,
                        fullName: res.fullName,
                    };
                    setIsLoggedIn(true);
                    setUser(userData);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                theme,
                setTheme,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;