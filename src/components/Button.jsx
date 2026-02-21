export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-sm tracking-wide shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
  const variants = {
    primary:
      'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.3),0_14px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.5),0_18px_40px_rgba(16,185,129,0.5)]',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 border border-slate-600/60',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_0_1px_rgba(239,68,68,0.3),0_10px_24px_rgba(239,68,68,0.35)]',
    ghost: 'bg-transparent hover:bg-slate-800/70 text-slate-300 border border-slate-700/60',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
