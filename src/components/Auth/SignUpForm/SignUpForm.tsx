import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMutation,
  useSignUpMutation,
} from "@/graphql/generated/graphql";
import { useAuth } from "@/contexts/AuthContext";

interface FormState {
  username: string;
  email: string;
  password: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  server?: string;
}

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [signUp, { loading: signUpLoading, error: signUpError }] =
    useSignUpMutation();
  const [loginMut, { loading: loginLoading, error: loginError }] =
    useLoginMutation();

  // If already logged in, redirect to import cabinet
  useEffect(() => {
    if (token) {
      navigate("/videos/import", { replace: true });
    }
  }, [token, navigate]);

  // Form state
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined, server: undefined }));
  };

  // Basic validations
  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!values.username.trim()) {
      errs.username = "Username is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Must be a valid email";
    }
    if (values.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // client-side validation
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    try {
      // 1) Create user
      const { data: signupData, errors: signupGQLErrors } = await signUp({
        variables: { input: form },
      });
      if (signupGQLErrors?.length) {
        setErrors({ server: signupGQLErrors[0].message });
        return;
      }

      // 2) Log them in
      const { data: loginData, errors: loginGQLErrors } = await loginMut({
        variables: { username: form.username, password: form.password },
      });
      if (loginGQLErrors?.length) {
        setErrors({ server: loginGQLErrors[0].message });
        return;
      }
      const jwt = loginData?.login?.token;
      if (!jwt) {
        setErrors({ server: "Login failed after signup" });
        return;
      }

      // 3) Persist token & redirect
      localStorage.setItem("jwtToken", jwt);
      navigate("/videos/import", { replace: true });
    } catch (err: any) {
      setErrors({ server: err.message || "Signup failed" });
    }
  };

  const isLoading = signUpLoading || loginLoading;
  const serverError =
    errors.server ?? signUpError?.message ?? loginError?.message;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.username ? "border-danger" : "border-gray-300"
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-danger">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.email ? "border-danger" : "border-gray-300"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? "border-danger" : "border-gray-300"
              }`}
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-danger">{errors.password}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <p className="text-center text-sm text-danger">{serverError}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center h-12 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {isLoading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};
