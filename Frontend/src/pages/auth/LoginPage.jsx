import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/ui/AuthLayout";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { loginSchema } from "../../validation/auth.Schema";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return; // stops here — API is never called on invalid input
    }

    setLoading(true);
    setErrors({});
    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Invalid credentials. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your LedgerFlow account">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@company.com"
        />
        <Field
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        {errors.form && (
          <p className="text-error text-sm mb-4 -mt-2">{errors.form}</p>
        )}

        <Button type="submit" loading={loading}>
          Log in
        </Button>
      </form>

      <p className="text-ink-soft text-sm text-center mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-ledger font-medium hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;