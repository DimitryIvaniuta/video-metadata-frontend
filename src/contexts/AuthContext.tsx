import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Shape of your JWT payload:
interface JwtPayload {
    exp: number;    // expiration (seconds since epoch)
    sub: string;    // user ID
}

// Public context interface:
interface AuthContextType {
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwtToken'));
    const logoutTimer = useRef<number | undefined>(undefined);

    // Clears any pending auto-logout
    const clearLogoutTimer = () => {
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
        }
    };

    // Schedule auto-logout exactly at token expiration
    const scheduleAutoLogout = useCallback((jwt: string) => {
        try {
            const { exp } = jwtDecode<JwtPayload>(jwt);
            const msUntilExpiry = exp * 1000 - Date.now();
            if (msUntilExpiry <= 0) {
                logout();
            } else {
                logoutTimer.current = window.setTimeout(() => {
                    logout();
                }, msUntilExpiry);
            }
        } catch {
            logout();
        }
    }, []);

    // On mount and whenever token changes: validate & schedule
    useEffect(() => {
        clearLogoutTimer();
        if (token) {
            scheduleAutoLogout(token);
        }
        return clearLogoutTimer;
    }, [token, scheduleAutoLogout]);

    // Core login: POST /api/auth/login → { token }
    const login = async (username: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            credentials: 'include', // carry refresh cookie
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) throw new Error('Login failed');
        const { token: jwt } = await res.json();
        localStorage.setItem('jwtToken', jwt);
        setToken(jwt);
        navigate('/', { replace: true });
    };

    // Clear session
    const logout = () => {
        clearLogoutTimer();
        localStorage.removeItem('jwtToken');
        setToken(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{
            token,
            login,
            logout,
            isAuthenticated: Boolean(token)
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
