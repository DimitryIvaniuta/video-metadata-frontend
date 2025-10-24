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

  useEffect(() => {
    if (token) navigate("/", { replace: true });
  }, [token, navigate]);

  const [form, setForm] = useState<FormState>({ username: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined, server: undefined }));
  };

  const validate = (values: FormState): FormErrors => {
    const errs: FormErrors = {};
    if (!values.username.trim()) errs.username = "Username is required";
    if (!values.password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      // redirect happens in AuthContext
    } catch (err: any) {
      setErrors({ server: err?.message || "Login failed" });
      setLoading(false);
    }
  };

  const uInvalid = Boolean(errors.username);
  const pInvalid = Boolean(errors.password);

  return (
      <div className="min-vh-100 d-flex align-items-start pt-4 pt-md-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4 p-sm-5">
                  <h1 className="h3 text-center mb-4  fw-bold">Sign In</h1>

                  {errors.server && (
                      <div className="alert alert-danger" role="alert">
                        {errors.server}
                      </div>
                  )}

                  <form noValidate onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label fw-bold">
                        Username
                      </label>
                      <input
                          id="username"
                          name="username"
                          type="text"
                          className={`form-control ${uInvalid ? "is-invalid" : ""}`}
                          placeholder="Enter your username"
                          value={form.username}
                          onChange={handleChange}
                          aria-invalid={uInvalid || undefined}
                          autoComplete="username"
                      />
                      {uInvalid && (
                          <div className="invalid-feedback">{errors.username}</div>
                      )}
                    </div>

                    {/* Password + toggle */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-bold">
                        Password
                      </label>
                      <div className="input-group">
                        <input
                            id="password"
                            name="password"
                            type={showPwd ? "text" : "password"}
                            className={`form-control ${pInvalid ? "is-invalid" : ""}`}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            aria-invalid={pInvalid || undefined}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPwd((s) => !s)}
                            aria-label={showPwd ? "Hide password" : "Show password"}
                            tabIndex={-1}
                        >
                          {showPwd ? "Hide" : "Show"}
                        </button>
                        {pInvalid && (
                            <div className="invalid-feedback d-block">
                              {errors.password}
                            </div>
                        )}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                      {loading ? (
                          <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        />
                            Signing in…
                          </>
                      ) : (
                          "Sign In"
                      )}
                    </button>

                    {/* Optional: small helper */}
                    <p className="text-muted text-center mt-3 mb-0" style={{fontSize: ".9rem"}}>
                      You’ll be redirected after a successful sign-in.
                    </p>
                  </form>
                </div>
              </div>

              {/* Footer / brand line */}
              <div className="text-center text-muted mt-3" style={{fontSize: ".85rem"}}>
                © {new Date().getFullYear()} VideoMeta
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
