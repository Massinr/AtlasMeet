import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { discordLogger } from '../services/DiscordLogger';
import { discordBot } from '../services/DiscordBot';
import { generateWebsiteId } from '../utils/websiteId';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student' | 'dev';
  createdAt: string;
  websiteId: string;
  profilePicture?: string; // Base64 encoded image or URL
  dev?: boolean; // Developer flag
  isApproved?: boolean; // Approval status for new accounts
  approvalStatus?: 'pending' | 'approved' | 'denied'; // Approval status
}

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  password: string;
  createdAt: string;
  websiteId: string;
  profilePicture?: string;
}

export interface CreatedAccount extends DemoAccount {
  isCreated: boolean;
  isApproved?: boolean; // Approval status for new accounts
  approvalStatus?: 'pending' | 'approved' | 'denied'; // Approval status
  denialReason?: string; // Reason for denial
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'teacher' | 'student' | 'dev') => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<boolean>;
  logout: () => void;
  updateProfilePicture: (profilePicture: string) => Promise<boolean>;
  removeProfilePicture: () => Promise<boolean>;
  isLoading: boolean;
  getDemoAccounts: () => DemoAccount[];
  getAllAccounts: () => CreatedAccount[];
  getCreatedAccounts: () => CreatedAccount[];
  deleteAccount: (email: string) => void;
  approveAccount: (userId: string) => Promise<boolean>;
  denyAccount: (userId: string, reason?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Sample users for testing
const getSampleUsers = (): User[] => {
  return [
    {
      id: "sample-teacher-123",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      role: "teacher",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      websiteId: "ATLAS-DEMO-TEACHER-001",
    },
    {
      id: "sample-student-1",
      name: "Alex Chen",
      email: "alex.chen@student.edu",
      role: "student",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      websiteId: "ATLAS-DEMO-STUDENT-001",
    },
    {
      id: "sample-student-2",
      name: "Maria Garcia",
      email: "maria.garcia@student.edu",
      role: "student",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      websiteId: "ATLAS-DEMO-STUDENT-002",
    }
  ];
};

// Demo accounts with passwords
const getDemoAccounts = (): DemoAccount[] => {
  return [
    {
      id: "sample-teacher-123",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      role: "teacher",
      password: "demo123",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      websiteId: "ATLAS-DEMO-TEACHER-001",
    },
    {
      id: "sample-student-1",
      name: "Alex Chen",
      email: "alex.chen@student.edu",
      role: "student",
      password: "demo123",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      websiteId: "ATLAS-DEMO-STUDENT-001",
    },
    {
      id: "sample-student-2",
      name: "Maria Garcia",
      email: "maria.garcia@student.edu",
      role: "student",
      password: "demo123",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      websiteId: "ATLAS-DEMO-STUDENT-002",
    }
  ];
};

// Get created accounts from localStorage
const getCreatedAccountsFromStorage = (): CreatedAccount[] => {
  try {
    const stored = localStorage.getItem('atlasmeet_created_accounts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading created accounts:', error);
    return [];
  }
};

// Save created accounts to localStorage
const saveCreatedAccountsToStorage = (accounts: CreatedAccount[]) => {
  try {
    localStorage.setItem('atlasmeet_created_accounts', JSON.stringify(accounts));
  } catch (error) {
    console.error('Error saving created accounts:', error);
  }
};

const DEV_USERNAME = 'DEVELOPPER_CREDENTIALS_USERNAME';
const DEV_PASSWORD = 'DEVELOPPER_CREDENTIALS_PASSWORD';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [createdAccounts, setCreatedAccounts] = useState<CreatedAccount[]>(getCreatedAccountsFromStorage());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('atlasmeet_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('atlasmeet_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save created accounts whenever they change
  useEffect(() => {
    saveCreatedAccountsToStorage(createdAccounts);
  }, [createdAccounts]);

  const login = async (email: string, password: string, role: 'teacher' | 'student' | 'dev'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Developer login
      if (email === DEV_USERNAME && password === DEV_PASSWORD) {
        const devUser: User = {
          id: 'dev-user',
          name: 'Developer',
          email: DEV_USERNAME,
          role: 'dev',
          createdAt: new Date().toISOString(),
          websiteId: 'ATLAS-DEV-USER',
          dev: true,
          isApproved: true,
          approvalStatus: 'approved',
        };
        setUser(devUser);
        localStorage.setItem('atlasmeet_user', JSON.stringify(devUser));
        setIsLoading(false);
        return true;
      }
      
      // Check demo accounts first
      const demoAccount = getDemoAccounts().find(account => 
        account.email === email && account.password === password && account.role === role
      );
      
      if (demoAccount) {
        const user: User = {
          id: demoAccount.id,
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role,
          createdAt: demoAccount.createdAt,
          websiteId: demoAccount.websiteId,
          profilePicture: demoAccount.profilePicture,
          isApproved: true,
          approvalStatus: 'approved',
        };
        setUser(user);
        localStorage.setItem('atlasmeet_user', JSON.stringify(user));
        setIsLoading(false);
        return true;
      }
      
      // Check created accounts
      const createdAccount = createdAccounts.find(account => 
        account.email === email && account.password === password && account.role === role
      );
      
      if (createdAccount) {
        // DISABLED: All accounts can login immediately for testing
        // For students, they can login immediately (auto-approved)
        // For teachers, they need to be approved
        // if (createdAccount.role === 'student' || createdAccount.isApproved) {
          const user: User = {
            id: createdAccount.id,
            name: createdAccount.name,
            email: createdAccount.email,
            role: createdAccount.role,
            createdAt: createdAccount.createdAt,
            websiteId: createdAccount.websiteId,
            profilePicture: createdAccount.profilePicture,
            isApproved: true, // Force approval for testing
            approvalStatus: 'approved', // Force approval for testing
          };
          setUser(user);
          localStorage.setItem('atlasmeet_user', JSON.stringify(user));
          setIsLoading(false);
          return true;
        // } else {
        //   // Teacher account not approved yet
        //   setIsLoading(false);
        //   return false;
        // }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'teacher' | 'student'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const existingAccount = getAllAccounts().find(account => account.email === email);
      if (existingAccount) {
        setIsLoading(false);
        return false;
      }
      
      const newAccount: CreatedAccount = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
        websiteId: generateWebsiteId(),
        isCreated: true,
        // DISABLED: All accounts are auto-approved for testing
        isApproved: true,
        approvalStatus: 'approved',
      };
      
      setCreatedAccounts(prev => [...prev, newAccount]);
      
      // Log account creation to Discord
      await discordLogger.logAccountCreation({
        userId: newAccount.id,
        userName: newAccount.name,
        userEmail: newAccount.email,
        userRole: newAccount.role,
        websiteId: newAccount.websiteId,
      });
      
      // DISABLED: Approval requests disabled for testing
      // If it's a teacher, send approval request to Discord
      // if (role === 'teacher') {
      //   await discordBot.sendApprovalRequest(
      //     newAccount.id,
      //     newAccount.name,
      //     newAccount.email,
      //     newAccount.role,
      //     newAccount.websiteId
      //   );
      // }
      
      // Auto-login the user after successful registration
      const user: User = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
        createdAt: newAccount.createdAt,
        websiteId: newAccount.websiteId,
        profilePicture: newAccount.profilePicture,
        isApproved: newAccount.isApproved,
        approvalStatus: newAccount.approvalStatus,
      };
      
      setUser(user);
      localStorage.setItem('atlasmeet_user', JSON.stringify(user));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('atlasmeet_user');
  };

  const getCreatedAccounts = (): CreatedAccount[] => {
    return createdAccounts;
  };

  const getAllAccounts = (): CreatedAccount[] => {
    const demoAccounts = getDemoAccounts().map(account => ({
      ...account,
      isCreated: false,
    }));
    return [...demoAccounts, ...createdAccounts];
  };

  const deleteAccount = (email: string) => {
    setCreatedAccounts(prev => prev.filter(account => account.email !== email));
  };

  const updateProfilePicture = async (profilePicture: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = { ...user, profilePicture };
      setUser(updatedUser);
      localStorage.setItem('atlasmeet_user', JSON.stringify(updatedUser));
      
      // Update in created accounts if it's a created account
      setCreatedAccounts(prev => prev.map(account => 
        account.id === user.id 
          ? { ...account, profilePicture }
          : account
      ));
      
      return true;
    } catch (error) {
      console.error('Update profile picture error:', error);
      return false;
    }
  };

  const removeProfilePicture = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const updatedUser = { ...user };
      delete updatedUser.profilePicture;
      setUser(updatedUser);
      localStorage.setItem('atlasmeet_user', JSON.stringify(updatedUser));
      
      // Remove from created accounts if it's a created account
      setCreatedAccounts(prev => prev.map(account => 
        account.id === user.id 
          ? { ...account, profilePicture: undefined }
          : account
      ));
      
      return true;
    } catch (error) {
      console.error('Remove profile picture error:', error);
      return false;
    }
  };

  const approveAccount = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the account to approve
      const updatedAccounts = createdAccounts.map(account => 
        account.id === userId 
          ? { ...account, isApproved: true, approvalStatus: 'approved' as const }
          : account
      );
      
      setCreatedAccounts(updatedAccounts);
      
      // Update user if it's the current user
      if (user && user.id === userId) {
        const updatedUser: User = {
          ...user,
          isApproved: true,
          approvalStatus: 'approved',
        };
        setUser(updatedUser);
        localStorage.setItem('atlasmeet_user', JSON.stringify(updatedUser));
      }
      
      // Log account approval to Discord
      const accountToApprove = createdAccounts.find(acc => acc.id === userId);
      if (accountToApprove) {
        await discordLogger.logAccountApproval({
          userId,
          userName: accountToApprove.name,
          userEmail: accountToApprove.email,
          userRole: accountToApprove.role,
          websiteId: accountToApprove.websiteId,
        });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Approve account error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const denyAccount = async (userId: string, reason?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the account to deny
      const updatedAccounts = createdAccounts.map(account => 
        account.id === userId 
          ? { ...account, isApproved: false, approvalStatus: 'denied' as const, denialReason: reason }
          : account
      );
      
      setCreatedAccounts(updatedAccounts);
      
      // Update user if it's the current user
      if (user && user.id === userId) {
        const updatedUser: User = {
          ...user,
          isApproved: false,
          approvalStatus: 'denied',
        };
        setUser(updatedUser);
        localStorage.setItem('atlasmeet_user', JSON.stringify(updatedUser));
      }
      
      // Log account denial to Discord
      const accountToDeny = createdAccounts.find(acc => acc.id === userId);
      if (accountToDeny) {
        await discordLogger.logAccountDenial({
          userId,
          userName: accountToDeny.name,
          userEmail: accountToDeny.email,
          userRole: accountToDeny.role,
          websiteId: accountToDeny.websiteId,
          reason: reason,
        });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Deny account error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfilePicture,
    removeProfilePicture,
    isLoading,
    getDemoAccounts,
    getAllAccounts,
    getCreatedAccounts,
    deleteAccount,
    approveAccount,
    denyAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 