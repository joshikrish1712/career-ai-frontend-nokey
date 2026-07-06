import React, { useState } from "react";
import { Target, CheckCircle, XCircle, AlertCircle, Loader, Upload, FileText } from "lucide-react";
import { jobMatchAnalysis } from "../utils/api";

function ScoreGauge({ score }) {
  const r     = 54;
  const circ  = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color  = score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
  const label  = score >= 75 ? "Strong match" : score >= 50 ? "Partial match" : "Weak match";
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10"/>
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round" className="score-ring"/>
        <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700"
          fill={color} fontFamily="Sora,sans-serif">{score}</text>
        <text x="65" y="78" textAnchor="middle" fontSize="10" fill="#9CA3AF"
          fontFamily="DM Sans,sans-serif">/ 100</text>
      </svg>
      <span className="text-sm font-semibold mt-1" style={{ color }}>{label}</span>
    </div>
  );
}

export default function JobMatch() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc,    setJobDesc]    = useState("");
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const analyze = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      setError("Please paste both your resume text and the job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const { data } = await jobMatchAnalysis({ resume_text: resumeText, job_description: jobDesc });
      setResult(data);
    } catch (err) {
      const msg = err.response?.data?.detail || "";
      if (msg.includes("ANTHROPIC_API_KEY")) {
        setError("AI features require an ANTHROPIC_API_KEY in your backend .env file.");
      } else {
        setError("Analysis failed. Make sure the backend is running.");
      }
    }
    setLoading(false);
  };

  const fillExample = () => {
    setResumeText(`Arjun Kumar | arjun@email.com | +91 98765 43210 | Ahmedabad
Software Engineer with 4 years experience.

EXPERIENCE
Software Engineer, Infosys (2022–Present)
- Built REST APIs using FastAPI and Python
- Reduced response time by 40% through caching
- Led team of 3 engineers

SKILLS
Python, React, FastAPI, SQL, Docker, Git`);
    setJobDesc(`Senior Software Engineer – Swiggy

We are looking for a Senior Software Engineer with:
- 4+ years of experience in Python and React
- Strong knowledge of REST APIs and microservices
- Experience with Docker, Kubernetes, and CI/CD
- PostgreSQL and Redis experience
- System design skills
- Agile/Scrum experience`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 page-enter">
          <div className="tag-blue mx-auto mb-3 inline-flex">Job Match Scorer</div>
          <h1 className="font-display font-extrabold text-4xl text-gray-900 tracking-tight mb-3">
            How well does your resume match?
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Paste your resume and a job description — AI will score the match, find keyword gaps, and suggest improvements.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Resume input */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-display font-bold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-brand-600"/> Your Resume
              </div>
              <button onClick={fillExample}
                className="text-xs text-brand-600 font-medium border border-brand-200
                           hover:border-brand-300 px-3 py-1.5 rounded-full transition-colors">
                Try example
              </button>
            </div>
            <textarea className="input-field text-sm" rows={12}
              placeholder="Paste your resume text here...&#10;&#10;Name, contact info, work experience, skills, education..."
              value={resumeText} onChange={e => { setResumeText(e.target.value); setError(""); }}/>
            <div className="text-xs text-gray-400 mt-2 text-right">
              {resumeText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          {/* JD input */}
          <div className="card p-6">
            <div className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={16} className="text-emerald-600"/> Job Description
            </div>
            <textarea className="input-field text-sm" rows={12}
              placeholder="Paste the job description here...&#10;&#10;Requirements, responsibilities, preferred qualifications..."
              value={jobDesc} onChange={e => { setJobDesc(e.target.value); setError(""); }}/>
            <div className="text-xs text-gray-400 mt-2 text-right">
              {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-100
                          rounded-xl p-4 text-red-600 text-sm max-w-2xl mx-auto">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5"/> {error}
          </div>
        )}

        <div className="flex justify-center mb-8">
          <button onClick={analyze} disabled={loading}
            className="btn-primary px-10 py-3.5 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ boxShadow: "0 4px 20px rgba(27,79,216,0.35)" }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader size={18} className="animate-spin"/> Analyzing with AI…
              </span>
            ) : (
              <><Target size={18}/> Analyze Match</>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="grid md:grid-cols-3 gap-6 page-enter">

            {/* Score */}
            <div className="card p-6 text-center">
              <div className="text-sm font-semibold text-gray-500 mb-4">Match Score</div>
              <ScoreGauge score={result.match_score}/>
            </div>

            {/* Keywords */}
            <div className="card p-6">
              <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <CheckCircle size={15} className="text-emerald-500"/> Matched Keywords
                <span className="ml-auto tag-green">{result.matched_keywords.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.matched_keywords.length > 0 ? result.matched_keywords.map(k => (
                  <span key={k} className="tag-green text-xs">{k}</span>
                )) : (
                  <span className="text-xs text-gray-400">No strong matches found</span>
                )}
              </div>

              <div className="font-semibold text-gray-900 mt-5 mb-3 flex items-center gap-2 text-sm">
                <XCircle size={15} className="text-red-400"/> Missing Keywords
                <span className="ml-auto tag-red">{result.missing_keywords.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_keywords.length > 0 ? result.missing_keywords.map(k => (
                  <span key={k} className="tag-red text-xs">{k}</span>
                )) : (
                  <span className="text-xs text-gray-400">Great — no critical gaps!</span>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="card p-6">
              <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <AlertCircle size={15} className="text-amber-500"/> AI Suggestions
              </div>
              <ul className="space-y-3">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="w-5 h-5 bg-amber-50 border border-amber-200 rounded-full flex items-center
                                     justify-center text-amber-600 font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
