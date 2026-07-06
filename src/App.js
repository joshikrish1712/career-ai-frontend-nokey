import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import ATSChecker from "./pages/ATSChecker";
import CoverLetter from "./pages/CoverLetter";
import ResumeBuilder from "./pages/ResumeBuilder";
import Dashboard from "./pages/Dashboard";
import JobMatch from "./pages/JobMatch";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"             element={<LandingPage />} />
              <Route path="/ats-checker"  element={<ATSChecker />} />
              <Route path="/cover-letter" element={<CoverLetter />} />
              <Route path="/builder"      element={<ResumeBuilder />} />
              <Route path="/builder/:id"  element={<ResumeBuilder />} />
              <Route path="/job-match"    element={<JobMatch />} />
              <Route path="/dashboard"    element={<Dashboard />} />
              <Route path="*"             element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
