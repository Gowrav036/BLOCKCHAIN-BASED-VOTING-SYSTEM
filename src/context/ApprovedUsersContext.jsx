import { createContext, useContext, useState, useCallback } from 'react';

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
    const exists = approvedUsers.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) return { success: false, error: 'Email already approved' };
    const newUser = {
      id: `user_${Date.now()}`,
      name: user.name.trim(),
      email: user.email.trim().toLowerCase(),
      password: user.password,
      role: 'user',
    };
    save([...approvedUsers, newUser]);
    return { success: true };
  };

  const removeApprovedUser = (id) => {
    save(approvedUsers.filter((u) => u.id !== id));
  };

  const verifyUser = (email, password) => {
    const user = approvedUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    return user ? { success: true, user } : { success: false, error: 'Invalid email or password. Contact admin if you believe you should have access.' };
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
