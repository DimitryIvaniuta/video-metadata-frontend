import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useRef,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/graphql/generated/graphql';

// Shape of the JWT payload we care about
interface JwtPayload { exp: number; sub: string; }

interface AuthContextType {
    token: string | null;
    login: (u: string, p: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwtToken'));
    const logoutTimer = useRef<number>(6000);
    const navigate = useNavigate();
    const [loginMutation] = useLoginMutation();

    // Schedule auto‐logout at token expiry
    useEffect(() => {
        clearTimeout(logoutTimer.current);
        if (token) {
            try {
                const { exp } = jwtDecode<JwtPayload>(token);
                const ms = exp * 1000 - Date.now();
                if (ms > 0) {
                    logoutTimer.current = window.setTimeout(() => logout(), ms);
                } else {
                    logout();
                }
            } catch {
                logout();
            }
        }
        return () => clearTimeout(logoutTimer.current);
    }, [token]);

    const login = async (username: string, password: string) => {
        const { data, errors } = await loginMutation({
            variables: { username, password },
        });
        if (errors || !data?.login?.token) {
            throw new Error(errors?.[0].message || 'Login failed');
        }
        localStorage.setItem('jwtToken', data.login.token);
        setToken(data.login.token);
        navigate('/', { replace: true });
    };

    const logout = () => {
        clearTimeout(logoutTimer.current);
        localStorage.removeItem('jwtToken');
        setToken(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
