import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle, ChevronLeft, ChevronRight, Plus, Trash2,
  Download, Eye, Save, Sparkles, Loader, AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  createResume, updateResume, getResume, downloadPDF,
  rewriteBullets, generateSummary,
} from "../utils/api";

const STEPS     = ["Personal Info","Experience","Education","Skills","Summary"];
const TEMPLATES = [
  { id:"modern",    name:"Modern",    accent:"#1B4FD8" },
  { id:"classic",   name:"Classic",   accent:"#1a1a1a" },
  { id:"minimal",   name:"Minimal",   accent:"#059669" },
  { id:"executive", name:"Executive", accent:"#7C3AED" },
];

const DEFAULT = {
  personal:   { name:"", email:"", phone:"", location:"", linkedin:"" },
  experience: [{ title:"", company:"", start:"", end:"", desc:"" }],
  education:  [{ degree:"", school:"", year:"" }],
  skills: [
    { category: "Languages", list: "" },
    { category: "Web Development", list: "" },
    { category: "Machine Learning & Computer Vision", list: "" },
    { category: "Core CS", list: "" },
    { category: "Databases", list: "" },
    { category: "Tools & APIs", list: "" },
    { category: "Testing", list: "" }
  ],
  summary:    "",
};

function StepDot({ index, current, label }) {
  const done   = index < current;
  const active = index === current;
  return (
    <div className={`flex items-center ${index < STEPS.length - 1 ? "flex-1" : ""}`}>
      <div className="flex flex-col items-center gap-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          transition-all duration-200
          ${done ? "bg-emerald-500 text-white" : active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400"}`}>
          {done ? <CheckCircle size={16}/> : index+1}
        </div>
        <div className={`text-xs font-medium hidden sm:block whitespace-nowrap
          ${active?"text-brand-600":done?"text-emerald-600":"text-gray-400"}`}>{label}</div>
      </div>
      {index < STEPS.length-1 && (
        <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full ${done?"bg-emerald-400":"bg-gray-200"}`}/>
      )}
    </div>
  );
}

function ResumePreview({ data, template }) {
  const t = TEMPLATES.find(x => x.id===template) || TEMPLATES[0];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 text-xs shadow-sm min-h-[380px]">
      <div className="pb-3 mb-4" style={{ borderBottom:`2px solid ${t.accent}` }}>
        <div className="font-bold text-base" style={{color:t.accent}}>{data.personal.name||"Your Name"}</div>
        <div className="text-gray-500 text-[11px] mt-0.5">
          {[data.personal.email,data.personal.phone,data.personal.location].filter(Boolean).join(" · ")||"email · phone · location"}
        </div>
        {data.personal.linkedin && <div className="text-[11px] mt-0.5" style={{color:t.accent}}>{data.personal.linkedin}</div>}
      </div>
      {data.summary && (
        <div className="mb-3">
          <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{color:t.accent}}>Summary</div>
          <p className="text-gray-600 text-[10px] leading-relaxed">{data.summary}</p>
        </div>
      )}
      {data.experience.filter(e=>e.title||e.company).length>0 && (
        <div className="mb-3">
          <div className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{color:t.accent}}>Experience</div>
          {data.experience.filter(e=>e.title||e.company).map((exp,i)=>(
            <div key={i} className="mb-2">
              <div className="flex justify-between"><span className="font-semibold text-[10px]">{exp.title}</span><span className="text-[9px] text-gray-400">{exp.start}{exp.end?` – ${exp.end}`:""}</span></div>
              <div className="text-gray-500 text-[10px]">{exp.company}</div>
              {exp.desc && <p className="text-gray-500 text-[10px] mt-0.5 leading-relaxed">{exp.desc.slice(0,120)}{exp.desc.length>120?"…":""}</p>}
            </div>
          ))}
        </div>
      )}
      {data.education.filter(e=>e.degree||e.school).length>0 && (
        <div className="mb-3">
          <div className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{color:t.accent}}>Education</div>
          {data.education.filter(e=>e.degree||e.school).map((ed,i)=>(
            <div key={i} className="mb-1.5">
              <div className="font-semibold text-[10px]">{ed.degree}</div>
              <div className="text-gray-500 text-[10px]">{ed.school}{ed.year?` · ${ed.year}`:""}</div>
            </div>
          ))}
        </div>
      )}
      {data.skills && data.skills.length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider mb-1.5" style={{color:t.accent}}>Technical Skills</div>
          <div className="text-gray-600 text-[9px] leading-relaxed space-y-1">
            {data.skills.map((s, i) => {
              if (typeof s === "string") {
                if (!s) return null;
                return <span key={i} className="inline-block mr-1 mb-1 text-[9px] px-2 py-0.5 rounded-full font-medium" style={{background:t.accent+"18",color:t.accent}}>{s}</span>;
              }
              if (!s.category && !s.list) return null;
              return (
                <div key={i} className="text-[9px]">
                  {s.category && <strong className="text-gray-800 font-semibold">{s.category}: </strong>}
                  <span>{s.list}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeBuilder() {
  const { isLoggedIn } = useAuth();
  const navigate        = useNavigate();
  const { id }          = useParams();   // /builder/:id for editing

  const [step, setStep]         = useState(0);
  const [data, setData]         = useState(DEFAULT);
  const [template, setTemplate] = useState("modern");
  const [resumeName, setResumeName] = useState("My Resume");
  const [resumeId, setResumeId] = useState(id || null);

  const [saving, setSaving]         = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [aiLoading, setAiLoading]   = useState(false);
  const [toast, setToast]           = useState(null);   // { msg, type }
  const [dirty, setDirty]           = useState(false);
  const [errors, setErrors]         = useState({});

  const validatePersonal = () => {
    const newErrors = {};
    if (!data.personal.name?.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!data.personal.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.personal.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!data.personal.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    setErrors(prev => {
      const next = { ...prev };
      delete next.name;
      delete next.email;
      delete next.phone;
      return { ...next, ...newErrors };
    });
    
    return Object.keys(newErrors).length === 0;
  };

  const validateEducation = () => {
    let isValid = true;
    const eduErrors = [];
    data.education.forEach((ed, idx) => {
      const fieldErrors = {};
      if (!ed.degree?.trim()) {
        fieldErrors.degree = "Degree is required";
        isValid = false;
      }
      if (!ed.school?.trim()) {
        fieldErrors.school = "School/university is required";
        isValid = false;
      }
      if (!ed.year?.trim()) {
        fieldErrors.year = "Graduation year is required";
        isValid = false;
      }
      eduErrors[idx] = fieldErrors;
    });

    setErrors(prev => ({
      ...prev,
      education: eduErrors
    }));

    return isValid;
  };

  const handleNext = () => {
    if (step === 0) {
      if (!validatePersonal()) {
        showToast("Please fill in all mandatory fields.", "error");
        return;
      }
    }
    if (step === 2) {
      if (!validateEducation()) {
        showToast("Please fill in all mandatory education fields.", "error");
        return;
      }
    }
    setStep(s => s + 1);
  };

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load existing resume if editing
  useEffect(() => {
    if (id && isLoggedIn) {
      getResume(id).then(({ data: res }) => {
        setResumeId(res.id);
        setResumeName(res.name);
        setTemplate(res.template);
        setData(res.data && Object.keys(res.data).length ? res.data : DEFAULT);
      }).catch(() => showToast("Could not load resume.", "error"));
    }
  }, [id, isLoggedIn]);

  const setPersonal  = (k) => (e) => {
    setData(d=>({...d,personal:{...d.personal,[k]:e.target.value}}));
    setDirty(true);
    if (errors[k]) {
      setErrors(err => {
        const next = { ...err };
        delete next[k];
        return next;
      });
    }
  };
  const setExp       = (i,k) => (e) => { const a=[...data.experience]; a[i]={...a[i],[k]:e.target.value}; setData(d=>({...d,experience:a})); setDirty(true); };
  const setEdu       = (i,k) => (e) => {
    const a=[...data.education];
    a[i]={...a[i],[k]:e.target.value};
    setData(d=>({...d,education:a}));
    setDirty(true);
    if (errors.education?.[i]?.[k]) {
      setErrors(err => {
        const nextEdu = [...(err.education || [])];
        if (nextEdu[i]) {
          nextEdu[i] = { ...nextEdu[i] };
          delete nextEdu[i][k];
        }
        return { ...err, education: nextEdu };
      });
    }
  };
  const setSkillCategory = (i) => (e) => {
    const a = [...data.skills];
    const item = typeof a[i] === "string" ? { category: "", list: a[i] } : { ...a[i] };
    item.category = e.target.value;
    a[i] = item;
    setData(d => ({ ...d, skills: a }));
    setDirty(true);
  };
  const setSkillList = (i) => (e) => {
    const a = [...data.skills];
    const item = typeof a[i] === "string" ? { category: "", list: a[i] } : { ...a[i] };
    item.list = e.target.value;
    a[i] = item;
    setData(d => ({ ...d, skills: a }));
    setDirty(true);
  };
  const addExp       = ()    => setData(d=>({...d,experience:[...d.experience,{title:"",company:"",start:"",end:"",desc:""}]}));
  const removeExp    = (i)   => setData(d=>({...d,experience:d.experience.filter((_,idx)=>idx!==i)}));
  const addEdu       = ()    => setData(d=>({...d,education:[...d.education,{degree:"",school:"",year:""}]}));
  const addSkill     = ()    => setData(d=>({...d,skills:[...d.skills,{category:"",list:""}]}));
  const removeSkill  = (i)   => setData(d=>({...d,skills:d.skills.filter((_,idx)=>idx!==i)}));

  // ── Save ────────────────────────────────────────────
  const handleSave = async () => {
    if (!validatePersonal()) {
      setStep(0);
      showToast("Please fill in all mandatory personal details.", "error");
      return;
    }
    if (!validateEducation()) {
      setStep(2);
      showToast("Please fill in all mandatory education details.", "error");
      return;
    }
    if (!isLoggedIn) { showToast("Please log in to save your resume.", "error"); return; }
    setSaving(true);
    try {
      if (resumeId) {
        await updateResume(resumeId, { name:resumeName, template, data });
        showToast("Resume saved!");
      } else {
        const { data: res } = await createResume({ name:resumeName, template, data });
        setResumeId(res.id);
        navigate(`/builder/${res.id}`, { replace:true });
        showToast("Resume created!");
      }
      setDirty(false);
    } catch { showToast("Save failed. Please try again.", "error"); }
    setSaving(false);
  };

  // ── PDF Download ─────────────────────────────────────
  const handleDownload = async () => {
    if (!isLoggedIn || !resumeId) {
      showToast("Save your resume first, then download.", "error");
      return;
    }
    setDownloading(true);
    try {
      const { data: blob } = await downloadPDF(resumeId);
      const url = URL.createObjectURL(new Blob([blob], { type:"application/pdf" }));
      const a   = document.createElement("a");
      a.href    = url;
      a.download = `${resumeName.replace(/ /g,"_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("PDF downloaded!");
    } catch { showToast("Download failed. Please try again.", "error"); }
    setDownloading(false);
  };

  // ── AI: Rewrite bullets ──────────────────────────────
  const handleRewriteBullets = async (expIndex) => {
    const exp = data.experience[expIndex];
    if (!exp.desc) { showToast("Add some bullet points first.", "error"); return; }
    setAiLoading(true);
    try {
      const { data: res } = await rewriteBullets({
        bullets: exp.desc, job_title: exp.title || "professional", company: exp.company,
      });
      const a = [...data.experience];
      a[expIndex] = { ...a[expIndex], desc: res.rewritten.replace(/^•\s*/gm,"").trim() };
      setData(d => ({ ...d, experience: a }));
      setDirty(true);
      showToast("Bullets rewritten with AI!");
    } catch { showToast("AI rewrite failed. Check your API key.", "error"); }
    setAiLoading(false);
  };

  // ── AI: Generate summary ─────────────────────────────
  const handleGenerateSummary = async () => {
    setAiLoading(true);
    try {
      const { data: res } = await generateSummary({
        name: data.personal.name, role: data.experience[0]?.title || "",
        experience: data.experience, skills: data.skills.map(s => typeof s === "string" ? s : `${s.category}: ${s.list}`).filter(Boolean),
      });
      setData(d => ({ ...d, summary: res.summary }));
      setDirty(true);
      showToast("Summary generated!");
    } catch { showToast("Summary generation failed.", "error"); }
    setAiLoading(false);
  };

  const ic = "input-field";
  const lc = "label";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 page-enter">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-gray-900">Resume Builder</h1>
            <p className="text-gray-500 text-sm">Live preview updates as you type</p>
          </div>
          <div className="flex items-center gap-3">
            <input value={resumeName} onChange={e=>setResumeName(e.target.value)}
              className="input-field w-44 text-sm py-2" placeholder="Resume name" />
            <button onClick={handleSave} disabled={saving}
              className="btn-secondary text-sm px-4 py-2.5 gap-2 disabled:opacity-60">
              {saving ? <Loader size={14} className="animate-spin"/> : <Save size={14}/>}
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={handleDownload} disabled={downloading||!resumeId}
              className="btn-primary text-sm px-4 py-2.5 gap-2 disabled:opacity-50"
              style={{ boxShadow:"0 4px 14px rgba(27,79,216,0.3)" }}
              title={!resumeId ? "Save first to enable download" : ""}>
              {downloading ? <Loader size={14} className="animate-spin"/> : <Download size={14}/>}
              {downloading ? "Downloading…" : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-start mb-7 px-2">
          {STEPS.map((s,i)=><StepDot key={s} index={i} current={step} label={s}/>)}
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl
            shadow-lg text-sm font-medium animate-fade-in
            ${toast.type==="error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
            {toast.type==="error" ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
            {toast.msg}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <div className="lg:col-span-3 card p-7">
            <div className="font-display font-bold text-gray-900 text-lg mb-6">{STEPS[step]}</div>

            {/* Step 0: Personal */}
            {step===0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lc}>Full name <span className="text-red-500">*</span></label>
                    <input className={`${ic} ${errors.name ? "error" : ""}`} placeholder="Arjun Kumar" value={data.personal.name} onChange={setPersonal("name")}/>
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={lc}>Email <span className="text-red-500">*</span></label>
                    <input className={`${ic} ${errors.email ? "error" : ""}`} type="email" placeholder="you@email.com" value={data.personal.email} onChange={setPersonal("email")}/>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className={lc}>Phone <span className="text-red-500">*</span></label>
                    <input className={`${ic} ${errors.phone ? "error" : ""}`} placeholder="+91 98765 43210" value={data.personal.phone} onChange={setPersonal("phone")}/>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div><label className={lc}>Location</label><input className={ic} placeholder="Ahmedabad, GJ" value={data.personal.location} onChange={setPersonal("location")}/></div>
                </div>
                <div><label className={lc}>LinkedIn URL</label><input className={ic} placeholder="linkedin.com/in/yourname" value={data.personal.linkedin} onChange={setPersonal("linkedin")}/></div>
              </div>
            )}

            {/* Step 1: Experience */}
            {step===1 && (
              <div>
                {data.experience.map((exp,i)=>(
                  <div key={i} className="border border-gray-100 rounded-2xl p-5 mb-4 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-semibold text-gray-400">Position {i+1}</div>
                      {data.experience.length>1 && (
                        <button onClick={()=>removeExp(i)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div><label className={lc}>Job title</label><input className={ic} placeholder="Software Engineer" value={exp.title} onChange={setExp(i,"title")}/></div>
                      <div><label className={lc}>Company</label><input className={ic} placeholder="Infosys" value={exp.company} onChange={setExp(i,"company")}/></div>
                      <div><label className={lc}>Start date</label><input className={ic} placeholder="Jun 2022" value={exp.start} onChange={setExp(i,"start")}/></div>
                      <div><label className={lc}>End date</label><input className={ic} placeholder="Present" value={exp.end} onChange={setExp(i,"end")}/></div>
                    </div>
                    <div>
                      <label className={lc}>Description / achievements</label>
                      <textarea className={ic} rows={3} placeholder="Describe your key responsibilities and achievements..." value={exp.desc} onChange={setExp(i,"desc")}/>
                    </div>
                    {/* AI rewrite button */}
                    <button onClick={()=>handleRewriteBullets(i)} disabled={aiLoading||!exp.desc}
                      className="mt-2 flex items-center gap-2 text-xs text-brand-600 font-medium
                                 bg-brand-50 border border-brand-200 hover:bg-brand-100 px-3 py-1.5
                                 rounded-xl transition-all duration-150 disabled:opacity-40">
                      {aiLoading ? <Loader size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                      AI: Rewrite bullets
                    </button>
                  </div>
                ))}
                <button onClick={addExp}
                  className="flex items-center gap-2 text-sm text-brand-600 font-medium border
                             border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-4 py-2.5
                             rounded-xl transition-all duration-150">
                  <Plus size={15}/> Add position
                </button>
              </div>
            )}

            {/* Step 2: Education */}
            {step===2 && (
              <div>
                {data.education.map((ed,i)=>(
                  <div key={i} className="border border-gray-100 rounded-2xl p-5 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className={lc}>Degree / qualification <span className="text-red-500">*</span></label>
                        <input className={`${ic} ${errors.education?.[i]?.degree ? "error" : ""}`} placeholder="B.Tech, Computer Science" value={ed.degree} onChange={setEdu(i,"degree")}/>
                        {errors.education?.[i]?.degree && <p className="text-xs text-red-500 mt-1">{errors.education[i].degree}</p>}
                      </div>
                      <div>
                        <label className={lc}>School / university <span className="text-red-500">*</span></label>
                        <input className={`${ic} ${errors.education?.[i]?.school ? "error" : ""}`} placeholder="NIT Surat" value={ed.school} onChange={setEdu(i,"school")}/>
                        {errors.education?.[i]?.school && <p className="text-xs text-red-500 mt-1">{errors.education[i].school}</p>}
                      </div>
                      <div>
                        <label className={lc}>Graduation year <span className="text-red-500">*</span></label>
                        <input className={`${ic} ${errors.education?.[i]?.year ? "error" : ""}`} placeholder="2022" value={ed.year} onChange={setEdu(i,"year")}/>
                        {errors.education?.[i]?.year && <p className="text-xs text-red-500 mt-1">{errors.education[i].year}</p>}
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEdu}
                  className="flex items-center gap-2 text-sm text-brand-600 font-medium border
                             border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-4 py-2.5
                             rounded-xl transition-all duration-150">
                  <Plus size={15}/> Add degree
                </button>
              </div>
            )}

            {/* Step 3: Skills */}
            {step===3 && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Organise your technical skills into categories (e.g., Languages, Databases, Tools & APIs).</p>
                <div className="space-y-4">
                  {data.skills.map((sk,i)=>{
                    const category = typeof sk === "string" ? "" : sk.category;
                    const list = typeof sk === "string" ? sk : sk.list;
                    return (
                      <div key={i} className="flex gap-3 items-center border border-gray-100 rounded-2xl p-4 relative">
                        <div className="flex-1 grid grid-cols-3 gap-3">
                          <div className="col-span-1">
                            <label className={lc}>Category</label>
                            <input className={ic} placeholder="e.g. Languages" value={category} onChange={setSkillCategory(i)}/>
                          </div>
                          <div className="col-span-2">
                            <label className={lc}>Skills (comma separated)</label>
                            <input className={ic} placeholder="e.g. Java, Python, C++" value={list} onChange={setSkillList(i)}/>
                          </div>
                        </div>
                        {data.skills.length > 1 && (
                          <button onClick={()=>removeSkill(i)} className="mt-6 text-gray-300 hover:text-red-400 transition-colors p-2"><Trash2 size={16}/></button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button onClick={addSkill}
                  className="flex items-center gap-2 text-sm text-brand-600 font-medium border
                             border-brand-200 hover:border-brand-400 hover:bg-brand-50 px-4 py-2.5
                             rounded-xl mt-4 transition-all duration-150">
                  <Plus size={15}/> Add category
                </button>
              </div>
            )}

            {/* Step 4: Summary */}
            {step===4 && (
              <div>
                <p className="text-sm text-gray-500 mb-4">Write 2–3 sentences summarising your experience.</p>
                <textarea className={ic} rows={5}
                  placeholder="Results-driven Software Engineer with 4+ years of experience..."
                  value={data.summary}
                  onChange={e=>{ setData(d=>({...d,summary:e.target.value})); setDirty(true); }}/>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{data.summary.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <button onClick={handleGenerateSummary} disabled={aiLoading}
                    className="flex items-center gap-1.5 text-xs text-brand-600 font-medium bg-brand-50
                               border border-brand-200 hover:bg-brand-100 px-3 py-1.5 rounded-xl
                               transition-all duration-150 disabled:opacity-40">
                    {aiLoading ? <Loader size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                    AI: Generate summary
                  </button>
                </div>
              </div>
            )}

            {/* Nav */}
            <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
              <button disabled={step===0} onClick={()=>setStep(s=>s-1)}
                className="flex items-center gap-2 text-sm font-medium text-gray-500
                           hover:text-gray-800 disabled:opacity-30">
                <ChevronLeft size={16}/> Previous
              </button>
              {step < STEPS.length-1 ? (
                <button onClick={handleNext} className="btn-primary px-6 py-2.5 text-sm">
                  Next <ChevronRight size={16}/>
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving}
                  className="btn-primary px-6 py-2.5 text-sm"
                  style={{ background:"#10B981", boxShadow:"0 4px 14px rgba(16,185,129,0.35)" }}>
                  {saving ? <Loader size={15} className="animate-spin"/> : <Save size={15}/>}
                  {saving ? "Saving…" : "Save Resume"}
                </button>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Template picker */}
            <div className="card p-4">
              <div className="text-xs font-semibold text-gray-500 mb-3">Template</div>
              <div className="flex gap-2 flex-wrap">
                {TEMPLATES.map(t=>(
                  <button key={t.id} onClick={()=>{setTemplate(t.id);setDirty(true);}}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                      ${template===t.id ? "text-white border-transparent" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"}`}
                    style={template===t.id?{background:t.accent,borderColor:t.accent}:{}}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                  <Eye size={13}/> Live Preview
                </div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                  Auto-updating
                </div>
              </div>
              <ResumePreview data={data} template={template}/>
            </div>

            {/* Save reminder */}
            {dirty && !saving && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200
                              rounded-xl px-4 py-3 text-amber-700 text-xs font-medium">
                <AlertCircle size={14}/> Unsaved changes — click Save
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
