import { Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-32 -right-24 w-72 h-72 bg-emerald-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -left-24 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            BlockVote
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Secure Blockchain Voting
          </span>
        </Link>

        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.85)] p-6 sm:p-7">
          <Outlet />
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
        }}
      />
    </div>
  );
}
