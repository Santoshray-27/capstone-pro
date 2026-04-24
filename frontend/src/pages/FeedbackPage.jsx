import React, { useState } from 'react';
import { feedbackAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Star, Send, Loader, MessageSquare } from 'lucide-react';

const TYPES = [
  { value: 'platform', label: '🌐 Platform' },
  { value: 'analysis', label: '🧠 Analysis' },
  { value: 'interview', label: '🎤 Interview' },
  { value: 'feature-request', label: '✨ Feature Request' },
  { value: 'bug-report', label: '🐛 Bug Report' },
  { value: 'other', label: '📝 Other' }
];

const FeedbackPage = () => {
  const [form, setForm] = useState({ type: 'platform', title: '', message: '', rating: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return toast.error('Title and message are required');
    setSubmitting(true);
    try {
      const { data } = await feedbackAPI.create(form);
      if (data.success) {
        setSubmitted(true);
        toast.success('Thank you for your feedback! 🙏');
      }
    } catch (err) {
      toast.error('Failed to submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-6">Your feedback helps us improve SmartResume AI for everyone.</p>
          <button onClick={() => { setSubmitted(false); setForm({ type: 'platform', title: '', message: '', rating: 0 }); }}
            className="btn-secondary">Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Share Feedback</h2>
        <p className="text-gray-500 text-sm mt-1">Help us make SmartResume AI better for everyone</p>
      </div>

      <form onSubmit={submit} className="card space-y-5">
        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Feedback Type</label>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button key={t.value} type="button" onClick={() => setForm({ ...form, type: t.value })}
                className={`p-2 rounded-xl text-xs font-semibold border-2 transition-all text-center ${form.type === t.value ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (optional)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}>
                <Star size={28} className={`transition-colors ${star <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
          <input className="input" placeholder="Brief summary of your feedback"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
          <textarea className="input resize-none" rows={5}
            placeholder="Tell us about your experience, what you'd like to see improved, or any issues you encountered..."
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
          {submitting ? <><Loader size={18} className="animate-spin" /> Submitting...</> : <><Send size={18} /> Submit Feedback</>}
        </button>
      </form>

      {/* FAQ */}
      <div className="card bg-blue-50 border-blue-100">
        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          <MessageSquare size={16} /> We Read Every Feedback
        </h4>
        <p className="text-blue-700 text-sm leading-relaxed">
          Our team reviews all feedback and uses it to prioritize features and improvements. 
          While we can't respond to all submissions, your input shapes the product roadmap.
        </p>
      </div>
    </div>
  );
};

export default FeedbackPage;
