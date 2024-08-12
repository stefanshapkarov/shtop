import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser,loginUser, registerUser, logout  } from '../services/api';

interface AuthContextType {
  user: any; // Replace `any` with a more specific type if available
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the current user on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string, rememberMe?: boolean) => {
        try {
            const userData = await loginUser(email, password, rememberMe || false);
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    
    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
            const userData = await registerUser(name, email, password, password_confirmation);
            setUser(userData);//diskutabilno
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading ? children : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '24px',
                    color: '#555',
                }}>
                    Loading...
                </div>
            )}
        </AuthContext.Provider>
    );
};

// Hook for easier access to the AuthContext
export const useAuth = () => useContext(AuthContext);
