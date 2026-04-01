import { useEffect, useRef, useState } from 'react';
import { useVoting } from '../../context/VotingContext';
import { useApprovedUsers } from '../../context/ApprovedUsersContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import {
  addCandidate as blockchainAddCandidate,
  createFaceSignature,
} from '../../services/blockchain';

export default function AdminDashboard() {
  const { candidates, electionActive, toggleElection, addCandidate, deleteCandidate, getResults } = useVoting();
  const { approvedUsers, addApprovedUser, removeApprovedUser } = useApprovedUsers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddVoterForm, setShowAddVoterForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', party: '', manifesto: '' });
  const [voterFormData, setVoterFormData] = useState({ name: '', voterId: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [voterLoading, setVoterLoading] = useState(false);
  const [facePreview, setFacePreview] = useState('');
  const [faceSignature, setFaceSignature] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [voterErrors, setVoterErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Name is required';
    if (!formData.party.trim()) err.party = 'Party is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await blockchainAddCandidate(formData);
      addCandidate(formData);
      setFormData({ name: '', party: '', manifesto: '' });
      setShowAddForm(false);
      toast.success('Candidate added successfully!');
    } catch {
      toast.error('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      deleteCandidate(id);
      toast.success('Candidate deleted');
    }
  };

  const validateVoter = () => {
    const err = {};
    if (!voterFormData.name.trim()) err.name = 'Name is required';
    if (!voterFormData.voterId.trim()) err.voterId = 'Voter ID is required';
    if (!voterFormData.password) err.password = 'Password is required';
    else if (voterFormData.password.length < 6) err.password = 'Password must be at least 6 characters';
    if (!faceSignature) err.face = 'Face verification sample is required';
    setVoterErrors(err);
    return Object.keys(err).length === 0;
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setCameraOn(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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
      toast.error('Failed to capture face sample.');
      return;
    }
    setFacePreview(imageDataUrl);
    setFaceSignature(signature);
    setVoterErrors((prev) => ({ ...prev, face: undefined }));
    toast.success('Face sample captured');
  };

  const handleAddVoter = (e) => {
    e.preventDefault();
    if (!validateVoter()) return;
    const result = addApprovedUser({ ...voterFormData, faceSignature });
    if (result.success) {
      setVoterFormData({ name: '', voterId: '', password: '' });
      setFacePreview('');
      setFaceSignature('');
      setShowAddVoterForm(false);
      stopCamera();
      toast.success('Voter approved! They can now login and vote.');
    } else {
      toast.error(result.error);
    }
  };

  const handleRemoveVoter = (id) => {
    if (window.confirm('Remove this voter from approved list?')) {
      removeApprovedUser(id);
      toast.success('Voter removed');
    }
  };

  const handleToggleElection = () => {
    toggleElection();
    toast.success(electionActive ? 'Election ended' : 'Election started');
  };

  const results = getResults();
  const totalVotes = candidates.reduce((s, c) => s + (c.votes || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <p className="text-slate-400 text-sm">Election Status</p>
          <StatusBadge status={electionActive ? 'active' : 'ended'} />
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Total Candidates</p>
          <p className="text-xl font-semibold text-white">{candidates.length}</p>
        </Card>
        <Card>
          <p className="text-slate-400 text-sm">Total Votes</p>
          <p className="text-xl font-semibold text-white">{totalVotes}</p>
        </Card>
        <Card>
          <Button
            onClick={handleToggleElection}
            variant={electionActive ? 'danger' : 'primary'}
          >
            {electionActive ? 'End Election' : 'Start Election'}
          </Button>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-white">Candidates</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)} variant="secondary">
          {showAddForm ? 'Cancel' : 'Add Candidate'}
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add Candidate</h3>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Candidate name"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Party</label>
              <input
                type="text"
                value={formData.party}
                onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Party name"
              />
              {errors.party && <p className="text-red-400 text-sm mt-1">{errors.party}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Manifesto (optional)</label>
              <textarea
                value={formData.manifesto}
                onChange={(e) => setFormData({ ...formData, manifesto: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Brief manifesto"
              />
            </div>
            <Button type="submit" loading={loading}>
              Add Candidate
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 mb-8">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
              <p className="text-emerald-400/90 text-sm">{candidate.party}</p>
              <p className="text-slate-400 text-sm mt-1">{candidate.votes || 0} votes</p>
            </div>
            <Button
              variant="danger"
              onClick={() => handleDelete(candidate.id)}
              className="shrink-0"
            >
              Delete
            </Button>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-white">Approved Voters</h2>
        <Button onClick={() => setShowAddVoterForm(!showAddVoterForm)} variant="secondary">
          {showAddVoterForm ? 'Cancel' : 'Add Voter'}
        </Button>
      </div>

      {showAddVoterForm && (
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Add Approved Voter</h3>
          <p className="text-slate-400 text-sm mb-4">Add voters who are allowed to login and cast a vote.</p>
          <form onSubmit={handleAddVoter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={voterFormData.name}
                onChange={(e) => setVoterFormData({ ...voterFormData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="John Doe"
              />
              {voterErrors.name && <p className="text-red-400 text-sm mt-1">{voterErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Voter ID</label>
              <input
                type="text"
                value={voterFormData.voterId}
                onChange={(e) => setVoterFormData({ ...voterFormData, voterId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. VOTER1234"
              />
              {voterErrors.voterId && <p className="text-red-400 text-sm mt-1">{voterErrors.voterId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={voterFormData.password}
                onChange={(e) => setVoterFormData({ ...voterFormData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Min 6 characters"
              />
              {voterErrors.password && <p className="text-red-400 text-sm mt-1">{voterErrors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Face Verification Sample</label>
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
                    className="w-full max-w-sm rounded-lg border border-slate-600 bg-slate-900"
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
                  alt="Captured face"
                  className="mt-3 h-24 w-24 rounded-lg object-cover border border-emerald-500"
                />
              )}
              {voterErrors.face && <p className="text-red-400 text-sm mt-1">{voterErrors.face}</p>}
            </div>
            <Button type="submit">Add Voter</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 mb-8">
        {approvedUsers.map((voter) => (
          <Card key={voter.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{voter.name}</h3>
              <p className="text-slate-400 text-sm">Voter ID: {voter.voterId}</p>
            </div>
            <Button variant="danger" onClick={() => handleRemoveVoter(voter.id)} className="shrink-0">
              Remove
            </Button>
          </Card>
        ))}
        {approvedUsers.length === 0 && !showAddVoterForm && (
          <Card>
            <p className="text-slate-400 text-center">No approved voters yet. Add voters to allow them to login and vote.</p>
          </Card>
        )}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Voting Results</h2>
        <div className="space-y-3">
          {results.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
              <span className="text-slate-300">
                #{i + 1} {c.name} ({c.party})
              </span>
              <span className="font-semibold text-emerald-400">{c.votes || 0} votes</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
