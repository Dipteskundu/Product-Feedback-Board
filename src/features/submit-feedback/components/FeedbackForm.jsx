import { useState } from 'react';
import { CATEGORIES, PRIORITIES } from '../../../shared/constants/enums';
import Button from '../../../shared/components/Button';
import { useCreateFeedback } from '../hooks/useCreateFeedback';

function FeedbackForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState({});

  const createFeedback = useCreateFeedback();

  const validate = () => {
    const newErrors = {};
    if (!title || title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (!description || description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (description.length > 1000) newErrors.description = 'Description must be under 1000 characters';
    if (!category) newErrors.category = 'Category is required';
    if (!priority) newErrors.priority = 'Priority is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    createFeedback.mutate(
      { title, description, category, priority },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setCategory('');
          setPriority('');
          setErrors({});
          onSuccess?.();
        },
      }
    );
  };

  const inputClass = `
    w-full px-4 py-2.5 bg-bg border rounded-lg text-sm text-ink
    placeholder:text-ink-muted/60
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
    transition-colors
  `;

  const labelClass = 'block text-sm font-medium text-ink mb-1.5';
  const errorClass = 'text-xs text-bug mt-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${inputClass} ${errors.title ? 'border-bug focus:ring-bug' : 'border-border'}`}
          placeholder="Brief summary of your feedback"
        />
        {errors.title && <p className={errorClass}>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`${inputClass} resize-y min-h-[100px] ${errors.description ? 'border-bug focus:ring-bug' : 'border-border'}`}
          placeholder="Describe your feedback in detail"
        />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
        <p className="text-xs text-ink-muted mt-1">{description.length}/1000 characters</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className={labelClass}>Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${inputClass} cursor-pointer ${errors.category ? 'border-bug focus:ring-bug' : 'border-border'}`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className={errorClass}>{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="priority" className={labelClass}>Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`${inputClass} cursor-pointer ${errors.priority ? 'border-bug focus:ring-bug' : 'border-border'}`}
          >
            <option value="">Select priority</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.priority && <p className={errorClass}>{errors.priority}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={createFeedback.isPending}>
          {createFeedback.isPending ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </div>
    </form>
  );
}

export default FeedbackForm;
