import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Upload, FileText, CheckCircle, Star,
  ArrowRight, Zap, ShieldCheck, Download, BarChart2,
} from "lucide-react";

/* ── Mini resume card ── */
function MiniResume() {
  return (
    <div className="bg-white rounded-2xl p-5 w-64 flex-shrink-0 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center
                        font-display font-bold text-brand-600 text-sm">AK</div>
        <div>
          <div className="text-sm font-semibold text-gray-900">Arjun Kumar</div>
          <div className="text-xs text-gray-500">Software Engineer</div>
        </div>
      </div>
      {[
        { label: "Experience", w: "90%" },
        { label: "Skills", w: "75%" },
        { label: "Education", w: "85%" },
      ].map((s) => (
        <div key={s.label} className="mb-3">
          <div className="text-[10px] font-bold text-brand-600 uppercase tracking-wider mb-1">{s.label}</div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 rounded-full" style={{ width: s.w }} />
          </div>
        </div>
      ))}
      <div className="mt-4 flex items-center justify-between bg-emerald-50 rounded-xl px-3 py-2">
        <div>
          <div className="text-lg font-display font-bold text-emerald-700">87</div>
          <div className="text-[10px] text-emerald-600">ATS Score</div>
        </div>
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle size={16} color="white" />
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: BarChart2,
    color: "bg-brand-50 text-brand-600",
    title: "ATS Score Checker",
    desc: "Upload your resume and instantly see how it scores against Applicant Tracking Systems. Get a section-by-section breakdown.",
    to: "/ats-checker",
    cta: "Check your score",
  },
  {
    icon: Sparkles,
    color: "bg-amber-50 text-amber-600",
    title: "AI Resume Builder",
    desc: "Build your resume step-by-step with AI suggestions on every bullet point. Choose from 8+ professional templates.",
    to: "/builder",
    cta: "Start building",
  },
  {
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600",
    title: "Cover Letter Generator",
    desc: "Paste a job description and get a tailored, professional cover letter in seconds. Six tone options.",
    to: "/cover-letter",
    cta: "Generate now",
  },
];

const stats = [
  { num: "2M+", label: "Resumes created" },
  { num: "94%", label: "Interview rate" },
  { num: "50+", label: "Templates" },
  { num: "4.9★", label: "User rating" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Got hired at Flipkart",
    text: "My ATS score went from 42 to 91 after following CareerAI's suggestions. Got 3 interview calls in the first week.",
    avatar: "PS",
    stars: 5,
  },
  {
    name: "Rohan Mehta",
    role: "Now at Microsoft India",
    text: "The cover letter generator saved me hours. Each letter was tailored to the JD and sounded genuinely human.",
    avatar: "RM",
    stars: 5,
  },
  {
    name: "Ananya Iyer",
    role: "Senior Dev at Razorpay",
    text: "Best resume tool I've used. The live preview while building is incredible. Downloaded a perfect PDF in minutes.",
    avatar: "AI",
    stars: 5,
  },
];

const steps = [
  { icon: Upload, label: "Upload or build", desc: "Upload your existing resume or use our step-by-step builder" },
  { icon: Zap, label: "AI analysis", desc: "Claude AI scans it for ATS issues, keyword gaps, and weak phrasing" },
  { icon: CheckCircle, label: "Fix & optimize", desc: "Apply one-click AI suggestions to boost your score" },
  { icon: Download, label: "Download", desc: "Export as PDF or DOCX, ready to send" },
];

