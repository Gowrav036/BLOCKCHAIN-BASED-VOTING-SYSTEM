import { createContext, useContext, useState, useCallback } from 'react';
import { verifyFaceMatch } from '../services/blockchain';

const STORAGE_KEY = 'voting_approved_users';

const ApprovedUsersContext = createContext(null);

export const useApprovedUsers = () => {
  const context = useContext(ApprovedUsersContext);
  if (!context) {
    throw new Error('useApprovedUsers must be used within ApprovedUsersProvider');
  }
  return context;
};

const loadApprovedUsers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const ApprovedUsersProvider = ({ children }) => {
  const [approvedUsers, setApprovedUsers] = useState(loadApprovedUsers);

  const save = useCallback((users) => {
    setApprovedUsers(users);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, []);

  const addApprovedUser = (user) => {
    const exists = approvedUsers.some(
      (u) => u.voterId && u.voterId.toLowerCase() === user.voterId.trim().toLowerCase()
    );
    if (exists) return { success: false, error: 'Voter ID already approved' };
    const newUser = {
      id: `user_${Date.now()}`,
      name: user.name.trim(),
      voterId: user.voterId.trim(),
      password: user.password,
      faceSignature: user.faceSignature,
      role: 'user',
    };
    save([...approvedUsers, newUser]);
    return { success: true };
  };

  const removeApprovedUser = (id) => {
    save(approvedUsers.filter((u) => u.id !== id));
  };

  const verifyUser = (voterId, password, liveFaceSignature) => {
    const trimmedId = voterId.trim();
    const user = approvedUsers.find(
      (u) => u.voterId === trimmedId && u.password === password
    );
    if (!user) {
      return {
        success: false,
        error:
          'Invalid voter ID or password. Contact admin if you believe you should have access.',
      };
    }

    if (!user.faceSignature) {
      return {
        success: false,
        error: 'Face data is not registered for this voter. Please contact admin.',
      };
    }

    if (!liveFaceSignature) {
      return {
        success: false,
        error: 'Face verification is required.',
      };
    }

    const faceMatched = verifyFaceMatch(liveFaceSignature, user.faceSignature);
    if (!faceMatched) {
      return {
        success: false,
        error: 'Face verification failed. Please try again with proper lighting.',
      };
    }

    return { success: true, user };
  };

  return (
    <ApprovedUsersContext.Provider
      value={{
        approvedUsers,
        addApprovedUser,
        removeApprovedUser,
        verifyUser,
      }}
    >
      {children}
    </ApprovedUsersContext.Provider>
  );
};
