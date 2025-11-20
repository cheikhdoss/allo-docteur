import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { User, Stethoscope, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default names updated for Senegal context
    login(role, name || (role === UserRole.DOCTOR ? 'Dr. Ibrahima Fall' : 'Amadou Diallo'));
    navigate(role === UserRole.DOCTOR ? '/doctor-dashboard' : '/patient-dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 xl:w-[600px] z-10 bg-white animate-fade-in-up">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center gap-2 mb-8 cursor-pointer group" onClick={() => navigate('/')}>
               <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">Allo Docteur</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? 'Bon retour parmi nous' : 'Commencez votre parcours'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isLogin ? 'Connectez-vous pour accéder à votre espace.' : 'Créez un compte pour gérer vos rendez-vous.'}
            </p>
          </div>

          <div className="mt-8">
            {/* Role Selection */}
            <div className="mb-6 animate-fade-in-up delay-100">
               <label className="block text-sm font-medium text-slate-700 mb-3">Vous êtes ?</label>
               <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.PATIENT)}
                    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                      role === UserRole.PATIENT 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600 ring-opacity-50 scale-105' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {role === UserRole.PATIENT && <div className="absolute top-2 right-2 text-blue-600 animate-scale-in"><CheckCircle2 size={16} /></div>}
                    <User size={24} className="mb-2" />
                    <span className="font-semibold text-sm">Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.DOCTOR)}
                    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 hover:-translate-y-1 ${
                      role === UserRole.DOCTOR 
                      ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm ring-1 ring-teal-600 ring-opacity-50 scale-105' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {role === UserRole.DOCTOR && <div className="absolute top-2 right-2 text-teal-600 animate-scale-in"><CheckCircle2 size={16} /></div>}
                    <Stethoscope size={24} className="mb-2" />
                    <span className="font-semibold text-sm">Médecin</span>
                  </button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up delay-200">
              {!isLogin && (
                <div className="animate-scale-in">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nom complet</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm border transition-colors"
                      placeholder="Ex: Amadou Diallo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Adresse email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm border transition-colors"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Mot de passe</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm border transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <Button 
                  type="submit" 
                  className={`w-full py-3 flex justify-between items-center group shadow-md transition-all hover:scale-[1.01] hover:shadow-lg ${
                    role === UserRole.DOCTOR ? 'bg-teal-600 hover:bg-teal-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <span>{isLogin ? 'Se connecter' : "Créer mon compte"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>

            <div className="mt-8 animate-fade-in-up delay-300">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Ou continuez avec</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                  {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className={`ml-1 font-medium hover:underline focus:outline-none transition-colors ${
                      role === UserRole.DOCTOR ? 'text-teal-600 hover:text-teal-700' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {isLogin ? "Inscrivez-vous gratuitement" : "Connectez-vous ici"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover animate-scale-in duration-[2s]"
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Medical background"
        />
        <div className={`absolute inset-0 mix-blend-multiply transition-colors duration-500 ${role === UserRole.DOCTOR ? 'bg-teal-600' : 'bg-blue-600'} opacity-80`}></div>
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="max-w-lg animate-slide-in-right delay-200">
             <h3 className="text-4xl font-bold mb-6">
               {role === UserRole.DOCTOR 
                 ? "Rejoignez le réseau de santé n°1 au Sénégal." 
                 : "Votre santé, notre priorité absolue."}
             </h3>
             <p className="text-lg text-white/90 leading-relaxed">
               {role === UserRole.DOCTOR 
                 ? "Gérez votre cabinet, optimisez votre agenda et communiquez facilement avec vos patients grâce à nos outils dédiés aux professionnels." 
                 : "Accédez à des milliers de praticiens, prenez rendez-vous en ligne 24h/24 et 7j/7, et gérez votre dossier médical en toute sécurité."}
             </p>
             
             <div className="mt-10 flex items-center gap-4">
               <div className="flex -space-x-2">
                 <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=A+D&background=random" alt="" />
                 <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=S+M&background=random" alt="" />
                 <img className="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=T+F&background=random" alt="" />
               </div>
               <p className="text-sm font-medium">+2000 patients nous font confiance</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};