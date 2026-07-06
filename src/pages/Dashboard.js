import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus, FileText, BarChart2, Sparkles, Clock, MoreHorizontal,
  Download, Copy, Trash2, ArrowRight, Lock, Loader, RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../components/AuthModal";
import { listResumes, listCoverLetters, deleteResume, deleteCoverLetter, duplicateResume, downloadPDF } from "../utils/api";

function ScoreBadge({ score }) {
  if (!score) return <span className="tag bg-gray-50 text-gray-400 font-bold">—</span>;
  const c = score>=80?"bg-emerald-50 text-emerald-700":score>=60?"bg-amber-50 text-amber-700":"bg-red-50 text-red-600";
  return <span className={`tag ${c} font-bold`}>{Math.round(score)}</span>;
}

function GuestPrompt({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-10 text-center">
        <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Lock size={26} className="text-brand-600"/>
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Sign in to view your dashboard</h2>
        <p className="text-gray-500 text-sm mb-7">Your saved resumes and cover letters will appear here.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={()=>onLogin("login")} className="btn-secondary px-6 py-2.5 text-sm">Log in</button>
          <button onClick={()=>onLogin("register")} className="btn-primary px-6 py-2.5 text-sm"
            style={{boxShadow:"0 4px 14px rgba(27,79,216,0.3)"}}>Sign up free</button>
        </div>
      </div>
    </div>
  );
}

const TEMPLATE_COLORS = { modern:"#1B4FD8", classic:"#1a1a1a", minimal:"#059669", executive:"#7C3AED" };

