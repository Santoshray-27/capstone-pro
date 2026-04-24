/**
 * Resume Builder Page - 4 templates with live preview & PDF export
 */
import React, { useState, useRef } from 'react';
import { FileText, Download, Eye, Edit, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', desc: 'Clean with colored header', color: 'from-blue-600 to-blue-800' },
  { id: 'professional', name: 'Professional', desc: 'Classic executive style', color: 'from-gray-700 to-gray-900' },
  { id: 'minimal', name: 'Minimal', desc: 'Simple and clean', color: 'from-slate-400 to-slate-600' },
  { id: 'creative', name: 'Creative', desc: 'Bold two-column layout', color: 'from-purple-600 to-pink-600' },
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

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Resume Builder</h2>
          <p className="text-gray-500 text-sm mt-1">Build a professional resume with AI-powered templates</p>
        </div>
        <button onClick={downloadPDF} className="btn-primary flex items-center gap-2">
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* Template Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => setTemplate(t.id)}
            className={`p-3 rounded-xl border-2 transition-all ${template === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className={`h-8 rounded-lg bg-gradient-to-r ${t.color} mb-2`} />
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className={`font-bold text-sm ${template === t.id ? 'text-blue-700' : 'text-gray-800'}`}>{t.name}</p>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
              {template === t.id && <Check size={14} className="text-blue-600" />}
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[{ id: 'edit', label: 'Edit', icon: Edit }, { id: 'preview', label: 'Preview', icon: Eye }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Form */}
        {(tab === 'edit' || window.innerWidth >= 1024) && (
          <div className={`space-y-4 ${tab === 'preview' ? 'hidden lg:block' : ''}`}>
            <div className="card space-y-4">
              <h3 className="font-bold text-gray-900">Personal Info</h3>
              {[
                { field: 'name', label: 'Full Name', placeholder: 'John Doe' },
                { field: 'title', label: 'Job Title', placeholder: 'Software Engineer' },
                { field: 'email', label: 'Email', placeholder: 'john@example.com' },
                { field: 'phone', label: 'Phone', placeholder: '(555) 000-0000' },
                { field: 'location', label: 'Location', placeholder: 'City, State' },
                { field: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/...' }
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                  <input className="input text-sm" placeholder={f.placeholder}
                    value={data[f.field]} onChange={(e) => update(f.field, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Professional Summary</label>
                <textarea className="input text-sm resize-none" rows={3}
                  value={data.summary} onChange={(e) => update('summary', e.target.value)} />
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3">Skills</h3>
              <textarea className="input text-sm resize-none" rows={2}
                placeholder="React, Node.js, Python (comma separated)"
                value={data.skills.join(', ')}
                onChange={(e) => update('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
            </div>

            <div className="card space-y-3">
              <h3 className="font-bold text-gray-900">Experience</h3>
              {data.experience.map((exp, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-2">
                  <input className="input text-sm" placeholder="Job Title"
                    value={exp.role} onChange={(e) => { const updated = [...data.experience]; updated[i].role = e.target.value; update('experience', updated); }} />
                  <input className="input text-sm" placeholder="Company"
                    value={exp.company} onChange={(e) => { const updated = [...data.experience]; updated[i].company = e.target.value; update('experience', updated); }} />
                  <input className="input text-sm" placeholder="Duration (e.g. 2021 - Present)"
                    value={exp.duration} onChange={(e) => { const updated = [...data.experience]; updated[i].duration = e.target.value; update('experience', updated); }} />
                  <textarea className="input text-sm resize-none" rows={2} placeholder="Description"
                    value={exp.desc} onChange={(e) => { const updated = [...data.experience]; updated[i].desc = e.target.value; update('experience', updated); }} />
                </div>
              ))}
              <button onClick={() => update('experience', [...data.experience, { role: '', company: '', duration: '', desc: '' }])}
                className="btn-secondary text-sm py-2 w-full">+ Add Experience</button>
            </div>
          </div>
        )}

        {/* Preview */}
        {(tab === 'preview' || window.innerWidth >= 1024) && (
          <div className={`${tab === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="card p-0 overflow-hidden shadow-lg border border-gray-200">
              <div ref={previewRef} className="bg-white" style={{ minHeight: '700px' }}>
                <TemplatePreview data={data} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
