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

    // Login function (using existing API function)
    const login = async (email: string, password: string, rememberMe?: boolean) => {
        try {
            const userData = await loginUser(email, password, rememberMe || false);
            setUser(userData); // Update the user state after login
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    // Register function (using existing API function)
    const register = async (name: string, email: string, password: string, password_confirmation: string) => {
        try {
            const userData = await registerUser(name, email, password, password_confirmation);
            setUser(userData); // Update the user state after registration
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    // Logout function (using existing API function)
    const logout = async () => {
        try {
            await logout();
            setUser(null); // Clear the user state on logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

// Hook for easier access to the AuthContext
export const useAuth = () => useContext(AuthContext);
