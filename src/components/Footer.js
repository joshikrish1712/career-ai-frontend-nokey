import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
                <Sparkles size={15} color="white" />
              </div>
              <span className="font-display font-bold text-white text-lg">CareerAI</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-5">
              AI-powered tools to help you land your next job — faster.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center
                             hover:bg-gray-700 transition-colors duration-150">
                  <Icon size={14} color="#9CA3AF" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <div className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Product</div>
            {[
              { label: "ATS Checker", to: "/ats-checker" },
              { label: "Resume Builder", to: "/builder" },
              { label: "Cover Letter", to: "/cover-letter" },
              { label: "Dashboard", to: "/dashboard" },
            ].map((l) => (
              <Link key={l.to} to={l.to}
                className="block text-sm py-1.5 hover:text-gray-200 transition-colors duration-150">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Resources</div>
            {["Resume Tips", "Career Blog", "Interview Prep", "Salary Guide"].map((l) => (
              <a key={l} href="#"
                className="block text-sm py-1.5 hover:text-gray-200 transition-colors duration-150">
                {l}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <div className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Company</div>
            {["About Us", "Privacy Policy", "Terms of Service", "Contact"].map((l) => (
              <a key={l} href="#"
                className="block text-sm py-1.5 hover:text-gray-200 transition-colors duration-150">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2025 CareerAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
