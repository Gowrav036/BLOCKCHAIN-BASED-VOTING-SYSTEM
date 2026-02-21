import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      {/* subtle background gradient + grid */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22c55e1a,_transparent_60%),radial-gradient(circle_at_bottom,_#06b6d41a,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_#1e293b33_1px,_transparent_1px),linear-gradient(to_bottom,_#1e293b33_1px,_transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
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
