/**
 * Resume Builder Page - 4 templates with live preview & PDF export
 */
import React, { useState, useRef } from 'react';
import { FileText, Download, Eye, Edit, Check, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', desc: 'Clean with colored header', color: 'from-blue-600 to-blue-800' },
  { id: 'professional', name: 'Professional', desc: 'Classic executive style', color: 'from-gray-700 to-gray-900' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple and clean', color: 'from-slate-400 to-slate-600' },
  { id: 'creative', name: 'Creative', desc: 'Bold two-column layout', color: 'from-purple-600 to-pink-600' },
  { id: 'corporate', name: 'Corporate', desc: 'ATS-optimized standard', color: 'from-slate-800 to-black' },
  { id: 'datadriven', name: 'Data-Driven', desc: 'Functional two-column grid', color: 'from-teal-600 to-emerald-700' },
];

const defaultData = {
  name: 'Alex Johnson',
  title: 'Senior Full Stack Developer',
  email: 'alex@example.com',
  phone: '(555) 123-4567',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexjohnson',
  summary: 'Passionate full stack developer with 5+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies with a track record of delivering high-quality products.',
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'Python', 'PostgreSQL'],
  experience: [
    { role: 'Senior Developer', company: 'TechCorp Inc.', duration: '2021 - Present', desc: 'Led development of microservices architecture serving 2M+ users. Reduced API latency by 40%.' },
    { role: 'Full Stack Engineer', company: 'StartupXYZ', duration: '2019 - 2021', desc: 'Built React frontend and Node.js backend from scratch. Achieved 99.9% uptime.' }
  ],
  education: [{ degree: 'B.S. Computer Science', school: 'UC Berkeley', year: '2019' }]
};

