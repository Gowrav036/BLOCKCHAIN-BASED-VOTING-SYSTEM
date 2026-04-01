import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApprovedUsers } from '../../context/ApprovedUsersContext';
import Button from '../../components/Button';
import Card from '../../components/Card';
import toast from 'react-hot-toast';
import { createFaceSignature } from '../../services/blockchain';

export default function Login() {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [facePreview, setFacePreview] = useState('');
  const [faceSignature, setFaceSignature] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { login } = useAuth();
  const { verifyUser } = useApprovedUsers();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const err = {};
    if (!voterId.trim()) err.voterId = 'Voter ID is required';
    if (!password) err.password = 'Password is required';
    if (!faceSignature) err.face = 'Face verification is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraOn(true);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      toast.error('Unable to access camera. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const captureFace = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      toast.error('Camera is not ready yet. Please wait a moment.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const signature = await createFaceSignature(imageDataUrl);
    if (!signature) {
      toast.error('Failed to capture face verification');
      return;
    }

    setFacePreview(imageDataUrl);
    setFaceSignature(signature);
    setErrors((prev) => ({ ...prev, face: undefined }));
    toast.success('Face captured');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = verifyUser(voterId, password, faceSignature);
      if (result.success) {
        login({
          id: result.user.id,
          name: result.user.name,
          voterId: result.user.voterId,
          role: 'user',
        });
        toast.success('Login successful!');
        stopCamera();
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Invalid credentials');
        setErrors({ submit: result.error });
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-white mb-6">User Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Voter ID</label>
          <input
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter your voter ID"
          />
          {errors.voterId && <p className="text-red-400 text-sm mt-1">{errors.voterId}</p>}
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
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Face Verification</label>
          {!cameraOn ? (
            <Button type="button" variant="secondary" onClick={startCamera}>
              Start Camera
            </Button>
          ) : (
            <div className="space-y-3">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-slate-900 border border-slate-600"
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={captureFace}>
                  Capture Face
                </Button>
                <Button type="button" variant="danger" onClick={stopCamera}>
                  Stop Camera
                </Button>
              </div>
            </div>
          )}
          {facePreview && (
            <img
              src={facePreview}
              alt="Face preview"
              className="mt-3 h-24 w-24 rounded-lg object-cover border border-emerald-500"
            />
          )}
          {errors.face && <p className="text-red-400 text-sm mt-1">{errors.face}</p>}
        </div>
        {errors.submit && <p className="text-red-400 text-sm">{errors.submit}</p>}
        <Button type="submit" fullWidth loading={loading}>
          Login
        </Button>
      </form>
      <p className="mt-4 text-center text-slate-500 text-sm">
        Only approved voters can login. Contact your admin to get your voter ID.
      </p>
    </Card>
  );
}
