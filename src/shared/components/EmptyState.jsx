import Button from './Button';

function EmptyState({ title, description, action, onAction, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-accent-light dark:bg-accent/10 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-heading font-bold text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm mb-6">{description}</p>
      {action && onAction && (
        <Button onClick={onAction}>{action}</Button>
      )}
    </div>
  );
}

export default EmptyState;
