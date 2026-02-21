import { createContext, useContext, useState, useCallback } from 'react';

const VotingContext = createContext(null);

// Sample candidates data
const INITIAL_CANDIDATES = [
  { id: '1', name: 'Alice Johnson', party: 'Progressive Party', manifesto: 'Innovation and growth for all citizens.', votes: 0 },
  { id: '2', name: 'Bob Smith', party: 'Unity Party', manifesto: 'Bringing communities together.', votes: 0 },
  { id: '3', name: 'Carol Williams', party: 'Green Alliance', manifesto: 'Sustainable future for our planet.', votes: 0 },
];

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within VotingProvider');
  }
  return context;
};

export const VotingProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(() => {
    const saved = localStorage.getItem('voting_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  const [electionActive, setElectionActive] = useState(() => {
    const saved = localStorage.getItem('voting_election_active');
    return saved !== null ? saved === 'true' : true;
  });
  const [votedUserIds, setVotedUserIds] = useState(() => {
    try {
      const saved = localStorage.getItem('voting_has_voted');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  });

  const userHasVoted = (userId) => !!votedUserIds[userId];
  const [results, setResults] = useState([]);

  const saveCandidates = useCallback((newCandidates) => {
    setCandidates(newCandidates);
    localStorage.setItem('voting_candidates', JSON.stringify(newCandidates));
  }, []);

  const addCandidate = (candidate) => {
    const newCandidate = {
      ...candidate,
      id: `cand_${Date.now()}`,
      votes: 0,
    };
    saveCandidates([...candidates, newCandidate]);
  };

  const deleteCandidate = (id) => {
    saveCandidates(candidates.filter((c) => c.id !== id));
  };

  const castVote = (candidateId, userId) => {
    if (!userId) return;
    setCandidates((prev) => {
      const updated = prev.map((c) =>
        c.id === candidateId ? { ...c, votes: (c.votes || 0) + 1 } : c
      );
      localStorage.setItem('voting_candidates', JSON.stringify(updated));
      return updated;
    });
    setVotedUserIds((prev) => {
      const next = { ...prev, [userId]: true };
      localStorage.setItem('voting_has_voted', JSON.stringify(next));
      return next;
    });
  };

  const toggleElection = () => {
    const newState = !electionActive;
    setElectionActive(newState);
    localStorage.setItem('voting_election_active', String(newState));
    if (!newState) {
      setResults([...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0)));
    }
  };

  const getResults = () => {
    return [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  };

  return (
    <VotingContext.Provider
      value={{
        candidates,
        electionActive,
        userHasVoted,
        votedUserIds,
        results: results.length ? results : getResults(),
        addCandidate,
        deleteCandidate,
        castVote,
        toggleElection,
        getResults,
        setElectionActive,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
