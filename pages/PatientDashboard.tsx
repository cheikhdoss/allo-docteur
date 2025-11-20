import React, { useState } from 'react';
import { Search, Calendar, MessageSquare, User, MapPin, Clock, Filter, FileText, Shield, Edit2, Save, ChevronRight, Phone, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'rdv' | 'messages' | 'profile'>('search');
  const { user, updateProfile } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Tous');
  
  // Local state for form editing
  const [editData, setEditData] = useState({
    medicalHistory: user?.medicalHistory || '',
    insuranceProvider: user?.insuranceProvider || '',
    insurancePolicyNumber: user?.insurancePolicyNumber || ''
  });

  const appointments = [
    { id: '1', doctor: 'Dr. Fatou Ndiaye', speciality: 'Cardiologue', date: '12 Oct', time: '14:30', status: 'confirmed', location: 'Clinique du Cap, Dakar' },
    { id: '2', doctor: 'Dr. Ousmane Sow', speciality: 'Généraliste', date: '24 Nov', time: '09:15', status: 'pending', location: 'Cabinet Médical Plateau' },
  ];

  const messages = [
    { id: 1, sender: 'Dr. Fatou Ndiaye', text: 'Bonjour, vos résultats d\'analyse sont disponibles à la clinique. Vous pouvez passer les récupérer.', time: '10:30', unread: true },
    { id: 2, sender: 'Secrétariat Clinique du Cap', text: 'Rappel : Votre rendez-vous avec Dr. Ndiaye est confirmé pour demain à 14h30.', time: '09:15', unread: true },
    { id: 3, sender: 'Dr. Ousmane Sow', text: 'N\'oubliez pas d\'apporter votre carnet de vaccination lors de la prochaine visite.', time: 'Hier', unread: false },
    { id: 4, sender: 'Service Facturation', text: 'Votre facture #FAC-2023-892 est disponible dans votre espace documents.', time: 'Hier', unread: false },
  ];

  const doctorList = [
    { id: 1, name: 'Dr. Ousmane Sow', spec: 'Généraliste', loc: 'Dakar Plateau', img: 'Dr+Sow', rating: 4.8, reviews: 124 },
    { id: 2, name: 'Dr. Aminata Faye', spec: 'Dentiste', loc: 'Mermoz, Dakar', img: 'Dr+Faye', rating: 4.9, reviews: 89 },
    { id: 3, name: 'Dr. Cheikh Diop', spec: 'Pédiatre', loc: 'Point E, Dakar', img: 'Dr+Diop', rating: 4.7, reviews: 56 },
    { id: 4, name: 'Dr. Sarah Diallo', spec: 'Dermatologue', loc: 'Almadies, Dakar', img: 'Dr+Diallo', rating: 4.9, reviews: 210 },
  ];

  const specialties = ['Tous', 'Généraliste', 'Dentiste', 'Pédiatre', 'Cardiologue', 'Dermatologue'];

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditingProfile(false);
  };

  const filteredDoctors = selectedSpecialty === 'Tous' 
    ? doctorList 
    : doctorList.filter(doc => doc.spec === selectedSpecialty);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Bonjour, {user?.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <MapPin size={16} className="text-blue-500" />
            Dakar, Sénégal
          </p>
        </div>
        <div className="hidden md:block">
           <Button variant="primary" className="rounded-full shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all">
             <Calendar size={18} />
             Nouveau Rendez-vous
           </Button>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex mb-8 overflow-x-auto max-w-full animate-fade-in-up delay-100">
        {[
          { id: 'search', icon: Search, label: 'Trouver un médecin' },
          { id: 'rdv', icon: Calendar, label: 'Mes Rendez-vous' },
          { id: 'messages', icon: MessageSquare, label: 'Messages' },
          { id: 'profile', icon: User, label: 'Mon Dossier' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-blue-50 text-blue-700 shadow-sm scale-105' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <tab.icon size={18} className={`transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} /> 
            {tab.label}
            {tab.id === 'messages' && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 animate-pulse">2</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fade-in-up delay-200">
            {/* Search Header */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full"></div>
              <h2 className="text-2xl font-bold mb-2 relative z-10">Besoin d'un médecin ?</h2>
              <p className="text-blue-100 mb-6 relative z-10">Trouvez le spécialiste qu'il vous faut parmi nos partenaires agréés.</p>
              
              <div className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 relative z-10">
                <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-100 group">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-focus-within:text-blue-500 group-focus-within:bg-blue-50 transition-colors">
                     <Search size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nom, spécialité, établissement..." 
                    className="w-full p-3 outline-none text-slate-800 placeholder-slate-400 bg-transparent"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 group">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-focus-within:text-blue-500 group-focus-within:bg-blue-50 transition-colors">
                     <MapPin size={20} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Quartier ou ville (ex: Plateau)" 
                    className="w-full p-3 outline-none text-slate-800 placeholder-slate-400 bg-transparent"
                  />
                </div>
                <Button className="rounded-lg px-8 py-3 shadow-md hover:shadow-lg hover:scale-105 transition-all">Rechercher</Button>
              </div>
            </div>

            {/* Filters */}
            <div className="animate-fade-in-up delay-300">
              <h3 className="font-bold text-slate-800 mb-4">Parcourir par spécialité</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {specialties.map((spec, index) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialty(spec)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border hover:scale-105 ${
                      selectedSpecialty === spec 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up delay-300">
              {filteredDoctors.map((doc, idx) => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={`https://ui-avatars.com/api/?name=${doc.img}&background=random`} alt="Dr" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{doc.name}</h3>
                          <p className="text-blue-600 font-medium text-sm">{doc.spec}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-amber-500 fill-current" />
                        <span className="text-xs font-bold text-amber-700">{doc.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-slate-500 text-sm gap-2">
                        <MapPin size={16} className="text-slate-400" /> 
                        {doc.loc}
                      </div>
                      <div className="flex items-center text-slate-500 text-sm gap-2">
                        <MessageSquare size={16} className="text-slate-400" /> 
                        {doc.reviews} avis patients
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 text-sm py-2">Profil</Button>
                      <Button className="flex-1 text-sm py-2 shadow-md hover:shadow-lg transition-shadow">Prendre RDV</Button>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                    <span>Prochain créneau :</span>
                    <span className="font-semibold text-green-600">Aujourd'hui 14:30</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rdv' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-200">
            <div className="lg:col-span-2 space-y-6">
               <h3 className="font-bold text-slate-800 text-lg">Prochains Rendez-vous</h3>
               {appointments.map((apt, idx) => (
                 <div key={apt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 duration-300">
                   {/* Date Card */}
                   <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] text-blue-700">
                     <span className="text-sm font-semibold uppercase">{apt.date.split(' ')[1]}</span>
                     <span className="text-3xl font-bold">{apt.date.split(' ')[0]}</span>
                     <span className="text-xs mt-1 font-medium">{apt.time}</span>
                   </div>
                   
                   <div className="flex-1 flex flex-col justify-between">
                     <div>
                       <div className="flex justify-between items-start">
                         <div>
                           <h3 className="font-bold text-lg text-slate-900">{apt.doctor}</h3>
                           <p className="text-slate-500 font-medium">{apt.speciality}</p>
                         </div>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                           apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                           apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                         }`}>
                           {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                         </span>
                       </div>
                       <div className="mt-3 flex items-center text-slate-500 text-sm gap-2">
                         <MapPin size={16} /> {apt.location}
                       </div>
                     </div>
                     
                     <div className="mt-4 flex gap-3">
                       <button className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors hover:underline">Reprogrammer</button>
                       <span className="text-slate-300">|</span>
                       <button className="text-slate-600 hover:text-red-600 text-sm font-medium transition-colors hover:underline">Annuler</button>
                     </div>
                   </div>
                 </div>
               ))}

               <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center hover:bg-blue-100 transition-colors">
                  <p className="text-blue-800 font-medium mb-3">Besoin d'un autre spécialiste ?</p>
                  <Button onClick={() => setActiveTab('search')} variant="primary" className="bg-blue-600 hover:scale-105 transition-transform">Prendre un nouveau rendez-vous</Button>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">Historique récent</h3>
                  <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {[
                      { date: '10 Sept', doctor: 'Dr. Sow', type: 'Consultation' },
                      { date: '22 Août', doctor: 'Dr. Faye', type: 'Détartrage' },
                      { date: '15 Juil', doctor: 'Dr. Diop', type: 'Vaccination' },
                    ].map((hist, i) => (
                      <div key={i} className="relative pl-6 group cursor-default">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-slate-300 group-hover:bg-blue-500 transition-colors"></div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">{hist.date}</p>
                        <p className="text-sm font-bold text-slate-800">{hist.doctor}</p>
                        <p className="text-xs text-slate-500">{hist.type}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:underline">Voir tout l'historique</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col md:flex-row animate-fade-in-up delay-200">
            <div className="w-full md:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col">
              <div className="p-4 border-b border-slate-200 bg-white">
                <h3 className="font-bold text-slate-800">Discussions</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-slate-100 ${msg.unread ? 'bg-blue-50/60 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {msg.unread && <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-200">
            {/* Left Column - Identity */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
                 <div className="relative mb-4 group">
                    <img src={user?.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500" />
                    <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors hover:scale-110">
                      <Edit2 size={14} />
                    </button>
                 </div>
                 <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                 <p className="text-slate-500 text-sm mb-4">{user?.email}</p>
                 <div className="w-full pt-4 border-t border-slate-100 flex justify-between text-sm">
                    <div className="text-center flex-1 border-r border-slate-100">
                      <span className="block font-bold text-slate-800 text-lg">24</span>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">RDV Passés</span>
                    </div>
                    <div className="text-center flex-1">
                      <span className="block font-bold text-slate-800 text-lg">2</span>
                      <span className="text-slate-500 text-xs uppercase tracking-wide">À venir</span>
                    </div>
                 </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white transform transition-transform hover:-translate-y-1">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Shield size={20} className="text-blue-200" /> Couverture
                </h3>
                <p className="text-blue-100 text-sm mb-6">Vos informations d'assurance sont utilisées pour la facturation.</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-semibold">Organisme / IPM</p>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        className="w-full mt-1 p-2 bg-blue-700/50 border border-blue-500/50 rounded text-white placeholder-blue-300 focus:outline-none focus:bg-blue-700"
                        value={editData.insuranceProvider}
                        onChange={(e) => setEditData({...editData, insuranceProvider: e.target.value})}
                      />
                    ) : (
                      <p className="font-medium text-lg">{user?.insuranceProvider || "Non renseigné"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 uppercase font-semibold">N° Matricule</p>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        className="w-full mt-1 p-2 bg-blue-700/50 border border-blue-500/50 rounded text-white placeholder-blue-300 focus:outline-none focus:bg-blue-700"
                        value={editData.insurancePolicyNumber}
                        onChange={(e) => setEditData({...editData, insurancePolicyNumber: e.target.value})}
                      />
                    ) : (
                      <p className="font-mono tracking-wider opacity-90">{user?.insurancePolicyNumber || "---"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Medical Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <FileText className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">Dossier Médical</h3>
                      <p className="text-slate-500 text-sm">Informations partagées avec vos médecins</p>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}>
                    {isEditingProfile ? (
                      <>
                        <Save size={18} /> <span className="ml-2">Enregistrer</span>
                      </>
                    ) : (
                      <>
                        <Edit2 size={18} /> <span className="ml-2">Modifier</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Antécédents & Allergies</label>
                  {isEditingProfile ? (
                    <textarea 
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px] bg-white"
                      value={editData.medicalHistory}
                      onChange={(e) => setEditData({...editData, medicalHistory: e.target.value})}
                      placeholder="Listez ici vos allergies, traitements en cours, antécédents chirurgicaux..."
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {user?.medicalHistory || "Aucune information renseignée. Il est recommandé de remplir cette section pour vos praticiens."}
                    </p>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer bg-white group">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                          <FileText size={18} />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-slate-800">Dernière ordonnance</p>
                          <p className="text-slate-500">12 Oct 2024</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                   </div>
                   <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer bg-white group">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                          <FileText size={18} />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-slate-800">Résultats d'analyse</p>
                          <p className="text-slate-500">10 Sept 2024</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
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

export default PatientDashboard;