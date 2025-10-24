import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { NavBar } from "./components/NavBar";
import { LoginPage } from "./components/Auth/LoginPage";
import { SignUpForm } from "./components/Auth/SignUpForm";
import { DashboardPage } from "./components/DashboardPage";
import { ImportSinglePage } from "@/components/Videos";
import { ImportChannelPage } from "@/components/Videos";
import { VideoListPage } from "@/components/Videos";
import { UserListPage } from "./components/Users/UserListPage";
import { UserEditPage } from "./components/Users/UserEditPage";
import {AutoCompleteApplication} from "@/components/Pipeline/DebounceInput/AutoCompleteApplication";
import CurrencyConverter from "@/components/Pipeline/CurrencyConverter/CurrencyConverter";
import LiveRates from "@/components/Pipeline/LiveRates/LiveRates";

const RequireAuth = ({ roles }: { roles?: string[] }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default function App() {
  return (
    <div>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpForm />} />

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
            <Route path="pipeline/debouncedinput" element={<AutoCompleteApplication />} />
            <Route path="pipeline/currencyConverter" element={<CurrencyConverter />} />
            <Route path="pipeline/liveRates" element={<LiveRates />} />
            <Route
              path="videos/import/channel"
              element={<ImportChannelPage />}
            />

            {/* Admin only */}
            <Route element={<RequireAuth roles={["ADMIN"]} />}>
              <Route path="users" element={<UserListPage />} />
              <Route path="users/:id" element={<UserEditPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
