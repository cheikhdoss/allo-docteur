
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, name: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, name: string) => {
    // Mock login with expanded profile data
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: `${name.toLowerCase().replace(/\s/g, '.')}@allodocteur.sn`,
      role: role,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      
      // Mock data based on role (Senegal Context)
      ...(role === UserRole.PATIENT ? {
        medicalHistory: "Allergie à la chloroquine. Asthme léger.",
        insuranceProvider: "IPM Santé Sénégal",
        insurancePolicyNumber: "SN-89237482"
      } : {
        specialization: "Cardiologie Interventionnelle",
        clinicAddress: "Avenue Cheikh Anta Diop, Fann Hock, Dakar",
        availabilityHours: "Lun-Ven: 09:00 - 18:00"
      })
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
