export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl p-6 shadow-[0_22px_60px_rgba(15,23,42,0.85)] hover:shadow-[0_26px_70px_rgba(15,23,42,0.95)] transition-all hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}
