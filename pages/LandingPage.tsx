import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Shield, Sparkles, Search, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl animate-fade-in-up">
                  <span className="block xl:inline">Trouvez votre médecin et</span>{' '}
                  <span className="block text-blue-600 xl:inline">prenez rendez-vous</span>
                </h1>
                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-up delay-100">
                  Allo Docteur est la plateforme la plus simple pour gérer votre santé au Sénégal. Accédez aux disponibilités de milliers de praticiens en temps réel, 24h/24 et 7j/7.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4 animate-fade-in-up delay-200">
                  <div className="rounded-md shadow transition-transform hover:scale-105">
                    <Link to="/auth">
                      <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 shadow-blue-200 shadow-lg">
                        Prendre rendez-vous
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3 transition-transform hover:scale-105">
                    <Link to="/auth">
                      <Button variant="secondary" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-100">
                        Vous êtes praticien ?
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 animate-slide-in-right delay-300">
          <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Médecin souriant avec patient" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:via-white/20"></div>
        </div>
      </div>

      {/* Search Simulation Section */}
      <div className="bg-slate-50 py-16 border-y border-slate-200 relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 animate-fade-in-up">
             <h2 className="text-2xl font-bold text-slate-900">Commencez votre recherche</h2>
          </div>
          
          {/* Improved Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-2 flex flex-col md:flex-row items-center animate-fade-in-up delay-200 hover:shadow-3xl transition-shadow duration-300">
             <div className="flex-1 w-full md:w-auto relative group md:border-r border-slate-100">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 bg-blue-50 p-2 rounded-lg group-focus-within:bg-blue-100 group-focus-within:scale-110 transition-all duration-300">
                   <Search size={20} />
                </div>
                <input 
                   type="text" 
                   placeholder="Médecin, établissement, spécialité..." 
                   className="w-full pl-16 pr-4 py-4 rounded-xl bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium hover:bg-slate-50 focus:bg-white transition-colors"
                   readOnly 
                />
             </div>
             <div className="flex-1 w-full md:w-auto relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 bg-teal-50 p-2 rounded-lg group-focus-within:bg-teal-100 group-focus-within:scale-110 transition-all duration-300">
                   <MapPin size={20} />
                </div>
                <input 
                   type="text" 
                   placeholder="Où ? (ex: Dakar, Plateau)" 
                   className="w-full pl-16 pr-4 py-4 rounded-xl bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium hover:bg-slate-50 focus:bg-white transition-colors"
                   readOnly 
                />
             </div>
             <div className="w-full md:w-auto p-1">
                <Link to="/auth" className="block w-full">
                   <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
                      <Search size={20} strokeWidth={3} />
                      <span className="hidden md:inline">Rechercher</span>
                      <span className="md:hidden">Rechercher un médecin</span>
                   </button>
                </Link>
             </div>
          </div>
          
          <p className="text-center text-sm text-slate-500 mt-6 animate-fade-in-up delay-300 flex justify-center items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             Recherchez parmi 300 000 professionnels de santé
          </p>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center animate-fade-in-up">
            <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase">Pourquoi nous choisir</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Une meilleure façon de prendre soin de vous
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-500 lg:mx-auto">
              Allo Docteur modernise le parcours de soins grâce à des outils intelligents pour patients et médecins.
            </p>
          </div>

          <div className="mt-20">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-16">
              {[
                {
                  name: 'Prise de RDV Simplifiée',
                  description: 'Visualisez les créneaux disponibles et réservez votre consultation physique ou vidéo en quelques clics.',
                  icon: Calendar,
                  color: 'bg-blue-500',
                  delay: 'delay-100'
                },
                {
                  name: 'Assistance Intelligente',
                  description: 'Notre chatbot IA vous guide et notre système vous aide à gérer vos documents médicaux.',
                  icon: Sparkles,
                  color: 'bg-purple-500',
                  delay: 'delay-200'
                },
                {
                  name: 'Communication Fluide',
                  description: 'Échangez des messages sécurisés avec vos praticiens pour le suivi de votre dossier.',
                  icon: MessageSquare,
                  color: 'bg-teal-500',
                  delay: 'delay-300'
                },
                {
                  name: 'Données Sécurisées',
                  description: 'Vos données de santé sont hébergées sur des serveurs agréés HDS (Hébergeur de Données de Santé).',
                  icon: Shield,
                  color: 'bg-indigo-500',
                  delay: 'delay-500'
                },
              ].map((feature, index) => (
                <div key={feature.name} className={`relative animate-fade-in-up ${feature.delay} group cursor-default`}>
                  <dt>
                    <div className={`absolute flex items-center justify-center h-14 w-14 rounded-2xl ${feature.color} text-white shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                      <feature.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <p className="ml-20 text-xl leading-6 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{feature.name}</p>
                  </dt>
                  <dd className="mt-3 ml-20 text-base text-slate-500 leading-relaxed">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 animate-fade-in-up">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white text-lg">A</span>
               </div>
               Allo Docteur
            </h3>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              La plateforme de référence pour la prise de rendez-vous médicaux en ligne au Sénégal. Simple, rapide et sécurisé.
            </p>
            <div className="mt-6 flex gap-4">
               {/* Social placeholders */}
               <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer flex items-center justify-center">FB</div>
               <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-blue-400 transition-colors cursor-pointer flex items-center justify-center">TW</div>
               <div className="w-10 h-10 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors cursor-pointer flex items-center justify-center">IG</div>
            </div>
          </div>
          <div>
             <h4 className="text-white font-bold mb-6">Patients</h4>
             <ul className="space-y-4 text-sm">
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Chercher un médecin</Link></li>
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Mon compte</Link></li>
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Guide santé</Link></li>
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Aide</Link></li>
             </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-6">Praticiens</h4>
             <ul className="space-y-4 text-sm">
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Allo Docteur Pro</Link></li>
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tarifs</Link></li>
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Centre d'aide</Link></li>
               <li><Link to="/auth" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contact</Link></li>
             </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
          &copy; {new Date().getFullYear()} Allo Docteur Sénégal. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};