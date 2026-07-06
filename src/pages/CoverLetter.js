import React, { useState } from "react";
import { Sparkles, Copy, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

const TONES = ["Professional", "Confident", "Enthusiastic", "Formal", "Conversational", "Concise"];

function buildPrompt(f, tone) {
  return `Write a ${tone.toLowerCase()} cover letter for the following applicant:\n\nName: ${f.name}\nCurrent role: ${f.role || "Not specified"}\nApplying for: ${f.jobTitle} at ${f.company}\nYears of experience: ${f.years || "Not specified"}\nKey skills: ${f.skills || "Not specified"}\n${f.jd ? "Job description:\n" + f.jd : ""}\n\nInstructions:\n- Write a complete, ready-to-send cover letter (3-4 paragraphs)\n- Start with "Dear Hiring Manager,"\n- Tone: ${tone}\n- Tailor to the job description if provided\n- End with "Sincerely,\n${f.name}"\n- Return ONLY the letter text, no preamble`;
}

export default function CoverLetter() {
  const [form, setForm] = useState({ name: "", role: "", jobTitle: "", company: "", skills: "", years: "", jd: "" });
  const [tone, setTone] = useState("Professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const generate = async () => {
    if (!form.name || !form.jobTitle || !form.company) { setError("Please fill in your name, job title, and company name."); return; }
    setLoading(true); setError(""); setLetter("");
    try {
      const res = await fetch("http://127.0.0.1:8000/cover-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          job_title: form.jobTitle,
          company: form.company,
          skills: form.skills,
          years: form.years,
          job_description: form.jd,
          tone: tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to generate cover letter");
        setLoading(false);
        return;
      }
      setLetter(data.letter || "");
    } catch { setError("Network error. Check your connection and try again."); }
    setLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(letter).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  const fillExample = () => setForm({ name: "Arjun Kumar", role: "Software Engineer", jobTitle: "Senior Frontend Developer", company: "Swiggy", skills: "React, TypeScript, system design", years: "4", jd: "Looking for a Senior Frontend Developer with 4+ years of React and TypeScript experience to lead feature implementation and mentor junior developers." });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 page-enter">
          <div className="tag-green mx-auto mb-3 inline-flex">Cover Letter Generator</div>
          <h1 className="font-display font-extrabold text-4xl text-gray-900 tracking-tight mb-3">Tailored cover letters in seconds</h1>
          <p className="text-gray-500 max-w-lg mx-auto">Fill in your details, paste the job description, and get a professional cover letter instantly.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="card p-7">
            <div className="flex items-center justify-between mb-6">
              <div className="font-display font-bold text-gray-900">Your details</div>
              <button onClick={fillExample} className="text-xs text-brand-600 font-medium border border-brand-200 hover:border-brand-300 px-3 py-1.5 rounded-full transition-colors duration-150">Try example</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Full name *</label><input className="input-field" placeholder="e.g. Arjun Kumar" value={form.name} onChange={set("name")} /></div>
              <div><label className="label">Current role</label><input className="input-field" placeholder="e.g. Software Engineer" value={form.role} onChange={set("role")} /></div>
              <div><label className="label">Job title applying for *</label><input className="input-field" placeholder="e.g. Senior Frontend Dev" value={form.jobTitle} onChange={set("jobTitle")} /></div>
              <div><label className="label">Company *</label><input className="input-field" placeholder="e.g. Swiggy" value={form.company} onChange={set("company")} /></div>
              <div><label className="label">Key skills</label><input className="input-field" placeholder="React, Python, SQL" value={form.skills} onChange={set("skills")} /></div>
              <div><label className="label">Years of experience</label><input className="input-field" placeholder="e.g. 4" value={form.years} onChange={set("years")} /></div>
            </div>
            <div className="mt-4"><label className="label">Job description (optional but recommended)</label><textarea className="input-field" rows={4} placeholder="Paste the job description or key requirements here..." value={form.jd} onChange={set("jd")} /></div>
            <div className="mt-5">
              <label className="label">Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map((t) => (<button key={t} onClick={() => setTone(t)} className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all duration-150 ${tone === t ? "bg-brand-600 text-white border-brand-600" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600"}`}>{t}</button>))}
              </div>
            </div>
            {error && (<div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm"><AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{error}</div>)}
            <button onClick={generate} disabled={loading} className="btn-primary w-full justify-center mt-5 py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed" style={{ boxShadow: "0 4px 14px rgba(27,79,216,0.3)" }}>
              {loading ? (<span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z"/></svg>Generating...</span>) : (<><Sparkles size={16} />Generate Cover Letter</>)}
            </button>
          </div>

          {/* Output */}
          <div className="card p-7 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="font-display font-bold text-gray-900">Generated letter</div>
              {letter && (<div className="flex gap-2">
                <button onClick={copy} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors duration-150">{copied ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}{copied ? "Copied!" : "Copy"}</button>
                <button onClick={generate} disabled={loading} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-brand-300 transition-colors duration-150 disabled:opacity-50"><RefreshCw size={13} />Regenerate</button>
              </div>)}
            </div>
            {letter ? (
              <div className="flex-1"><div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 min-h-64"><pre className="whitespace-pre-wrap font-body text-sm text-gray-700 leading-relaxed">{letter}</pre></div><div className="mt-3 text-xs text-gray-400 text-right">{letter.trim().split(/\s+/).filter(Boolean).length} words</div></div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16"><div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4"><Sparkles size={24} className="text-gray-400" /></div><div className="font-medium text-gray-400 mb-1">Your cover letter will appear here</div><div className="text-sm text-gray-400">Fill in your details and click generate</div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
