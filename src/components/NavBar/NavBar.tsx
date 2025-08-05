import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const NavBar: React.FC = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();         // clears token & navigates to /login
        // if you prefer a dedicated logout route, you could:
        // logout(); navigate('/login', { replace: true });
    };

    return (
        <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
            <div className="flex space-x-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-primary font-semibold'
                            : 'text-gray-600 hover:text-primary'
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/videos"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-primary font-semibold'
                            : 'text-gray-600 hover:text-primary'
                    }
                >
                    Videos
                </NavLink>
                <NavLink
                    to="/videos/import"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-primary font-semibold'
                            : 'text-gray-600 hover:text-primary'
                    }
                >
                    Import
                </NavLink>
                {/* Only show “Users” if ADMIN */}
                {/* You can decode token or use your user data here */}
                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        isActive
                            ? 'text-primary font-semibold'
                            : 'text-gray-600 hover:text-primary'
                    }
                >
                    Users
                </NavLink>
            </div>
            <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
            >
                Logout
            </button>
        </nav>
    );
}
