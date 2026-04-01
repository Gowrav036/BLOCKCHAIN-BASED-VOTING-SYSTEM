import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = 'blockchain@voting.com';
const ADMIN_PASSWORD = 'Blockchain@123123';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!email.trim()) err.email = 'Email is required';
    if (!password) err.password = 'Password is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Only allow login with the fixed admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      setErrors({
        email: 'Invalid admin credentials',
        password: 'Invalid admin credentials',
      });
      toast.error('Invalid admin credentials');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      login({ id: 'admin1', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' });
      toast.success('Admin login successful!');
      navigate('/admin', { replace: true });
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={ADMIN_EMAIL}
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
        </div>
        <Button type="submit" fullWidth loading={loading}>
          Admin Login
        </Button>
      </form>
      <p className="mt-4 text-center text-slate-500 text-sm">
        <Link to="/" className="text-emerald-400 hover:underline">
          ← Back to Home
        </Link>
      </p>
    </Card>
  );
}
