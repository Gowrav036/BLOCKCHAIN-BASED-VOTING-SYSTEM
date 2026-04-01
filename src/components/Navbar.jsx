import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { walletAddress, shortAddress, isConnected, connect, disconnect, connecting } = useWallet();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleConnectWallet = async () => {
    const result = await connect();
    if (result.success) {
      toast.success('Wallet connected!');
    } else {
      toast.error('Failed to connect wallet');
    }
  };

  return (
    <nav className="bg-slate-900/80 border-b border-slate-700/40 sticky top-0 z-50 backdrop-blur-xl shadow-[0_12px_30px_rgba(15,23,42,0.75)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user?.role === 'admin' ? '/admin' : user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              BlockVote
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">Blockchain Voting Platform</span>
          </Link>

          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {shortAddress}
                </span>
                <button
                  onClick={disconnect}
                  className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={connecting}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all disabled:opacity-50 shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_12px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.4),0_16px_40px_rgba(16,185,129,0.5)]"
              >
                {connecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}

            {user && (
              <>
                <span className="text-slate-500 text-sm hidden sm:inline">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all text-sm border border-transparent hover:border-slate-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