export default function LandingPage() {
  const featuresRef = useRef(null);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section
        className="relative min-h-[92vh] flex items-center pt-20 pb-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1340B0 0%, #1B4FD8 50%, #2563EB 100%)" }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                          bg-white/5 blur-none" />
          <div className="absolute top-1/2 -left-48 w-96 h-96 rounded-full bg-white/5" />
          <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 60" fill="none">
            <path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="#f8faff" />
          </svg>
          {/* Grid lines */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left */}
            <div className="flex-1 text-white">
              <div className="stagger-1 inline-flex items-center gap-2 bg-white/15 border border-white/20
                              rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                AI-powered · ATS-optimized · Free to start
              </div>

              <h1 className="stagger-2 font-display font-extrabold text-5xl lg:text-6xl leading-[1.1]
                             tracking-tight mb-5">
                Build a Resume<br />
                That Gets{" "}
                <span className="relative">
                  <span className="text-accent-400">Interviews</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C50 2 100 2 198 6" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="stagger-3 text-white/75 text-lg leading-relaxed mb-8 max-w-xl">
                Upload your resume or build from scratch. Our AI scores it for ATS compatibility,
                rewrites weak bullet points, and generates tailored cover letters — in seconds.
              </p>

              <div className="stagger-4 flex flex-wrap gap-3 mb-10">
                <Link to="/builder" className="btn-primary text-base px-7 py-3.5 font-semibold"
                  style={{ background: "#F59E0B", color: "#1a1000", boxShadow: "0 6px 20px rgba(245,158,11,0.4)" }}>
                  Build My Resume
                  <ArrowRight size={16} />
                </Link>
                <Link to="/ats-checker" className="btn-ghost text-base px-7 py-3.5">
                  Check ATS Score
                </Link>
              </div>

              {/* Stats */}
              <div className="stagger-5 flex flex-wrap gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-2xl text-white">{s.num}</div>
                    <div className="text-white/60 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — resume card */}
            <div className="stagger-6 flex-shrink-0 hidden lg:block">
              <div className="relative">
                <MiniResume />
                {/* Floating badges */}
                <div className="absolute -top-4 -right-6 bg-white rounded-xl px-3 py-2 shadow-lg
                                flex items-center gap-2 text-xs font-medium text-gray-700">
                  <Sparkles size={13} color="#F59E0B" />
                  AI suggestions ready
                </div>
                <div className="absolute -bottom-4 -left-6 bg-emerald-500 text-white rounded-xl
                                px-3 py-2 shadow-lg text-xs font-semibold">
                  +45 ATS points
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="tag-blue mb-3">Simple process</div>
            <h2 className="section-title text-3xl mb-3">How CareerAI works</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">Four steps from upload to interview-ready</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.label} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-14 h-14
                                bg-brand-50 rounded-2xl mb-4 group-hover:bg-brand-600 transition-colors duration-200">
                  <s.icon size={22} className="text-brand-600 group-hover:text-white transition-colors duration-200" />
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-600 group-hover:bg-brand-800
                                  rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {i + 1}
                  </div>
                </div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{s.label}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="tag-blue mb-3">Everything you need</div>
            <h2 className="section-title text-3xl mb-3">Three powerful tools. One platform.</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Everything you need to go from job seeker to hired.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.to} to={f.to}
                className="card-hover group flex flex-col p-7">
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{f.desc}</p>
                <div className="flex items-center gap-1 text-brand-600 text-sm font-medium
                                group-hover:gap-2 transition-all duration-150">
                  {f.cta} <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="tag-green mb-3">Real results</div>
            <h2 className="section-title text-3xl mb-3">Loved by job seekers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center
                                  font-bold text-brand-600 text-xs font-display">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-emerald-600 font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 mx-4 sm:mx-6 mb-16 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1340B0 0%, #1B4FD8 100%)" }}>
        <div className="text-center text-white px-6">
          <ShieldCheck size={36} className="mx-auto mb-4 text-accent-400" />
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl mb-3 tracking-tight">
            Ready to land your dream job?
          </h2>
          <p className="text-white/75 mb-8 max-w-md mx-auto">
            Join 2 million job seekers who've already boosted their chances with CareerAI.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/builder"
              className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-full text-base"
              style={{ background: "#F59E0B", color: "#1a1000", boxShadow: "0 6px 20px rgba(245,158,11,0.35)" }}>
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link to="/ats-checker" className="btn-ghost text-base px-8 py-3.5">
              Check ATS Score
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
