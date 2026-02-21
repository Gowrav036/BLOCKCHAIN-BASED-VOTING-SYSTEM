import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="py-10 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
        {/* hero copy */}
        <div className="text-center lg:text-left space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Secure · Transparent · On‑chain
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_18px_45px_rgba(45,212,191,0.45)]">
            Next‑gen
            <span className="block">Blockchain Voting Platform</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
            Run tamper‑proof elections with full transparency. Every vote is recorded on the
            blockchain, verifiable by anyone, secured for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_18px_45px_rgba(16,185,129,0.55)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.55),0_24px_60px_rgba(16,185,129,0.75)] transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base shadow-[0_0_0_1px_rgba(16,185,129,0.35),0_18px_45px_rgba(16,185,129,0.55)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.55),0_24px_60px_rgba(16,185,129,0.75)] transition-all"
                >
                  User Login
                </Link>
                <Link
                  to="/admin/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-700/70 hover:border-emerald-400/80 text-slate-200 hover:text-emerald-300 font-semibold text-base bg-slate-900/40 hover:bg-slate-900/80 transition-all"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4 text-left">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-xs">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">Immutable audit trail</p>
                <p className="text-xs text-slate-500">Every vote is traceable on‑chain.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs">
                ⛓
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">End‑to‑end security</p>
                <p className="text-xs text-slate-500">Protected by blockchain cryptography.</p>
              </div>
            </div>
          </div>
        </div>

        {/* visual / stats panel */}
        <div className="relative">
          <div className="relative mx-auto max-w-sm rounded-3xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-xl p-6 shadow-[0_26px_80px_rgba(15,23,42,0.95)] overflow-hidden">
            <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-emerald-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-cyan-500/25 blur-3xl" />

            <div className="relative space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-2">
                  Live Election Snapshot
                </p>
                <p className="text-xl font-semibold text-slate-50">Secure Voting Overview</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-emerald-200/80">
                    Voters
                  </p>
                  <p className="mt-1 text-lg font-semibold text-emerald-50">1,248</p>
                  <p className="mt-1 text-[10px] text-emerald-200/80">verified identities</p>
                </div>
                <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-cyan-200/80">
                    Turnout
                  </p>
                  <p className="mt-1 text-lg font-semibold text-cyan-50">82%</p>
                  <p className="mt-1 text-[10px] text-cyan-200/80">real‑time on‑chain</p>
                </div>
                <div className="rounded-2xl border border-slate-600/60 bg-slate-800/70 px-3 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-slate-300/80">
                    Integrity
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-50">100%</p>
                  <p className="mt-1 text-[10px] text-slate-400/80">audited smart‑contracts</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Blockchain Status
                  </p>
                  <p className="mt-1 text-sm text-slate-100">Network healthy · Blocks finalizing</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
