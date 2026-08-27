import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/ui/AuthLayout";
import Field from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import { registerSchema } from "../../validation/auth.Schema";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setErrors({
        form: err.response?.data?.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start tracking your ledgers in minutes">
      <form onSubmit={handleSubmit} noValidate>
        <Field
          label="Full name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Jordan Blake"
        />
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
          placeholder="At least 8 characters"
        />

        {errors.form && (
          <p className="text-error text-sm mb-4 -mt-2">{errors.form}</p>
        )}

        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="text-ink-soft text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-ledger font-medium hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;