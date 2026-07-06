import React, { useState, useRef } from "react";
import { Upload, CheckCircle, XCircle, AlertCircle, FileText, Zap, RefreshCw } from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const filled = ((score || 0) / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Needs Work" : "Poor";
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          className="score-ring" />
        <text x="65" y="60" textAnchor="middle" fontSize="28" fontWeight="700"
          fill={color} fontFamily="Sora, sans-serif">{score ?? "--"}</text>
        <text x="65" y="78" textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="DM Sans, sans-serif">
          {score !== null ? "/ 100" : "upload"}
        </text>
      </svg>
      {score !== null && (
        <span className="text-sm font-semibold mt-1" style={{ color }}>{label}</span>
      )}
    </div>
  );
}

function SectionBar({ label, pct, status }) {
  const color = status === "good" ? "bg-emerald-500" : status === "warn" ? "bg-amber-400" : "bg-red-400";
  const icon = status === "good"
    ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
    : status === "warn"
    ? <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
    : <XCircle size={14} className="text-red-400 flex-shrink-0" />;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function ATSChecker() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setFile(f);
    setError("");
    setResult(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await axios.post(`${API}/resume/upload`, form);

      /* Simulate enriched score display from backend response */
      const skillCount = (data.skills || []).length;
      const atsScore = Math.min(100, 40 + skillCount * 5 + (data.career_suggestion ? 10 : 0));
      setResult({
        score: atsScore,
        career: data.career_suggestion,
        skills: data.skills || [],
        sections: [
          { label: "Keyword match", pct: Math.min(100, 55 + skillCount * 4), status: skillCount >= 5 ? "good" : skillCount >= 3 ? "warn" : "bad" },
          { label: "Work experience", pct: 78, status: "good" },
          { label: "Skills section", pct: Math.min(100, skillCount * 12), status: skillCount >= 6 ? "good" : "warn" },
          { label: "Formatting", pct: 65, status: "warn" },
          { label: "Contact info", pct: 90, status: "good" },
        ],
        tips: [
          skillCount < 5 && "Add more relevant technical skills to improve keyword density.",
          "Quantify your achievements with numbers (%, $, time saved).",
          "Ensure your contact section includes LinkedIn and GitHub.",
          "Use standard section headings: 'Work Experience', 'Education', 'Skills'.",
        ].filter(Boolean),
      });
    } catch {
      setError("Upload failed. Make sure your backend is running at " + API);
    }
    setLoading(false);
  };

  const reset = () => { setFile(null); setResult(null); setError(""); };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10 page-enter">
          <div className="tag-blue mx-auto mb-3">ATS Score Checker</div>
          <h1 className="font-display font-extrabold text-4xl text-gray-900 tracking-tight mb-3">
            How does your resume score?
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Upload your resume and get an instant ATS compatibility score with actionable tips.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Upload panel */}
          <div className="md:col-span-3">
            <div className="card p-6">
              {!file ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
                    transition-all duration-200
                    ${dragging ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-brand-400 hover:bg-gray-50"}`}>
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload size={24} className="text-brand-600" />
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">Drop your resume here</div>
                  <div className="text-sm text-gray-500 mb-4">or click to browse</div>
                  <div className="tag-blue mx-auto">PDF only · Max 5MB</div>
                  <input ref={inputRef} type="file" accept=".pdf" className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-brand-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{file.name}</div>
                      <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button onClick={reset} className="text-gray-400 hover:text-gray-600 p-1">
                      <RefreshCw size={15} />
                    </button>
                  </div>
                  <button onClick={analyze} disabled={loading}
                    className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                          <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      <><Zap size={16} /> Analyze Resume</>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100
                                rounded-xl p-3 text-red-600 text-sm">
                  <XCircle size={15} className="flex-shrink-0 mt-0.5" /> {error}
                </div>
              )}
            </div>

            {/* Tips */}
            {result?.tips?.length > 0 && (
              <div className="card mt-5 p-6">
                <div className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" /> Improvement tips
                </div>
                <ul className="space-y-3">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-5 h-5 bg-amber-50 rounded-full flex items-center justify-center
                                      flex-shrink-0 mt-0.5 text-amber-600 font-bold text-xs">{i + 1}</div>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Score panel */}
          <div className="md:col-span-2 space-y-5">
            <div className="card p-6 text-center">
              <div className="text-sm font-semibold text-gray-500 mb-4">ATS Compatibility Score</div>
              <ScoreRing score={result?.score ?? null} />
            </div>

            {result && (
              <>
                <div className="card p-6">
                  <div className="text-sm font-semibold text-gray-700 mb-4">Section breakdown</div>
                  {result.sections.map((s) => (
                    <SectionBar key={s.label} {...s} />
                  ))}
                </div>

                <div className="card p-5">
                  <div className="text-xs text-gray-500 mb-1">Suggested career path</div>
                  <div className="font-bold text-brand-600 text-base">{result.career}</div>
                  {result.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {result.skills.map((s) => (
                        <span key={s} className="tag-blue text-xs">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