// ========================
// Template Renderers
// ========================
const ModernTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Georgia, serif', fontSize: '12px', lineHeight: '1.5', color: '#333' }}>
    <div style={{ background: 'linear-gradient(135deg, #1e40af, #1e3a8a)', color: 'white', padding: '24px 28px', borderRadius: '0' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>{data.name}</h1>
      <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 12px 0', fontWeight: '500' }}>{data.title}</p>
      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', opacity: 0.8, flexWrap: 'wrap' }}>
        {data.email && <span>✉ {data.email}</span>}
        {data.phone && <span>📞 {data.phone}</span>}
        {data.location && <span>📍 {data.location}</span>}
        {data.linkedin && <span>🔗 {data.linkedin}</span>}
      </div>
    </div>
    <div style={{ padding: '20px 28px' }}>
      {data.summary && (<><h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '8px' }}>SUMMARY</h2><p style={{ color: '#555', marginBottom: '16px' }}>{data.summary}</p></>)}
      {data.experience?.length > 0 && (<><h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '10px' }}>EXPERIENCE</h2>{data.experience.map((e, i) => (<div key={i} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#1e40af' }}>{e.role}</strong><span style={{ color: '#666' }}>{e.duration}</span></div><div style={{ color: '#666', fontStyle: 'italic', marginBottom: '4px' }}>{e.company}</div><p style={{ color: '#555' }}>{e.desc}</p></div>))}</>)}
      {data.education?.length > 0 && (<><h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>EDUCATION</h2>{data.education.map((e, i) => (<div key={i} style={{ marginBottom: '6px' }}><strong>{e.degree}</strong> — {e.school} <span style={{ color: '#888' }}>{e.year}</span></div>))}</>)}
      {data.skills?.length > 0 && (<><h2 style={{ color: '#1e40af', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '2px solid #1e40af', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>SKILLS</h2><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{data.skills.map((s, i) => (<span key={i} style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>{s}</span>))}</div></>)}
    </div>
  </div>
);

const MinimalTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', padding: '28px', color: '#333' }}>
    <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>{data.name}</h1>
      <p style={{ color: '#6b7280', margin: '0 0 8px', fontWeight: '500' }}>{data.title}</p>
      <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#6b7280', flexWrap: 'wrap' }}>
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>
    </div>
    {data.summary && (<><p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{data.summary}</p></>)}
    {data.experience?.length > 0 && (<><h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6b7280', marginBottom: '10px' }}>Experience</h2>{data.experience.map((e, i) => (<div key={i} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{e.role} · {e.company}</strong><span style={{ color: '#9ca3af', fontSize: '11px' }}>{e.duration}</span></div><p style={{ color: '#6b7280', marginTop: '4px' }}>{e.desc}</p></div>))}</>)}
    {data.skills?.length > 0 && (<><h2 style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#6b7280', marginBottom: '10px', marginTop: '16px' }}>Skills</h2><p style={{ color: '#374151' }}>{data.skills.join(' · ')}</p></>)}
  </div>
);

const ProfessionalTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Times New Roman, serif', fontSize: '12px', padding: '28px', color: '#222' }}>
    <div style={{ textAlign: 'center', borderBottom: '3px double #222', paddingBottom: '14px', marginBottom: '16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 6px' }}>{data.name}</h1>
      <p style={{ color: '#555', margin: '0 0 8px' }}>{data.title}</p>
      <p style={{ fontSize: '11px', color: '#666' }}>{[data.email, data.phone, data.location].filter(Boolean).join(' | ')}</p>
    </div>
    {data.summary && (<><h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px', color: '#222' }}>Professional Summary</h2><p style={{ color: '#444', marginBottom: '16px', textAlign: 'justify' }}>{data.summary}</p></>)}
    {data.experience?.length > 0 && (<><h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px' }}>Professional Experience</h2>{data.experience.map((e, i) => (<div key={i} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{e.role}, {e.company}</strong><em style={{ color: '#666' }}>{e.duration}</em></div><p style={{ marginTop: '4px', textAlign: 'justify' }}>{e.desc}</p></div>))}</>)}
    {data.skills?.length > 0 && (<><h2 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Core Competencies</h2><p style={{ columns: '2', columnGap: '20px' }}>{data.skills.map((s, i) => <span key={i} style={{ display: 'inline-block', width: '100%' }}>▪ {s}</span>)}</p></>)}
  </div>
);

const CreativeTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Helvetica, sans-serif', fontSize: '12px', display: 'flex', minHeight: '700px' }}>
    <div style={{ background: 'linear-gradient(180deg, #7c3aed, #db2777)', color: 'white', width: '220px', padding: '24px 20px', flexShrink: 0 }}>
      <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>
        {data.name?.charAt(0)}
      </div>
      <h1 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 4px' }}>{data.name}</h1>
      <p style={{ opacity: 0.8, fontSize: '11px', marginBottom: '20px' }}>{data.title}</p>
      <div style={{ fontSize: '11px', opacity: 0.85, lineHeight: '1.8' }}>
        {data.email && <p>✉ {data.email}</p>}
        {data.phone && <p>📞 {data.phone}</p>}
        {data.location && <p>📍 {data.location}</p>}
      </div>
      {data.skills?.length > 0 && (<div style={{ marginTop: '20px' }}><h3 style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.9 }}>SKILLS</h3>{data.skills.map((s, i) => (<div key={i} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '6px', padding: '3px 8px', marginBottom: '4px', fontSize: '10px' }}>{s}</div>))}</div>)}
    </div>
    <div style={{ flex: 1, padding: '24px' }}>
      {data.summary && (<><h2 style={{ color: '#7c3aed', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #7c3aed', paddingBottom: '4px', marginBottom: '10px' }}>About Me</h2><p style={{ color: '#555', marginBottom: '16px' }}>{data.summary}</p></>)}
      {data.experience?.length > 0 && (<><h2 style={{ color: '#7c3aed', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #7c3aed', paddingBottom: '4px', marginBottom: '10px' }}>Experience</h2>{data.experience.map((e, i) => (<div key={i} style={{ marginBottom: '14px', borderLeft: '3px solid #e9d5ff', paddingLeft: '10px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><strong style={{ color: '#7c3aed' }}>{e.role}</strong><span style={{ color: '#888', fontSize: '11px' }}>{e.duration}</span></div><div style={{ color: '#888', marginBottom: '4px' }}>{e.company}</div><p style={{ color: '#555' }}>{e.desc}</p></div>))}</>)}
      {data.education?.length > 0 && (<><h2 style={{ color: '#7c3aed', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #7c3aed', paddingBottom: '4px', marginBottom: '10px', marginTop: '16px' }}>Education</h2>{data.education.map((e, i) => (<div key={i}><strong>{e.degree}</strong> — {e.school} ({e.year})</div>))}</>)}
    </div>
  </div>
);

const CorporateTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Georgia, serif', fontSize: '12px', padding: '36px', color: '#000', lineHeight: '1.5' }}>
    <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '20px' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px' }}>{data.name}</h1>
      <p style={{ fontSize: '12px', margin: '0' }}>
        {[data.location, data.phone, data.email, data.linkedin].filter(Boolean).join(' • ')}
      </p>
    </div>
    
    {data.summary && (
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Professional Summary</h2>
        <p style={{ margin: '0', textAlign: 'justify' }}>{data.summary}</p>
      </div>
    )}

    {data.experience?.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Professional Experience</h2>
        {data.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{e.role}</span>
              <span style={{ fontWeight: 'bold' }}>{e.duration}</span>
            </div>
            <div style={{ fontStyle: 'italic', marginBottom: '6px' }}>{e.company}</div>
            <p style={{ margin: '0', paddingLeft: '14px', textIndent: '-14px' }}>• {e.desc}</p>
          </div>
        ))}
      </div>
    )}

    {data.education?.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px' }}>Education</h2>
        {data.education.map((e, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 'bold' }}>{e.school}</span>
              <span>{e.year}</span>
            </div>
            <div>{e.degree}</div>
          </div>
        ))}
      </div>
    )}

    {data.skills?.length > 0 && (
      <div>
        <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Core Skills</h2>
        <p style={{ margin: '0' }}>{data.skills.join(', ')}</p>
      </div>
    )}
  </div>
);

const DataDrivenTemplate = ({ data }) => (
  <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '11px', padding: '32px', color: '#111', lineHeight: '1.6' }}>
    <header style={{ marginBottom: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{data.name}</h1>
      <div style={{ fontSize: '15px', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>{data.title}</div>
      <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#475569', flexWrap: 'wrap' }}>
        {data.email && <span>{data.email}</span>}
        {data.phone && <span>| {data.phone}</span>}
        {data.location && <span>| {data.location}</span>}
        {data.linkedin && <span>| {data.linkedin}</span>}
      </div>
    </header>

    {data.summary && (
      <section style={{ marginBottom: '24px' }}>
        <p style={{ margin: 0, color: '#334155', fontSize: '12px', lineHeight: '1.7' }}>{data.summary}</p>
      </section>
    )}

    <div style={{ display: 'flex', gap: '32px' }}>
      <div style={{ flex: '2' }}>
        {data.experience?.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '14px', paddingBottom: '6px', borderBottom: '2px solid #e2e8f0', letterSpacing: '1px' }}>Experience</h2>
            {data.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{e.role}</strong>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{e.duration}</span>
                </div>
                <div style={{ fontWeight: '700', color: '#3b82f6', marginBottom: '8px', fontSize: '12px' }}>{e.company}</div>
                <p style={{ margin: 0, color: '#475569', paddingLeft: '12px', textIndent: '-12px' }}>• {e.desc}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <div style={{ flex: '1' }}>
        {data.skills?.length > 0 && (
          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '14px', paddingBottom: '6px', borderBottom: '2px solid #e2e8f0', letterSpacing: '1px' }}>Technical Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.skills.map((s, i) => (
                <span key={i} style={{ background: '#f1f5f9', color: '#334155', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', border: '1px solid #e2e8f0' }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {data.education?.length > 0 && (
          <section>
            <h2 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '14px', paddingBottom: '6px', borderBottom: '2px solid #e2e8f0', letterSpacing: '1px' }}>Education</h2>
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '12px', marginBottom: '2px' }}>{e.degree}</div>
                <div style={{ color: '#475569', marginBottom: '4px', fontWeight: '500' }}>{e.school}</div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>{e.year}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  </div>
);

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  corporate: CorporateTemplate,
  datadriven: DataDrivenTemplate,
};

// ========================
// Sub-components
// ========================
const SkillsInput = ({ skills, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addSkills = (input) => {
    const newSkills = input
      .split(/[,]+/)
      .map(s => s.trim())
      .filter(s => s && !skills.includes(s));
    
    if (newSkills.length > 0) {
      onChange([...skills, ...newSkills]);
      setInputValue('');
    }
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkills(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  const suggestions = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'Python', 'PostgreSQL', 'GraphQL', 'Next.js', 'Tailwind CSS', 'Redux'];
  const filteredSuggestions = suggestions.filter(s => !skills.includes(s)).slice(0, 5);

  return (
    <div className="space-y-3">
      <div 
        className="input min-h-[48px] flex flex-wrap gap-2 items-center focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--primary)_10%,transparent)]" 
        style={{ cursor: 'text' }} 
        onClick={() => inputRef.current?.focus()}
      >
        {skills.map((skill, index) => (
          <span key={index} className="badge-info h-7 flex items-center gap-1 animate-page-enter" style={{ animationDelay: `${index * 50}ms` }}>
            {skill}
            <button onClick={(e) => { e.stopPropagation(); removeSkill(index); }} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
              <X size={18} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="bg-transparent border-none outline-none text-sm flex-1 min-w-[80px]"
          placeholder={skills.length === 0 ? "Add skills (comma separated)..." : ""}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addSkills(inputValue)}
        />
      </div>
      
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Suggested:</span>
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => addSkills(s)}
              className="text-[11px] px-2 py-1 rounded-md border border-border hover:border-primary hover:text-primary transition-colors flex items-center gap-1"
            >
              <Plus size={18} /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const ResumeBuilderPage = () => {
  const [template, setTemplate] = useState('modern');
  const [data, setData] = useState(defaultData);
  const [tab, setTab] = useState('edit');
  const previewRef = useRef();

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const downloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = previewRef.current;
      const opt = {
        margin: 0.5,
        filename: `${data.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
      toast.success('Resume downloaded as PDF!');
    } catch (err) {
      toast.error('PDF download failed. Try printing from preview.');
    }
  };

  const TemplatePreview = TEMPLATE_COMPONENTS[template];

  return (
    <div className="space-y-6 stagger-children">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Resume Builder</h1>
          <p className="page-subtitle">Build a professional resume with AI-powered templates</p>
        </div>
        <button onClick={downloadPDF} className="btn-primary flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Template Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => setTemplate(t.id)}
            className="relative p-1 rounded-xl border-2 transition-all duration-200 text-left"
            style={{
              borderColor: template === t.id ? 'var(--primary)' : 'var(--border)',
              boxShadow: template === t.id ? '0 4px 14px -2px color-mix(in srgb, var(--primary) 25%, transparent)' : 'var(--shadow-sm)',
              background: template === t.id ? 'color-mix(in srgb, var(--primary) 3%, var(--card))' : 'var(--card)'
            }}
          >
            <div className={`h-10 rounded-lg bg-gradient-to-r ${t.color} mb-2 mx-0.5 mt-0.5 shadow-inner`} />
            <div className="flex items-start justify-between gap-1 px-2 pb-2">
              <div>
                <p className="font-semibold text-sm" style={{ color: template === t.id ? 'var(--primary)' : 'var(--foreground)' }}>
                  {t.name}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{t.desc}</p>
              </div>
              {template === t.id && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                     style={{ background: 'var(--primary)' }}>
                  <Check size={18} className="text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Edit/Preview — Segmented Control (mobile only) */}
      <div className="inline-flex lg:hidden rounded-xl p-1" style={{ background: 'var(--muted)' }}>
        {[{ id: 'edit', label: 'Edit', icon: Edit }, { id: 'preview', label: 'Preview', icon: Eye }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? 'var(--card)' : 'transparent',
              color: tab === t.id ? 'var(--foreground)' : 'var(--muted-foreground)',
              boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Edit Form */}
        {(tab === 'edit' || window.innerWidth >= 1024) && (
          <div className={`space-y-4 ${tab === 'preview' ? 'hidden lg:block' : ''}`}>
            <div className="card space-y-4">
              <h3 className="section-title pb-2" style={{ borderBottom: '1px solid var(--border)' }}>Personal Info</h3>
              {[
                { field: 'name', label: 'Full Name', placeholder: 'John Doe' },
                { field: 'title', label: 'Job Title', placeholder: 'Software Engineer' },
                { field: 'email', label: 'Email', placeholder: 'john@example.com' },
                { field: 'phone', label: 'Phone', placeholder: '(555) 000-0000' },
                { field: 'location', label: 'Location', placeholder: 'City, State' },
                { field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/...' }
              ].map((f) => (
                <div key={f.field}>
                  <label className="form-label">{f.label}</label>
                  <input className="input" placeholder={f.placeholder}
                    value={data[f.field]} onChange={(e) => update(f.field, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="form-label">Professional Summary</label>
                <textarea className="input resize-none" rows={3}
                  value={data.summary} onChange={(e) => update('summary', e.target.value)} />
              </div>
            </div>

            <div className="card">
              <h3 className="section-title pb-2 mb-3" style={{ borderBottom: '1px solid var(--border)' }}>Skills</h3>
              <SkillsInput 
                skills={data.skills} 
                onChange={(newSkills) => update('skills', newSkills)} 
              />
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="section-title">Experience</h3>
                <button onClick={() => update('experience', [...data.experience, { role: '', company: '', duration: '', desc: '' }])}
                  className="text-[var(--primary)] hover:underline text-sm font-medium flex items-center gap-1">
                  <Plus size={18} /> Add
                </button>
              </div>
              
              {data.experience.map((exp, i) => (
                <div key={i} className="p-4 bg-gray-50/50 rounded-xl space-y-3 relative group border border-transparent hover:border-border transition-all">
                  <button 
                    onClick={() => update('experience', data.experience.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Job Title</label>
                      <input className="input !py-2 !px-3" placeholder="Software Engineer"
                        value={exp.role} onChange={(e) => { const updated = [...data.experience]; updated[i].role = e.target.value; update('experience', updated); }} />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Company</label>
                      <input className="input !py-2 !px-3" placeholder="Google"
                        value={exp.company} onChange={(e) => { const updated = [...data.experience]; updated[i].company = e.target.value; update('experience', updated); }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Duration</label>
                    <input className="input !py-2 !px-3" placeholder="2021 - Present"
                      value={exp.duration} onChange={(e) => { const updated = [...data.experience]; updated[i].duration = e.target.value; update('experience', updated); }} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Description</label>
                    <textarea className="input !py-2 !px-3 resize-none" rows={2} placeholder="Key achievements..."
                      value={exp.desc} onChange={(e) => { const updated = [...data.experience]; updated[i].desc = e.target.value; update('experience', updated); }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="card space-y-4">
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="section-title">Education</h3>
                <button onClick={() => update('education', [...data.education, { degree: '', school: '', year: '' }])}
                  className="text-[var(--primary)] hover:underline text-sm font-medium flex items-center gap-1">
                  <Plus size={18} /> Add
                </button>
              </div>

              {data.education.map((edu, i) => (
                <div key={i} className="p-4 bg-gray-50/50 rounded-xl space-y-3 relative group border border-transparent hover:border-border transition-all">
                  <button 
                    onClick={() => update('education', data.education.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Degree</label>
                    <input className="input !py-2 !px-3" placeholder="B.S. Computer Science"
                      value={edu.degree} onChange={(e) => { const updated = [...data.education]; updated[i].degree = e.target.value; update('education', updated); }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">School</label>
                      <input className="input !py-2 !px-3" placeholder="MIT"
                        value={edu.school} onChange={(e) => { const updated = [...data.education]; updated[i].school = e.target.value; update('education', updated); }} />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">Year</label>
                      <input className="input !py-2 !px-3" placeholder="2020"
                        value={edu.year} onChange={(e) => { const updated = [...data.education]; updated[i].year = e.target.value; update('education', updated); }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview — Paper effect, sticky */}
        {(tab === 'preview' || window.innerWidth >= 1024) && (
          <div className={`${tab === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-20">
              <div className="overflow-hidden rounded-lg bg-white"
                   style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 50px -10px rgba(0,0,0,0.15)', border: '1px solid var(--border)', minHeight: '850px' }}>
                <div ref={previewRef} className="bg-white">
                  <TemplatePreview data={data} />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button onClick={downloadPDF} className="btn-secondary flex items-center gap-2">
                  <Download size={18} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
