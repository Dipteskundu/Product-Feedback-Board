function PriorityDots({ priority }) {
  const level = priority === 'High' ? 3 : priority === 'Medium' ? 2 : 1;

  return (
    <div className="flex items-center gap-1" title={`Priority: ${priority}`}>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${
            i <= level ? 'bg-ink' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );
}

export default PriorityDots;
