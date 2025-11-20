import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, MessageSquare, User, MapPin, Filter, FileText, Shield, Edit2, Save, ChevronRight, Star, Clock, AlertCircle, CheckCircle, Send, MoreVertical, Phone, Video, Paperclip, ArrowLeft, GraduationCap, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { useNotifications } from '../contexts/NotificationContext';

interface Doctor {
  id: number;
  name: string;
  spec: string;
  loc: string;
  img: string;
  rating: number;
  reviews: number;
  bio?: string;
  availability?: string[];
}

interface Appointment {
  id: string;
  doctor: string;
  speciality: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  location: string;
}

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'rdv' | 'messages' | 'profile'>('search');
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Tous');
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  // Messaging State
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: 'Dr. Fatou Ndiaye',
      role: 'Cardiologue',
      avatar: 'Dr+Fatou',
      unreadCount: 1,
      lastTime: '10:30',
      online: true,
      messages: [
        { id: 1, text: 'Bonjour, comment vous sentez-vous aujourd\'hui ?', time: '09:00', isMe: false },
        { id: 2, text: 'Bonjour Docteur, un peu mieux mais toujours fatigué.', time: '09:15', isMe: true },
        { id: 3, text: 'Bonjour, vos résultats d\'analyse sont disponibles à la clinique. Vous pouvez passer les récupérer.', time: '10:30', isMe: false }
      ]
    },
    {
      id: 2,
      contact: 'Secrétariat Clinique du Cap',
      role: 'Administration',
      avatar: 'Clinique',
      unreadCount: 1,
      lastTime: '09:15',
      online: true,
      messages: [
        { id: 1, text: 'Rappel : Votre rendez-vous avec Dr. Ndiaye est confirmé pour demain à 14h30.', time: '09:15', isMe: false }
      ]
    },
    {
      id: 3,
      contact: 'Dr. Ousmane Sow',
      role: 'Généraliste',
      avatar: 'Dr+Sow',
      unreadCount: 0,
      lastTime: 'Hier',
      online: false,
      messages: [
        { id: 1, text: 'N\'oubliez pas d\'apporter votre carnet de vaccination lors de la prochaine visite.', time: '14:00', isMe: false },
        { id: 2, text: 'D\'accord Docteur, c\'est noté.', time: '14:05', isMe: true }
      ]
    },
    {
      id: 4,
      contact: 'Service Facturation',
      role: 'Comptabilité',
      avatar: 'Facturation',
      unreadCount: 0,
      lastTime: 'Hier',
      online: true,
      messages: [
        { id: 1, text: 'Votre facture #FAC-2023-892 est disponible dans votre espace documents.', time: 'Hier', isMe: false }
      ]
    }
  ]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversationId, conversations]);

  // Local state for form editing
  const [editData, setEditData] = useState({
    medicalHistory: user?.medicalHistory || '',
    insuranceProvider: user?.insuranceProvider || '',
    insurancePolicyNumber: user?.insurancePolicyNumber || ''
  });

  // State for appointments to allow adding/removing
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', doctor: 'Dr. Fatou Ndiaye', speciality: 'Cardiologue', date: '12 Oct', time: '14:30', status: 'confirmed', location: 'Clinique du Cap, Dakar' },
    { id: '2', doctor: 'Dr. Ousmane Sow', speciality: 'Généraliste', date: '24 Nov', time: '09:15', status: 'pending', location: 'Cabinet Médical Plateau' },
  ]);

  const doctorList: Doctor[] = [
    { 
      id: 1, 
      name: 'Dr. Ousmane Sow', 
      spec: 'Généraliste', 
      loc: 'Dakar Plateau', 
      img: 'Dr+Sow', 
      rating: 4.8, 
      reviews: 124,
      bio: 'Médecin généraliste expérimenté avec plus de 15 ans de pratique. Spécialisé dans le suivi des maladies chroniques et la médecine préventive.',
      availability: ['09:00', '10:30', '14:00', '16:30']
    },
    { 
      id: 2, 
      name: 'Dr. Aminata Faye', 
      spec: 'Dentiste', 
      loc: 'Mermoz, Dakar', 
      img: 'Dr+Faye', 
      rating: 4.9, 
      reviews: 89,
      bio: 'Chirurgien-dentiste passionnée par l\'esthétique dentaire et l\'implantologie. Cabinet équipé des dernières technologies.',
      availability: ['08:30', '11:00', '15:00']
    },
    { 
      id: 3, 
      name: 'Dr. Cheikh Diop', 
      spec: 'Pédiatre', 
      loc: 'Point E, Dakar', 
      img: 'Dr+Diop', 
      rating: 4.7, 
      reviews: 56,
      bio: 'Pédiatre dévoué au bien-être des enfants, du nouveau-né à l\'adolescent. Approche douce et rassurante.',
      availability: ['09:15', '13:45', '16:00', '17:30']
    },
    { 
      id: 4, 
      name: 'Dr. Sarah Diallo', 
      spec: 'Dermatologue', 
      loc: 'Almadies, Dakar', 
      img: 'Dr+Diallo', 
      rating: 4.9, 
      reviews: 210,
      bio: 'Spécialiste des maladies de la peau, des ongles et du cuir chevelu. Expertise en dermatologie esthétique.',
      availability: ['10:00', '11:30', '15:30']
    },
  ];

  const specialties = ['Tous', 'Généraliste', 'Dentiste', 'Pédiatre', 'Cardiologue', 'Dermatologue'];

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditingProfile(false);
    addNotification({
      title: 'Profil mis à jour',
      message: 'Vos informations médicales ont été enregistrées.',
      type: 'system'
    });
  };

  const handleBookAppointment = (doc: Doctor) => {
    // Simulate booking logic
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctor: doc.name,
      speciality: doc.spec,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      time: '09:00', // Default mock time
      status: 'pending',
      location: doc.loc
    };

    setAppointments([newAppointment, ...appointments]);
    setSelectedDoctor(null);
    
    addNotification({
      title: 'Demande envoyée',
      message: `Votre demande de rendez-vous avec ${doc.name} a été transmise.`,
      type: 'appointment'
    });

    // Switch tab to show the new appointment
    setActiveTab('rdv');
  };

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      setAppointments(appointments.filter(a => a.id !== id));
      addNotification({
        title: 'Rendez-vous annulé',
        message: 'Le rendez-vous a été retiré de votre agenda.',
        type: 'system'
      });
    }
  };

  const handleReschedule = (id: string) => {
    const newDate = window.prompt("Veuillez entrer la nouvelle date souhaitée (ex: 25 Dec) :", "25 Dec");
    const newTime = window.prompt("Veuillez entrer le nouvel horaire (ex: 10:00) :", "10:00");

    if (newDate && newTime) {
      setAppointments(prev => prev.map(apt => {
        if (apt.id === id) {
          return {
            ...apt,
            date: newDate,
            time: newTime,
            status: 'pending'
          };
        }
        return apt;
      }));
      
      addNotification({
        title: 'Demande de modification envoyée',
        message: `Votre demande pour le ${newDate} à ${newTime} est en attente de confirmation par le secrétariat.`,
        type: 'message'
      });
    }
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || selectedConversationId === null) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, {
            id: Date.now(),
            text: inputMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
          }],
          lastTime: 'À l\'instant'
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputMessage('');
    
    // Simulate auto-reply
    setTimeout(() => {
        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedConversationId) {
                return {
                    ...conv,
                    messages: [...conv.messages, {
                        id: Date.now() + 1,
                        text: "Merci pour votre message. Je vous répondrai dès que possible.",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isMe: false
                    }]
                };
            }
            return conv;
        }));
        addNotification({
            title: 'Nouveau message',
            message: 'Vous avez reçu une réponse.',
            type: 'message'
        });
    }, 2000);
  };

  const filteredDoctors = doctorList.filter(doc => {
    const matchesSpec = selectedSpecialty === 'Tous' || doc.spec === selectedSpecialty;
    const matchesName = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        doc.spec.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoc = doc.loc.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSpec && matchesName && matchesLoc;
  });

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

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
           <Button 
             variant="primary" 
             onClick={() => setActiveTab('search')}
             className="rounded-full shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all"
            >
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
            onClick={() => {
              setActiveTab(tab.id as any);
              if (tab.id === 'search') setSelectedDoctor(null);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-blue-50 text-blue-700 shadow-sm scale-105' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <tab.icon size={18} className={`transition-colors ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} /> 
            {tab.label}
            {tab.id === 'messages' && conversations.filter(c => c.unreadCount > 0).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 animate-pulse">{conversations.filter(c => c.unreadCount > 0).length}</span>
            )}
            {tab.id === 'rdv' && appointments.length > 0 && (
               <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{appointments.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'search' && (
          selectedDoctor ? (
            <div className="animate-fade-in-up">
              <Button variant="ghost" onClick={() => setSelectedDoctor(null)} className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600">
                <ArrowLeft size={20} /> <span className="ml-2">Retour à la recherche</span>
              </Button>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400 relative">
                  <div className="absolute -bottom-12 left-8">
                     <img 
                        src={`https://ui-avatars.com/api/?name=${selectedDoctor.img}&background=random`} 
                        alt={selectedDoctor.name} 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                     />
                  </div>
                </div>
                <div className="pt-16 pb-8 px-8">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                          {selectedDoctor.name} 
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                             <CheckCircle size={12} /> Vérifié
                          </span>
                        </h2>
                        <p className="text-blue-600 font-medium text-lg mb-2">{selectedDoctor.spec}</p>
                        <p className="text-slate-500 flex items-center gap-2 text-sm">
                          <MapPin size={16} /> {selectedDoctor.loc}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl">
                        <div className="text-center pr-4 border-r border-amber-200">
                          <span className="block text-2xl font-bold text-amber-500">{selectedDoctor.rating}</span>
                          <span className="text-xs text-amber-700 uppercase font-bold flex items-center gap-1 justify-center"><Star size={10} fill="currentColor" /> Note</span>
                        </div>
                        <div className="text-center pl-2">
                          <span className="block text-xl font-bold text-slate-700">{selectedDoctor.reviews}</span>
                          <span className="text-xs text-slate-500 uppercase font-bold">Avis</span>
                        </div>
                      </div>
                   </div>

                   <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-6">
                         <div>
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <Info size={18} className="text-blue-500" /> À propos
                            </h3>
                            <p className="text-slate-600 leading-relaxed">
                              {selectedDoctor.bio || "Aucune description disponible pour ce praticien."}
                            </p>
                         </div>
                         <div>
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                              <GraduationCap size={18} className="text-blue-500" /> Expertises
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Consultation générale</span>
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Suivi pédiatrique</span>
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Vaccination</span>
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Urgences</span>
                            </div>
                         </div>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                         <h3 className="font-bold text-slate-800 mb-4">Prendre rendez-vous</h3>
                         <p className="text-sm text-slate-500 mb-4">Créneaux disponibles pour demain :</p>
                         <div className="grid grid-cols-2 gap-2 mb-6">
                            {selectedDoctor.availability?.map(time => (
                              <button key={time} className="py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                                {time}
                              </button>
                            )) || <p className="text-sm text-slate-400 col-span-2">Aucun créneau affiché.</p>}
                         </div>
                         <Button onClick={() => handleBookAppointment(selectedDoctor)} className="w-full shadow-md hover:shadow-lg">
                            Réserver une consultation
                         </Button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
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
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc, idx) => (
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
                          <Button 
                            variant="outline" 
                            className="flex-1 text-sm py-2"
                            onClick={() => setSelectedDoctor(doc)}
                          >
                            Profil
                          </Button>
                          <Button 
                            onClick={() => handleBookAppointment(doc)}
                            className="flex-1 text-sm py-2 shadow-md hover:shadow-lg transition-shadow bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Prendre RDV
                          </Button>
                        </div>
                      </div>
                      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                        <span>Prochain créneau :</span>
                        <span className="font-semibold text-green-600">Aujourd'hui 14:30</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-slate-400">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Aucun médecin trouvé pour votre recherche.</p>
                    <Button variant="ghost" onClick={() => {setSearchQuery(''); setLocationQuery(''); setSelectedSpecialty('Tous')}} className="mt-2 text-blue-500">
                      Réinitialiser les filtres
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {activeTab === 'rdv' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-200">
            <div className="lg:col-span-2 space-y-6">
               <h3 className="font-bold text-slate-800 text-lg">Vos Rendez-vous ({appointments.length})</h3>
               {appointments.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                   <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                   <p className="text-slate-500 font-medium">Aucun rendez-vous à venir</p>
                   <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('search')}
                   >
                    Trouver un médecin
                   </Button>
                 </div>
               ) : (
                 appointments.map((apt, idx) => (
                   <div key={apt.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-200 duration-300 animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                     {/* Date Card */}
                     <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px] text-blue-700">
                       <span className="text-sm font-semibold uppercase">{apt.date.split(' ').length > 1 ? apt.date.split(' ')[1] : 'Mois'}</span>
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
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${
                             apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                             apt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {apt.status === 'pending' && <Clock size={12} />}
                             {apt.status === 'confirmed' && <CheckCircle size={12} />}
                             {apt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                           </span>
                         </div>
                         <div className="mt-3 flex items-center text-slate-500 text-sm gap-2">
                           <MapPin size={16} /> {apt.location}
                         </div>
                       </div>
                       
                       <div className="mt-4 flex gap-3">
                         <button 
                            onClick={() => handleReschedule(apt.id)}
                            className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors hover:underline flex items-center gap-1"
                          >
                            <Edit2 size={14} /> Reprogrammer
                         </button>
                         <span className="text-slate-300">|</span>
                         <button 
                            onClick={() => handleCancelAppointment(apt.id)}
                            className="text-slate-600 hover:text-red-600 text-sm font-medium transition-colors hover:underline flex items-center gap-1"
                          >
                            <AlertCircle size={14} /> Annuler
                         </button>
                       </div>
                     </div>
                   </div>
                 ))
               )}

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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[650px] flex flex-col md:flex-row animate-fade-in-up delay-200">
            {/* Sidebar - Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col ${selectedConversationId !== null ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Discussions</h3>
                <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold">
                    {conversations.filter(c => c.unreadCount > 0).length} nouveaux
                </div>
              </div>
              <div className="p-3 border-b border-slate-200 bg-white">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                  <div 
                    key={conv.id} 
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-4 cursor-pointer transition-all border-b border-slate-100 hover:bg-white ${selectedConversationId === conv.id ? 'bg-white border-l-4 border-l-blue-600 shadow-sm' : 'border-l-4 border-l-transparent bg-slate-50/50'}`}
                  >
                    <div className="flex items-start gap-3">
                        <div className="relative">
                            <img src={`https://ui-avatars.com/api/?name=${conv.avatar}&background=random`} alt={conv.contact} className="w-10 h-10 rounded-full" />
                            {conv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{conv.contact}</h4>
                                <span className="text-xs text-slate-400">{conv.lastTime}</span>
                            </div>
                            <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                {conv.messages[conv.messages.length - 1].text}
                            </p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className={`w-full md:w-2/3 flex flex-col bg-white ${selectedConversationId === null ? 'hidden md:flex' : 'flex'}`}>
               {selectedConversation ? (
                   <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSelectedConversationId(null)} className="md:hidden p-2 -ml-2 text-slate-500">
                                <ChevronRight className="rotate-180" />
                            </button>
                            <div className="relative">
                                <img src={`https://ui-avatars.com/api/?name=${selectedConversation.avatar}&background=random`} alt="Contact" className="w-10 h-10 rounded-full" />
                                {selectedConversation.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{selectedConversation.contact}</h3>
                                <p className="text-xs text-blue-600 font-medium">{selectedConversation.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                <Phone size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                <Video size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                        <div className="flex justify-center">
                            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Aujourd'hui</span>
                        </div>
                        {selectedConversation.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                                    msg.isMe 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-blue-200' : 'text-slate-400'}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <input 
                                type="text" 
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Écrivez votre message..." 
                                className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-500 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all outline-none"
                            />
                            <button 
                                type="submit" 
                                disabled={!inputMessage.trim()}
                                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all hover:scale-105"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                   </>
               ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                     <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                       <MessageSquare size={40} className="text-slate-300" />
                     </div>
                     <h3 className="text-lg font-bold text-slate-700 mb-2">Vos échanges sécurisés</h3>
                     <p className="text-slate-500 max-w-xs">Sélectionnez une conversation pour échanger avec vos praticiens ou le secrétariat.</p>
                   </div>
               )}
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