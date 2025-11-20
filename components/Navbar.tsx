
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Stethoscope, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">Allo Docteur</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-medium text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{user.role === 'doctor' ? 'Médecin' : 'Patient'}</span>
                </div>
                <img src={user.avatar} alt="Profile" className="h-8 w-8 rounded-full border border-slate-200" />
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <button className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 text-sm">
                    Connexion
                  </button>
                </Link>
                <Link to="/auth">
                  <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
                    S'inscrire
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};