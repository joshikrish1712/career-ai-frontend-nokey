import React, { useState } from "react";
import { X, Eye, EyeOff, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
