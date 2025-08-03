import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ImportSinglePage from './pages/ImportSinglePage';
import ImportChannelPage from './pages/ImportChannelPage';
import VideoListPage from './pages/VideoListPage';
import UserListPage from './pages/UserListPage';
import UserEditPage from './pages/UserEditPage';

const RequireAuth = ({ children, roles }: { children: JSX.Element; roles?: string[] }) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    // Optional: decode token with jwt-decode and enforce roles here
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<RequireAuth><DashboardPage/></RequireAuth>} />
                    <Route path="/videos/import" element={<RequireAuth><ImportSinglePage/></RequireAuth>} />
                    <Route path="/videos/import/channel" element={<RequireAuth><ImportChannelPage/></RequireAuth>} />
                    <Route path="/videos" element={<RequireAuth><VideoListPage/></RequireAuth>} />
                    <Route path="/users" element={<RequireAuth roles={['ADMIN']}><UserListPage/></RequireAuth>} />
                    <Route path="/users/:id" element={<RequireAuth roles={['ADMIN']}><UserEditPage/></RequireAuth>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