export default function Dashboard() {
  const { isLoggedIn, user } = useAuth();
  const [authModal, setAuthModal] = useState(null);
  const [resumes, setResumes]     = useState([]);
  const [letters, setLetters]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const [r, l] = await Promise.all([listResumes(), listCoverLetters()]);
      setResumes(r.data);
      setLetters(l.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [isLoggedIn]);
  useEffect(() => { const h = () => setActiveMenu(null); document.addEventListener("click",h); return ()=>document.removeEventListener("click",h); },[]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    setActionLoading(id);
    await deleteResume(id).catch(()=>{});
    setResumes(r=>r.filter(x=>x.id!==id));
    setActionLoading(null);
  };

  const handleDuplicate = async (id) => {
    setActionLoading(id);
    const { data } = await duplicateResume(id).catch(()=>({data:null}));
    if (data) setResumes(r=>[data,...r]);
    setActionLoading(null);
  };

  const handleDownload = async (id, name) => {
    setActionLoading(id);
    try {
      const { data: blob } = await downloadPDF(id);
      const url = URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));
      const a = document.createElement("a"); a.href=url; a.download=`${name}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch {}
    setActionLoading(null);
  };

  const handleDeleteLetter = async (id) => {
    if (!window.confirm("Delete this cover letter?")) return;
    await deleteCoverLetter(id).catch(()=>{});
    setLetters(l=>l.filter(x=>x.id!==id));
  };

  if (!isLoggedIn) return (
    <>
      <GuestPrompt onLogin={t=>setAuthModal(t)}/>
      {authModal && <AuthModal defaultTab={authModal} onClose={()=>setAuthModal(null)}/>}
    </>
  );

  const stats = [
    { label:"Resumes",       value:resumes.length, icon:FileText,  color:"bg-brand-50 text-brand-600" },
    { label:"Avg ATS score", value: resumes.length ? Math.round(resumes.reduce((s,r)=>s+(r.ats_score||0),0)/resumes.filter(r=>r.ats_score).length)||"—":"—", icon:BarChart2, color:"bg-amber-50 text-amber-600" },
    { label:"Cover letters", value:letters.length, icon:Sparkles,  color:"bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 page-enter">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-gray-900 tracking-tight">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your resumes and cover letters</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100">
              <RefreshCw size={16}/>
            </button>
            <Link to="/builder" className="btn-primary text-sm px-5 py-2.5"
              style={{boxShadow:"0 4px 14px rgba(27,79,216,0.3)"}}>
              <Plus size={16}/> New Resume
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(s=>(
            <div key={s.label} className="card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
                <s.icon size={20}/>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-900 text-lg">My Resumes</h2>
            <Link to="/builder" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">New <ArrowRight size={14}/></Link>
          </div>
          {loading ? (
            <div className="card p-10 flex items-center justify-center text-gray-400 gap-2 text-sm">
              <Loader size={18} className="animate-spin"/> Loading resumes…
            </div>
          ) : resumes.length===0 ? (
            <div className="card p-10 text-center text-gray-400">
              <FileText size={32} className="mx-auto mb-3 opacity-30"/>
              <div className="font-medium">No resumes yet</div>
              <Link to="/builder" className="text-brand-600 text-sm font-medium hover:text-brand-700 mt-2 inline-block">Build your first resume →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map(r=>(
                <div key={r.id} className="card p-5 flex items-center gap-4 hover:border-brand-200 transition-all duration-150 group relative">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{background:(TEMPLATE_COLORS[r.template]||"#1B4FD8")+"15"}}>
                    <FileText size={18} style={{color:TEMPLATE_COLORS[r.template]||"#1B4FD8"}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{r.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10}/> {new Date(r.updated_at).toLocaleDateString()} · {r.template}
                    </div>
                  </div>
                  <ScoreBadge score={r.ats_score}/>
                  <div className="relative" onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>setActiveMenu(activeMenu===r.id?null:r.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                                 opacity-0 group-hover:opacity-100 transition-all duration-150">
                      {actionLoading===r.id ? <Loader size={16} className="animate-spin"/> : <MoreHorizontal size={16}/>}
                    </button>
                    {activeMenu===r.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 w-44">
                        <button onClick={()=>{handleDownload(r.id,r.name);setActiveMenu(null);}}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Download size={14}/> Download PDF
                        </button>
                        <button onClick={()=>{handleDuplicate(r.id);setActiveMenu(null);}}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Copy size={14}/> Duplicate
                        </button>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={()=>{handleDelete(r.id);setActiveMenu(null);}}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                            <Trash2 size={14}/> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link to={`/builder/${r.id}`}
                    className="btn-secondary text-xs px-4 py-2 opacity-0 group-hover:opacity-100 transition-all duration-150">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cover Letters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-900 text-lg">Cover Letters</h2>
            <Link to="/cover-letter" className="text-sm text-brand-600 font-medium hover:text-brand-700 flex items-center gap-1">New <ArrowRight size={14}/></Link>
          </div>
          {loading ? null : letters.length===0 ? (
            <div className="card p-8 text-center text-gray-400">
              <Sparkles size={28} className="mx-auto mb-3 opacity-30"/>
              <div className="font-medium">No cover letters yet</div>
              <Link to="/cover-letter" className="text-brand-600 text-sm font-medium hover:text-brand-700 mt-2 inline-block">Generate your first →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {letters.map(l=>(
                <div key={l.id} className="card p-5 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={18} className="text-emerald-600"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">{l.role||"Cover Letter"}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{l.company} · {new Date(l.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button onClick={()=>navigator.clipboard.writeText(l.content)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100" title="Copy">
                      <Copy size={14}/>
                    </button>
                    <button onClick={()=>handleDeleteLetter(l.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-50" title="Delete">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 card p-8 text-center"
          style={{background:"linear-gradient(135deg,#EEF3FD 0%,#f8faff 100%)",borderColor:"#ABBFF5"}}>
          <div className="font-display font-bold text-gray-900 text-lg mb-2">Ready to improve your score?</div>
          <p className="text-gray-500 text-sm mb-5">Upload your resume for an instant ATS analysis.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/ats-checker" className="btn-primary text-sm px-5 py-2.5">Check ATS Score</Link>
            <Link to="/cover-letter" className="btn-secondary text-sm px-5 py-2.5">Generate Cover Letter</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
