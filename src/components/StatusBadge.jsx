export default function StatusBadge({ status }) {
  const styles = {
    voted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'not voted': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    ended: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };

  const label = status === 'voted' ? 'Voted' : status === 'not voted' ? 'Not Voted' : status === 'active' ? 'Active' : 'Ended';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || 'bg-slate-500/20 text-slate-400'}`}
    >
      {label}
    </span>
  );
}
