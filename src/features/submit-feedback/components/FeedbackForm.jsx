import Button from '../../../shared/components/Button';

const categoryOptions = ['Bug', 'Feature', 'Improvement'];
const priorityOptions = ['Low', 'Medium', 'High'];

function FieldLabel({ children, htmlFor, hint }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-ink mb-1.5">
      <span>{children}</span>
      {hint ? <span className="ml-2 text-xs font-normal text-ink-muted">{hint}</span> : null}
    </label>
  );
}

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-accent focus:ring-4 focus:ring-accent/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function FeedbackForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}) {
  const handleChange = (event) => {
    onChange(event.target.name, event.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="p-6">
      <div className="grid gap-5">
        <div>
          <FieldLabel htmlFor="title" hint="Required">
            Title
          </FieldLabel>
          <input
            id="title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="A short, specific summary"
            minLength={5}
            maxLength={100}
            required
            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink shadow-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </div>

        <div>
          <FieldLabel htmlFor="description" hint="Required">
            Description
          </FieldLabel>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Explain the problem or idea in a few sentences"
            minLength={10}
            maxLength={1000}
            required
            rows={5}
            className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-ink shadow-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-muted/60 focus:border-accent focus:ring-4 focus:ring-accent/10 resize-y"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="category"
            label="Category"
            value={values.category}
            onChange={handleChange}
            options={categoryOptions}
          />
          <SelectField
            id="priority"
            label="Priority"
            value={values.priority}
            onChange={handleChange}
            options={priorityOptions}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-bug dark:border-red-900/40 dark:bg-red-950/30">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="md" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Feedback'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default FeedbackForm;
