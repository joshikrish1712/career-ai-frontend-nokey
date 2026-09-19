import React, { useState } from "react";
import { X, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { googleLoginApi } from "../utils/api";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function AuthModal({ onClose, defaultTab = "login" }) {
  const { login } = useAuth();
  const [tab, setTab]         = useState(defaultTab); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState("");
  const [success, setSuccess]  = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setError(""); };

  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = tokenResponse.access_token || tokenResponse.credential;
      const res = await googleLoginApi(token);
      const data = res.data;

      login(data.access_token, { name: data.user_name, email: data.user_email });
      setSuccess(`Welcome, ${data.user_name}!`);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setError(err.response?.data?.detail || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("Google Sign-In failed or was cancelled."),
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
    const body = tab === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      login(data.access_token, { name: data.user_name, email: data.user_email });
      setSuccess(tab === "login" ? `Welcome back, ${data.user_name}!` : `Account created! Welcome, ${data.user_name}!`);
      setTimeout(() => onClose(), 1000);
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    }
    setLoading(false);
  };

  // Close on backdrop click
  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onBackdrop}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center
                     justify-center text-gray-500 hover:bg-gray-200 transition-colors duration-150">
          <X size={15} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Sparkles size={16} color="white" />
          </div>
          <span className="font-display font-bold text-xl text-brand-600">CareerAI</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {["login", "register"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); setSuccess(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {t === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => googleLogin()}
          disabled={loading}
          className="w-full flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150 shadow-sm disabled:opacity-60"
        >
          <svg className="w-5 h-5 mr-3 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
            OR
          </span>
        </div>

        <form onSubmit={submit}>
          {tab === "register" && (
            <div className="mb-4">
              <label className="label">Full name</label>
              <input className="input-field" placeholder="Arjun Kumar"
                value={form.name} onChange={set("name")} required />
            </div>
          )}

          <div className="mb-4">
            <label className="label">Email address</label>
            <input className="input-field" type="email" placeholder="you@email.com"
              value={form.email} onChange={set("email")} required />
          </div>

          <div className="mb-6">
            <label className="label">Password</label>
            <div className="relative">
              <input className="input-field pr-10"
                type={showPass ? "text" : "password"}
                placeholder={tab === "register" ? "Min. 8 characters" : "Your password"}
                value={form.password} onChange={set("password")} required
                minLength={tab === "register" ? 8 : 1} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-100
                            rounded-xl p-3 text-red-600 text-sm">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-100
                            rounded-xl p-3 text-emerald-700 text-sm">
              <CheckCircle size={15} /> {success}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center py-3.5 text-base font-semibold
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 4px 14px rgba(27,79,216,0.3)" }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {tab === "login" ? "Logging in..." : "Creating account..."}
              </span>
            ) : (
              tab === "login" ? "Log in" : "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setTab(tab === "login" ? "register" : "login"); setError(""); }}
            className="text-brand-600 font-medium hover:text-brand-700">
            {tab === "login" ? "Sign up free" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
