import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Role, useGetUserQuery } from "@/graphql/generated/graphql";
import { jwtDecode } from "jwt-decode";
import "./NavBar.scss";

type JwtPayload = { sub: string; exp: number };

export const NavBar: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // derive userId from token (optional; for ADMIN menu)
  const userId = (() => {
    if (!token) return null;
    try {
      const { sub } = jwtDecode<JwtPayload>(token);
      const id = Number(sub);
      return Number.isFinite(id) ? id : null;
    } catch { return null; }
  })();

  const { data } = useGetUserQuery({
    variables: userId ? { id: userId } as any : ({} as any),
    skip: !userId,
    fetchPolicy: "cache-first",
  });

  const roles: readonly Role[] = (data?.user?.roles ?? []).filter((r): r is Role => r != null);
  const isAdmin = roles.includes(Role.Admin);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // give collapse an id and bind the toggler correctly
  const collapseId = "mainNavbarCollapse";

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          {/* Brand */}
          <NavLink to="/about" className="navbar-brand">
            VideoMeta
          </NavLink>

          {/* Toggler (visible on < lg) */}
          <button
              className="navbar-toggler"
              type="button"
              aria-controls={collapseId}
              aria-expanded={open}
              aria-label="Toggle navigation"
              onClick={() => setOpen(s => !s)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Collapsible content */}
          <div id={collapseId} className={` navbar-collapse ${open ? "show" : ""}`}>
            {/* Left items */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}
                    onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                    to="/videos"
                    end
                    className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}
                    onClick={() => setOpen(false)}
                >
                  Videos
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                    to="/videos/import"
                    end
                    className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}
                    onClick={() => setOpen(false)}
                >
                  Import
                </NavLink>
              </li>

              {isAdmin && (
                  <li className="nav-item">
                    <NavLink
                        to="/users"
                        className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}
                        onClick={() => setOpen(false)}
                    >
                      Users
                    </NavLink>
                  </li>
              )}
            </ul>

            {/* Right actions */}
            <div className="d-flex align-items-center gap-2">
              {token && (
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
};
