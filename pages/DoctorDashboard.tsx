import React, { useState } from 'react';
import { Calendar, MessageSquare, User, Clock, ChevronRight, BarChart2, MapPin, Edit2, Save, Users, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'messages' | 'profile'>('agenda');
  const { user, updateProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [editData, setEditData] = useState({
    specialization: user?.specialization || '',
    clinicAddress: user?.clinicAddress || '',
    availabilityHours: user?.availabilityHours || ''
  });

  const todayAppointments = [
    { id: '1', patient: 'Aminata Diallo', type: 'Consultation', time: '09:00', status: 'upcoming', img: 'AD' },
    { id: '2', patient: 'Cheikh Ndiaye', type: 'Urgence', time: '10:30', status: 'waiting', img: 'CN' },
    { id: '3', patient: 'Aissatou Ba', type: 'Suivi', time: '11:15', status: 'done', img: 'AB' },
    { id: '4', patient: 'Moussa Camara', type: 'Consultation', time: '14:00', status: 'upcoming', img: 'MC' },
  ];

  const messages = [
    { id: 1, sender: 'Mme Aminata Diallo', text: 'Bonjour Docteur, les douleurs ont repris ce matin malgré le traitement. Dois-je augmenter la dose ?', time: '10:45', unread: true },
    { id: 2, sender: 'M. Cheikh Ndiaye', text: 'Je suis bloqué dans les embouteillages, j\'aurai 10min de retard. Désolé !', time: '10:15', unread: true },
    { id: 3, sender: 'Dr. Sarah Diallo', text: 'Salut Ibrahima, je t\'envoie le dossier du patient Camara comme convenu.', time: 'Hier', unread: false },
    { id: 4, sender: 'Laboratoire Bio24', text: 'Les résultats de Mme Ba sont prêts.', time: 'Hier', unread: false },
  ];

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Welcome & Stats Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 animate-fade-in-up">
           <div>
              <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
              <p className="text-slate-500 mt-1">Bon courage pour votre journée, Dr. {user?.name?.split(' ').pop()}.</p>
           </div>
           <div className="flex gap-2 mt-4 md:mt-0">
             <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> En ligne
             </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Patients aujourd\'hui', value: '4', icon: Users, color: 'bg-blue-50', text: 'text-blue-600', delay: 'delay-100' },
             { label: 'Prochain RDV', value: '14h00', icon: Clock, color: 'bg-amber-50', text: 'text-amber-600', delay: 'delay-200' },
             { label: 'Demandes en attente', value: '2', icon: Activity, color: 'bg-teal-50', text: 'text-teal-600', delay: 'delay-300' }
           ].map((stat, i) => (
             <div key={i} className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-scale-in ${stat.delay} hover:shadow-md transition-shadow`}>
                <div className={`p-3 ${stat.color} rounded-xl ${stat.text}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 mb-8 animate-fade-in-up delay-200">
        <div className="flex gap-8">
          {[
            { id: 'agenda', label: 'Agenda', icon: Calendar },
            { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
            { id: 'profile', label: 'Mon Profil', icon: User }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-sm font-medium transition-all relative group ${activeTab === tab.id ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center gap-2">
                <tab.icon size={18} className="group-hover:scale-110 transition-transform" /> {tab.label}
                {tab.badge && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">{tab.badge}</span>}
              </span>
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-t-full animate-scale-in"></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'agenda' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-300">
            {/* Timeline Agenda */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Planning du jour</h2>
                <span className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                   {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              
              {/* Timeline Layout */}
              <div className="space-y-0 relative before:absolute before:left-16 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                {todayAppointments.map((apt, idx) => (
                  <div key={apt.id} className="relative pl-24 py-4 group animate-slide-in-right" style={{ animationDelay: `${idx * 100}ms` }}>
                    {/* Time Marker */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-14 text-right text-sm font-bold ${apt.status === 'done' ? 'text-slate-400' : 'text-slate-900'}`}>
                      {apt.time}
                    </div>
                    {/* Timeline Dot */}
                    <div className={`absolute left-16 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white ${
                      apt.status === 'done' ? 'bg-slate-300' : 
                      apt.status === 'waiting' ? 'bg-amber-500' : 'bg-teal-500'
                    } shadow-sm z-10 group-hover:scale-125 transition-transform duration-300`}></div>
                    
                    {/* Card */}
                    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      apt.status === 'done' ? 'bg-slate-50 border-slate-200 opacity-70' : 
                      apt.status === 'waiting' ? 'bg-amber-50 border-amber-100 hover:shadow-lg hover:-translate-y-1' :
                      'bg-white border-slate-200 hover:border-teal-300 hover:shadow-lg hover:-translate-y-1'
                    }`}>
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${apt.img}&background=random`} alt="Patient" className="w-10 h-10 rounded-full shadow-sm" />
                        <div>
                          <h3 className="font-bold text-slate-900">{apt.patient}</h3>
                          <div className="flex items-center gap-2 text-xs mt-0.5">
                             <span className={`px-2 py-0.5 rounded-full font-medium ${
                               apt.type === 'Urgence' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                             }`}>{apt.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         {apt.status === 'waiting' && (
                           <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-100 px-2 py-1 rounded-md animate-pulse">
                             <AlertCircle size={12} /> En attente
                           </span>
                         )}
                         {apt.status === 'done' && (
                            <span className="text-green-600"><CheckCircle size={20} /></span>
                         )}
                         <button className="p-2 text-slate-400 hover:text-teal-600 rounded-full hover:bg-teal-50 transition-colors">
                            <ChevronRight size={20} />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions / Stats */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <Calendar size={24} className="mb-2" />
                      <span className="text-xs font-bold">Bloquer créneau</span>
                   </button>
                   <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md">
                      <User size={24} className="mb-2" />
                      <span className="text-xs font-bold">Ajouter patient</span>
                   </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-shadow">
                 <h3 className="font-bold mb-4 flex items-center gap-2">
                   <BarChart2 size={18} className="text-teal-400" />
                   Activité Hebdo
                 </h3>
                 <div className="flex justify-between h-32 gap-2 items-end">
                   {[40, 60, 45, 80, 55, 30, 20].map((h, i) => (
                     <div key={i} className="flex-1 flex flex-col justify-end h-full group">
                       <div style={{ height: `${h}%` }} className="w-full bg-teal-500 rounded-t-sm opacity-80 group-hover:opacity-100 group-hover:scale-y-110 origin-bottom transition-all duration-300 relative">
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="flex justify-between text-xs text-slate-400 mt-2">
                   <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col md:flex-row animate-fade-in-up delay-300">
             <div className="w-full md:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-white">
                <h3 className="font-bold text-slate-800">Boîte de réception</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-slate-100 ${msg.unread ? 'bg-teal-50/60 border-l-4 border-l-teal-500' : 'border-l-4 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {msg.unread && <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></div>}
                        <span className={`font-semibold text-sm ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.sender}</span>
                      </div>
                      <span className="text-xs text-slate-400">{msg.time}</span>
                    </div>
                    <p className={`text-sm truncate ${msg.unread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex w-2/3 flex-col bg-white">
               <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                   <MessageSquare size={32} className="opacity-50" />
                 </div>
                 <p className="font-medium text-slate-400">Sélectionnez une conversation</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-300">
            <div className="md:col-span-1 space-y-6">
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="relative mb-4 group">
                    <img src={user?.avatar} alt="Dr" className="w-32 h-32 rounded-full object-cover border-4 border-teal-50 shadow-md group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Dr. {user?.name}</h2>
                  <p className="text-teal-600 font-medium">{user?.specialization || 'Médecin'}</p>
                  <div className="mt-6 w-full">
                    <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50">
                      Voir ma fiche publique
                    </Button>
                  </div>
               </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <h3 className="text-lg font-bold text-slate-900">Informations du Cabinet</h3>
                     <p className="text-slate-500 text-sm">Visibles par vos patients sur la plateforme</p>
                   </div>
                   <Button variant="ghost" onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}>
                     {isEditingProfile ? <Save size={18} /> : <Edit2 size={18} />}
                     <span className="ml-2">{isEditingProfile ? "Enregistrer" : "Modifier"}</span>
                   </Button>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                           <User size={16} className="text-teal-500" /> Spécialité
                         </label>
                         {isEditingProfile ? (
                            <input 
                              type="text"
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
                              value={editData.specialization}
                              onChange={(e) => setEditData({...editData, specialization: e.target.value})}
                            />
                         ) : (
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                              {user?.specialization || 'Non renseigné'}
                            </div>
                         )}
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                           <MapPin size={16} className="text-teal-500" /> Adresse du cabinet
                         </label>
                         {isEditingProfile ? (
                            <input 
                              type="text"
                              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-shadow"
                              value={editData.clinicAddress}
                              onChange={(e) => setEditData({...editData, clinicAddress: e.target.value})}
                            />
                         ) : (
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-100">
                              {user?.clinicAddress || 'Non renseigné'}
                            </div>
                         )}
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                         <Clock size={16} className="text-teal-500" /> Horaires d'ouverture
                      </label>
                      {isEditingProfile ? (
                        <textarea 
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none min-h-[120px] transition-shadow"
                          value={editData.availabilityHours}
                          onChange={(e) => setEditData({...editData, availabilityHours: e.target.value})}
                        />
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-xl text-slate-700 whitespace-pre-line border border-slate-100 leading-relaxed">
                          {user?.availabilityHours || "Horaires non renseignés"}
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;