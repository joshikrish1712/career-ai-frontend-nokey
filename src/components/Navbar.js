import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const navLinks = [
  { label: "ATS Checker", to: "/ats-checker" },
  { label: "Resume Builder", to: "/builder" },
  { label: "Cover Letter", to: "/cover-letter" },
  { label: "Job Match", to: "/job-match" },
  { label: "Dashboard", to: "/dashboard" },
];

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [authModal, setAuthModal] = useState(null); // "login" | "register" | null
  const [userMenu, setUserMenu]   = useState(false);
  const userMenuRef               = useRef(null);
  const location                  = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const baseNav = isHome && !scrolled
    ? "absolute top-0 left-0 right-0 z-50 bg-transparent"
    : "sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm";

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <>
      <nav className={`${baseNav} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center
                            group-hover:bg-brand-700 transition-colors duration-200">
              <Sparkles size={15} color="white" />
            </div>
            <span className={`font-display font-bold text-lg tracking-tight
              ${isHome && !scrolled ? "text-white" : "text-brand-600"}`}>
              CareerAI
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              const textColor = isHome && !scrolled
                ? active ? "text-white font-semibold" : "text-white/80 hover:text-white"
                : active ? "text-brand-600 font-semibold" : "text-gray-600 hover:text-gray-900";
              return (
                <Link 
                key={link.to} 
                to={link.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-150 ${textColor}
                  ${active && !(isHome && !scrolled)
                      ? "bg-brand-50"
                      : isHome && !scrolled
                      ? "hover:bg-white/10"
                      : "hover:bg-gray-50"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              /* User avatar + dropdown */
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenu(!userMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors duration-150
                    ${isHome && !scrolled ? "hover:bg-white/15" : "hover:bg-gray-100"}`}>
                  <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center
                                  font-bold text-white text-xs font-display">
                    {initials}
                  </div>
                  <span className={`text-sm font-medium ${isHome && !scrolled ? "text-white" : "text-gray-700"}`}>
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={isHome && !scrolled ? "text-white/70" : "text-gray-400"} />
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-2xl
                                  shadow-xl py-2 w-52 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                      <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                    </div>
                    <Link to="/dashboard" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-gray-50 transition-colors duration-150">
                      <LayoutDashboard size={15} className="text-gray-400" /> Dashboard
                    </Link>
                    <Link to="/builder" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                                 hover:bg-gray-50 transition-colors duration-150">
                      <User size={15} className="text-gray-400" /> My Resumes
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => { logout(); setUserMenu(false); }}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500
                                   hover:bg-red-50 w-full transition-colors duration-150">
                        <LogOut size={15} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setAuthModal("login")}
                  className={`text-sm font-medium transition-colors duration-150
                    ${isHome && !scrolled ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  Log in
                </button>
                <button onClick={() => setAuthModal("register")}
                  className="btn-primary text-sm px-5 py-2.5"
                  style={{ boxShadow: "0 4px 14px rgba(27,79,216,0.35)" }}>
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg" onClick={() => setOpen(!open)}>
            {open
              ? <X size={20} color={isHome && !scrolled ? "white" : "#374151"} />
              : <Menu size={20} color={isHome && !scrolled ? "white" : "#374151"} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 shadow-lg">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`block px-3 py-2.5 rounded-xl text-sm font-medium mb-1
                  ${location.pathname === link.to ? "bg-brand-50 text-brand-600" : "text-gray-700 hover:bg-gray-50"}`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-2">
              {isLoggedIn ? (
                <div>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center
                                    font-bold text-white text-xs">{initials}</div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                      <div className="text-xs text-gray-400">{user?.email}</div>
                    </div>
                  </div>
                  <button onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-500
                               hover:bg-red-50 rounded-xl transition-colors duration-150">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => { setAuthModal("login"); setOpen(false); }}
                    className="btn-secondary flex-1 justify-center text-sm py-2.5">
                    Log in
                  </button>
                  <button onClick={() => { setAuthModal("register"); setOpen(false); }}
                    className="btn-primary flex-1 justify-center text-sm py-2.5">
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal defaultTab={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
