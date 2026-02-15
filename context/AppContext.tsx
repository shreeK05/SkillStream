import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Asset, Assignment, Role } from '../types';
import { ADMIN_USER, MOCK_ASSETS, MOCK_EMPLOYEES, MOCK_ASSIGNMENTS } from '../data/mockData';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  logOut,
  onAuthChange,
  getUserProfile,
  updateUserProfile,
  getAllUsers
} from '../services/authService';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: Role, department: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  switchRole: (role: Role) => void;
  employees: User[];
  assets: Asset[];
  assignments: Assignment[];
  addAsset: (asset: Asset) => void;
  deleteAsset: (assetId: string) => void;
  assignTraining: (userIds: string[], assetIds: string[]) => void;
  startCourse: (assetId: string) => void;
  updateAssignmentProgress: (assignmentId: string, progress: number, status: string, score?: number) => void;
  getEmployeeAssignments: (userId: string) => Assignment[];
  updateUser: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [employees, setEmployees] = useState<User[]>(MOCK_EMPLOYEES);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setCurrentUser(userProfile);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }

      // Fetch all employees from Firestore to populate dashboard
      try {
        const allUsers = await getAllUsers();
        if (allUsers.length > 0) {
          setEmployees(allUsers);
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);
      }

      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await signInWithEmail(email, password);
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Failed to login. Please check your credentials.');
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, role: Role, department: string) => {
    try {
      const newUser = await signUpWithEmail(email, password, name, role, department);
      setCurrentUser(newUser);
      setEmployees(prev => [...prev, newUser]);
    } catch (error: any) {
      console.error('Signup error:', error);
      alert(error.message || 'Failed to sign up. Please try again.');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      setCurrentUser(user);
      // Add to employees list if not already there
      setEmployees(prev => {
        const exists = prev.find(e => e.id === user.id);
        return exists ? prev : [...prev, user];
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      alert(error.message || 'Failed to sign in with Google.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logOut();
      setCurrentUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const switchRole = (role: Role) => {
    if (role === 'Admin') login(ADMIN_USER.email, 'Admin');
    // Cannot switch to employee if no employee logged in context. 
    // This function was likely for demo toggle. Removing auto-login behavior.
    else {
      logout();
      // optionally navigate to login
    }
  };

  const addAsset = (asset: Asset) => {
    setAssets(prev => [...prev, asset]);
  };

  const deleteAsset = (assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
  };

  const assignTraining = (userIds: string[], assetIds: string[]) => {
    const newAssignments: Assignment[] = [];
    userIds.forEach(userId => {
      assetIds.forEach(assetId => {
        if (!assignments.some(a => a.userId === userId && a.assetId === assetId)) {
          newAssignments.push({
            id: `as-${Date.now()}-${Math.random()}`,
            userId,
            assetId,
            assignedBy: currentUser?.id || 'admin',
            assignedDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            progress: 0,
            attempts: 0
          });
        }
      });
    });
    setAssignments(prev => [...prev, ...newAssignments]);
  };

  const startCourse = (assetId: string) => {
    if (!currentUser) return;
    const existing = assignments.find(a => a.userId === currentUser.id && a.assetId === assetId);
    if (existing) return;

    const newAssignment: Assignment = {
      id: `as-self-${Date.now()}`,
      userId: currentUser.id,
      assetId: assetId,
      assignedBy: 'Self',
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'In-Progress',
      progress: 0,
      attempts: 0
    };

    setAssignments(prev => [...prev, newAssignment]);
  };

  // CORE ADAPTIVE LOGIC
  const runAdaptiveEngine = (updatedAssignments: Assignment[], completedAssignmentId: string, score: number) => {
    const completedAssignment = updatedAssignments.find(a => a.id === completedAssignmentId);
    if (!completedAssignment) return updatedAssignments;

    const completedAsset = assets.find(a => a.id === completedAssignment.assetId);
    if (!completedAsset) return updatedAssignments;

    let modifiedAssignments = [...updatedAssignments];

    // SCENARIO 1: REMEDIAL (Score < 60)
    if (score < 60) {
      console.log(`[Adaptive Engine] User struggled with ${completedAsset.topic}. Finding remedial content.`);

      // Find a Beginner asset of the same topic that isn't already assigned
      const remedialAsset = assets.find(a =>
        a.topic === completedAsset.topic &&
        a.difficulty === 'Beginner' &&
        a.id !== completedAsset.id &&
        !modifiedAssignments.some(ma => ma.userId === currentUser?.id && ma.assetId === a.id)
      );

      if (remedialAsset && currentUser) {
        const remedialAssignment: Assignment = {
          id: `as-remedial-${Date.now()}`,
          userId: currentUser.id,
          assetId: remedialAsset.id,
          assignedBy: 'AdaptiveEngine',
          assignedDate: new Date().toISOString().split('T')[0],
          status: 'Pending', // Force them to take this
          progress: 0,
          attempts: 0
        };
        // Insert it right after the current one if possible, or just append
        modifiedAssignments.push(remedialAssignment);
        alert(`Adaptive Engine: We noticed you struggled with ${completedAsset.title}. We've added "${remedialAsset.title}" to your path to reinforce the concepts.`);
      }
    }

    // SCENARIO 2: FAST-TRACK (Score > 90)
    else if (score > 90) {
      console.log(`[Adaptive Engine] User excelled in ${completedAsset.topic}. Checking for fast-track opportunities.`);

      // Find pending assignments of the same topic that are Intermediate (if user just aced a Beginner/Intermediate)
      const pendingAssignments = modifiedAssignments.filter(a =>
        a.userId === currentUser?.id &&
        a.status === 'Pending' || a.status === 'Locked'
      );

      for (const pending of pendingAssignments) {
        const pendingAsset = assets.find(a => a.id === pending.assetId);
        if (pendingAsset && pendingAsset.topic === completedAsset.topic && pendingAsset.difficulty === 'Intermediate') {
          // Skip/Fast-track this assignment
          pending.status = 'Completed';
          pending.progress = 100;
          pending.score = 100; // Bonus points
          pending.completedDate = new Date().toISOString().split('T')[0];

          alert(`Adaptive Engine: Outstanding performance! You've demonstrated mastery. We're fast-tracking you past "${pendingAsset.title}".`);
        }
      }
    }

    // Unlock next item logic (Simple waterfall)
    // In a real app, this would be a linked list or graph traversal
    // Here we just find Locked items and unlock them if previous is done
    // For MVP, we just unlock everything that was locked if it's the next logical step (simulated)
    modifiedAssignments = modifiedAssignments.map(a => {
      if (a.status === 'Locked') return { ...a, status: 'Pending' as const };
      return a;
    });

    return modifiedAssignments;
  };

  const updateAssignmentProgress = (assignmentId: string, progress: number, status: string, score?: number) => {
    setAssignments(prev => {
      const updated = prev.map(a => {
        if (a.id === assignmentId) {
          return {
            ...a,
            progress,
            status: status as any,
            score: score !== undefined ? score : a.score,
            completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : a.completedDate,
            attempts: score !== undefined ? a.attempts + 1 : a.attempts
          };
        }
        return a;
      });

      // If completed with a score, run adaptive engine
      if (status === 'Completed' || status === 'Failed') {
        if (score !== undefined) {
          return runAdaptiveEngine(updated, assignmentId, score);
        }
      }

      return updated;
    });
  };

  const getEmployeeAssignments = (userId: string) => {
    return assignments.filter(a => a.userId === userId);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);

    // Update in employees list as well if applicable
    setEmployees(prev => prev.map(e => e.id === currentUser.id ? updatedUser : e));

    // Persist to Firebase
    try {
      await updateUserProfile(currentUser.id, updates);
    } catch (error) {
      console.error('Failed to update user profile:', error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading SkillStream...</div>;
  }

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      login,
      signup,
      loginWithGoogle,
      logout,
      switchRole,
      employees,
      assets,
      assignments,
      addAsset,
      deleteAsset,
      assignTraining,
      startCourse,
      updateAssignmentProgress,
      getEmployeeAssignments,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};