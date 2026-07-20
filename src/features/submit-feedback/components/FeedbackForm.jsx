import { useState } from 'react';
import { COLORS } from '../../../shared/constants/tokens';
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

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 6,
    border: `1px solid ${COLORS.border}`,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: 4,
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.ink,
  };

  const errorStyle = {
    fontSize: 12,
    color: COLORS.bug,
    marginTop: 2,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          placeholder="Brief summary of your feedback"
        />
        {errors.title && <div style={errorStyle}>{errors.title}</div>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="Describe your feedback in detail"
        />
        {errors.description && <div style={errorStyle}>{errors.description}</div>}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <div style={errorStyle}>{errors.category}</div>}
        </div>

        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select priority</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.priority && <div style={errorStyle}>{errors.priority}</div>}
        </div>
      </div>

      <Button type="submit" disabled={createFeedback.isPending}>
        {createFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
}

export default FeedbackForm;
