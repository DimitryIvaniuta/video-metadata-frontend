import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { NavBar } from './components/NavBar';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { DashboardPage } from './components/DashboardPage';
import { ImportSinglePage } from './components/ImportSinglePage';
import { ImportChannelPage } from './components/ImportChannelPage';
import { VideoListPage } from './components/VideoListPage';
import { UserListPage } from './components/UserListPage';
import { UserEditPage } from './components/UserEditPage';

const RequireAuth = ({ roles }: { roles?: string[] }) => {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    return <Outlet />;
};

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected */}
            <Route element={<RequireAuth />}>
                {/* Layout with Navbar */}
                <Route
                    element={
                        <>
                            <NavBar />
                            <main className="p-6">
                                <Outlet />
                            </main>
                        </>
                    }
                >
                    {/* If `/` and logged in → dashboard */}
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="videos" element={<VideoListPage />} />
                    <Route path="videos/import" element={<ImportSinglePage />} />
                    <Route path="videos/import/channel" element={<ImportChannelPage />} />

                    {/* Admin only */}
                    <Route element={<RequireAuth roles={['ADMIN']} />}>
                        <Route path="users" element={<UserListPage />} />
                        <Route path="users/:id" element={<UserEditPage />} />
                    </Route>
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
