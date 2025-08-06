// src/pages/LoginPage.tsx
import React, { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface FormState {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  server?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // Local form state & errors
  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Handle field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined, server: undefined }));
  };

  // Basic client-side validation
  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!values.username.trim()) errs.username = "Username is required";
    if (!values.password) errs.password = "Password is required";
    return errs;
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 1) Validate
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    // 2) Attempt login via context
    setLoading(true);
    try {
      await login(form.username, form.password);
      // AuthContext.login() will store token, schedule auto-logout & redirect to '/'
    } catch (err: any) {
      setErrors({ server: err.message || "Login failed" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-fit bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-[500px] bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={`w-full h-12 px-4 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.username ? "border-danger" : "border-gray-300"
              }`}
              style={{ height: 40, padding: "10px 4px" }}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-danger">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginTop: "1rem" }}>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full h-12 px-4 border rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-orange-500
                        ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              style={{ height: 40, padding: "10px 4px" }}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger">{errors.password}</p>
            )}
          </div>

          {/* Server Error */}
          {errors.server && (
            <p className="text-center text-sm text-danger">{errors.server}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            style={{marginTop: 20}}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
