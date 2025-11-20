
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MessageSquare, User, Clock, ChevronRight, ChevronLeft, BarChart2, MapPin, Edit2, Save, Users, Activity, AlertCircle, CheckCircle, Search, Phone, Video, MoreVertical, Paperclip, Send, X, CalendarCheck, Filter, Plus, Trash2, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { useNotifications } from '../contexts/NotificationContext';

interface Appointment {
  id: string;
  patient: string;
  type: string;
  date: Date; // Javascript Date object for easier calendar math
  duration: number; // in hours
  status: 'upcoming' | 'waiting' | 'done';
  img: string;
  notes?: string;
}

const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'rdv' | 'messages' | 'profile'>('agenda');
  const { user, updateProfile } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  // RDV Management State
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'waiting' | 'done'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRdvData, setNewRdvData] = useState({
    patient: '',
    type: 'Consultation',
    date: '',
    time: '',
    notes: ''
  });

  // Messaging State
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock Data - Generate dates relative to today for the demo
  const generateMockAppointments = (): Appointment[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return [
      { 
        id: '1', 
        patient: 'Aminata Diallo', 
        type: 'Consultation', 
        date: new Date(today.setHours(9, 0, 0, 0)), 
        duration: 1, 
        status: 'upcoming', 
        img: 'AD',
        notes: 'Suivi hypertension. Vérifier tension artérielle.' 
      },
      { 
        id: '2', 
        patient: 'Cheikh Ndiaye', 
        type: 'Urgence', 
        date: new Date(today.setHours(10, 30, 0, 0)), 
        duration: 0.5, 
        status: 'waiting', 
        img: 'CN',
        notes: 'Douleurs thoraciques aiguës.'
      },
      { 
        id: '3', 
        patient: 'Aissatou Ba', 
        type: 'Suivi', 
        date: new Date(today.setHours(11, 15, 0, 0)), 
        duration: 0.75, 
        status: 'done', 
        img: 'AB',
        notes: 'Renouvellement ordonnance.'
      },
      { 
        id: '4', 
        patient: 'Moussa Camara', 
        type: 'Consultation', 
        date: new Date(today.setHours(14, 0, 0, 0)), 
        duration: 1, 
        status: 'upcoming', 
        img: 'MC',
        notes: 'Bilan annuel.'
      },
      { 
        id: '5', 
        patient: 'Fatou Diop', 
        type: 'Consultation', 
        date: new Date(tomorrow.setHours(10, 0, 0, 0)), 
        duration: 1, 
        status: 'upcoming', 
        img: 'FD',
        notes: 'Première consultation.'
      },
    ];
  };

  const [appointments, setAppointments] = useState<Appointment[]>(generateMockAppointments());

  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: 'Mme Aminata Diallo',
      role: 'Patiente - Suivi HTA',
      avatar: 'AD',
      unreadCount: 1,
      lastTime: '10:45',
      online: true,
      messages: [
        { id: 1, text: 'Bonjour Docteur, les douleurs ont repris ce matin malgré le traitement. Dois-je augmenter la dose ?', time: '10:45', isMe: false }
      ]
    },
    {
      id: 2,
      contact: 'M. Cheikh Ndiaye',
      role: 'Patient - Urgence',
      avatar: 'CN',
      unreadCount: 1,
      lastTime: '10:15',
      online: false,
      messages: [
        { id: 1, text: 'Je suis bloqué dans les embouteillages, j\'aurai 10min de retard. Désolé !', time: '10:15', isMe: false }
      ]
    },
    {
      id: 3,
      contact: 'Dr. Sarah Diallo',
      role: 'Confrère - Dermatologue',
      avatar: 'SD',
      unreadCount: 0,
      lastTime: 'Hier',
      online: true,
      messages: [
        { id: 1, text: 'Salut Ibrahima, je t\'envoie le dossier du patient Camara comme convenu.', time: 'Hier', isMe: false },
        { id: 2, text: 'Merci Sarah, je regarde ça ce soir.', time: 'Hier', isMe: true }
      ]
    },
    {
      id: 4,
      contact: 'Laboratoire Bio24',
      role: 'Laboratoire',
      avatar: 'Bio24',
      unreadCount: 0,
      lastTime: 'Hier',
      online: false,
      messages: [
        { id: 1, text: 'Les résultats de Mme Ba sont prêts et disponibles sur le serveur.', time: 'Hier', isMe: false }
      ]
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversationId, conversations]);

  const [editData, setEditData] = useState({
    specialization: user?.specialization || '',
    clinicAddress: user?.clinicAddress || '',
    availabilityHours: user?.availabilityHours || ''
  });

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditingProfile(false);
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
  };

  // Calendar Logic
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Start on Monday
    const days = [];
    for (let i = 0; i < 5; i++) { // Show Mon-Fri
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 08:00 to 18:00

  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const openRescheduleModal = (apt: Appointment) => {
    setSelectedAppointment(apt);
    // Format default values for input type="datetime-local" or separate inputs
    const isoDate = apt.date.toISOString().split('T')[0];
    const timeStr = apt.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setRescheduleDate(isoDate);
    setRescheduleTime(timeStr);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) return;

    const [year, month, day] = rescheduleDate.split('-').map(Number);
    const [hour, minute] = rescheduleTime.split(':').map(Number);
    
    const newDateObj = new Date(year, month - 1, day, hour, minute);

    const updatedAppointments = appointments.map(apt => 
      apt.id === selectedAppointment.id ? { ...apt, date: newDateObj, status: 'upcoming' as const } : apt
    );

    setAppointments(updatedAppointments);
    setIsRescheduleModalOpen(false);
    setSelectedAppointment(null);
    addNotification({
      title: 'Rendez-vous reporté',
      message: `Le rendez-vous de ${selectedAppointment.patient} a été déplacé au ${newDateObj.toLocaleDateString('fr-FR')} à ${newDateObj.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}.`,
      type: 'appointment'
    });
  };

  // RDV Management Actions
  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      const apt = appointments.find(a => a.id === id);
      setAppointments(appointments.filter(a => a.id !== id));
      addNotification({
        title: 'Rendez-vous annulé',
        message: `Le rendez-vous avec ${apt?.patient} a été supprimé.`,
        type: 'system'
      });
    }
  };

  const handleConfirmAppointment = (id: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'upcoming' } : a));
    addNotification({
      title: 'Rendez-vous confirmé',
      message: 'Le statut du rendez-vous est passé à "Confirmé".',
      type: 'appointment'
    });
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRdvData.date || !newRdvData.time || !newRdvData.patient) return;

    const [year, month, day] = newRdvData.date.split('-').map(Number);
    const [hour, minute] = newRdvData.time.split(':').map(Number);
    const newDateObj = new Date(year, month - 1, day, hour, minute);

    const newApt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patient: newRdvData.patient,
      type: newRdvData.type,
      date: newDateObj,
      duration: 1,
      status: 'upcoming',
      img: newRdvData.patient.split(' ').map(n => n[0]).join(''),
      notes: newRdvData.notes
    };

    setAppointments([...appointments, newApt]);
    setIsCreateModalOpen(false);
    setNewRdvData({ patient: '', type: 'Consultation', date: '', time: '', notes: '' });
    addNotification({
      title: 'Rendez-vous créé',
      message: `Rendez-vous ajouté pour ${newRdvData.patient}.`,
      type: 'appointment'
    });
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const filteredAppointments = appointments
    .filter(apt => filterStatus === 'all' ? true : apt.status === filterStatus)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

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
             { label: 'Patients aujourd\'hui', value: appointments.filter(a => a.date.getDate() === new Date().getDate()).length, icon: Users, color: 'bg-blue-50', text: 'text-blue-600', delay: 'delay-100' },
             { label: 'Prochain RDV', value: '14h00', icon: Clock, color: 'bg-amber-50', text: 'text-amber-600', delay: 'delay-200' },
             { label: 'Demandes en attente', value: appointments.filter(a => a.status === 'waiting').length, icon: Activity, color: 'bg-teal-50', text: 'text-teal-600', delay: 'delay-300' }
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
        <div className="flex gap-8 overflow-x-auto">
          {[
            { id: 'agenda', label: 'Agenda', icon: Calendar },
            { id: 'rdv', label: 'Mes Rendez-vous', icon: CalendarCheck },
            { id: 'messages', label: 'Messages', icon: MessageSquare, badge: conversations.filter(c => c.unreadCount > 0).length },
            { id: 'profile', label: 'Mon Profil', icon: User }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-2 text-sm font-medium transition-all relative group whitespace-nowrap ${activeTab === tab.id ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <span className="flex items-center gap-2">
                <tab.icon size={18} className="group-hover:scale-110 transition-transform" /> {tab.label}
                {tab.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">{tab.badge}</span>}
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
            {/* Calendar View */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-slate-800">Agenda</h2>
                  <div className="flex items-center bg-slate-50 rounded-lg p-1">
                    <button onClick={() => changeWeek('prev')} className="p-1 hover:bg-white rounded-md shadow-sm transition-all"><ChevronLeft size={16} /></button>
                    <button onClick={() => changeWeek('next')} className="p-1 hover:bg-white rounded-md shadow-sm transition-all"><ChevronRight size={16} /></button>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                  {weekDays[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              {/* Calendar Grid */}
              <div className="flex-1 overflow-x-auto">
                <div className="min-w-[600px]">
                   {/* Days Header */}
                   <div className="grid grid-cols-6 mb-4">
                      <div className="w-12"></div> {/* Time Column */}
                      {weekDays.map((day, i) => (
                        <div key={i} className="text-center">
                          <p className="text-xs text-slate-500 uppercase font-semibold">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                          <p className={`text-lg font-bold ${day.getDate() === new Date().getDate() ? 'text-teal-600 bg-teal-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-slate-700'}`}>
                            {day.getDate()}
                          </p>
                        </div>
                      ))}
                   </div>

                   {/* Time Slots */}
                   <div className="relative">
                      {/* Grid Lines */}
                      {hours.map((hour) => (
                        <div key={hour} className="grid grid-cols-6 h-20 border-t border-slate-50">
                          <div className="w-12 -mt-2.5 pr-2 text-right text-xs text-slate-400 font-medium">{hour}:00</div>
                          {weekDays.map((_, i) => (
                            <div key={i} className="border-l border-slate-50 h-full relative"></div>
                          ))}
                        </div>
                      ))}

                      {/* Appointments Overlay */}
                      {appointments.map((apt) => {
                        const aptDate = apt.date;
                        const dayIndex = weekDays.findIndex(d => d.getDate() === aptDate.getDate() && d.getMonth() === aptDate.getMonth());
                        
                        if (dayIndex === -1) return null; 

                        const startHour = apt.date.getHours();
                        const startMin = apt.date.getMinutes();
                        const topOffset = (startHour - 8) * 80 + (startMin / 60) * 80; 
                        const height = apt.duration * 80;

                        return (
                          <div 
                            key={apt.id}
                            onClick={() => openRescheduleModal(apt)}
                            className={`absolute z-10 rounded-lg p-2 text-xs border cursor-pointer hover:scale-105 transition-transform shadow-sm overflow-hidden flex flex-col justify-center
                              ${apt.status === 'waiting' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
                                apt.status === 'done' ? 'bg-slate-100 border-slate-200 text-slate-500' : 
                                'bg-teal-50 border-teal-200 text-teal-800'}
                            `}
                            style={{
                              top: `${topOffset}px`,
                              left: `calc(${(dayIndex + 1) * 16.66}% + 2px)`,
                              width: 'calc(16.66% - 4px)',
                              height: `${height}px`
                            }}
                          >
                            <div className="font-bold truncate">{apt.patient}</div>
                            <div className="opacity-80 truncate">{apt.type}</div>
                            {apt.status === 'waiting' && <AlertCircle size={12} className="absolute top-1 right-1 text-amber-600" />}
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Actions / Stats */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-4">
                   <button 
                     onClick={() => addNotification({ title: "Action effectuée", message: "Le créneau a été bloqué avec succès.", type: "system" })}
                     className="flex flex-col items-center justify-center p-4 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md"
                    >
                      <Calendar size={24} className="mb-2" />
                      <span className="text-xs font-bold">Bloquer créneau</span>
                   </button>
                   <button 
                     onClick={() => setIsCreateModalOpen(true)}
                     className="flex flex-col items-center justify-center p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md"
                    >
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

        {activeTab === 'rdv' && (
          <div className="animate-fade-in-up delay-300 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="text-teal-600" /> Gestion des Rendez-vous
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                  {(['all', 'upcoming', 'waiting', 'done'] as const).map(status => (
                     <button
                       key={status}
                       onClick={() => setFilterStatus(status)}
                       className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                         filterStatus === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                       }`}
                     >
                       {status === 'all' ? 'Tous' : status === 'upcoming' ? 'À venir' : status === 'waiting' ? 'En attente' : 'Terminé'}
                     </button>
                  ))}
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="bg-teal-600 hover:bg-teal-700">
                  <Plus size={18} /> <span className="hidden sm:inline ml-2">Nouveau RDV</span>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="p-4">Patient</th>
                    <th className="p-4">Date & Heure</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                             <img src={`https://ui-avatars.com/api/?name=${apt.img}&background=random`} alt="" className="w-10 h-10 rounded-full" />
                             <div>
                               <div className="font-bold text-slate-800">{apt.patient}</div>
                               <div className="text-xs text-slate-500">{apt.notes || 'Aucune note'}</div>
                             </div>
                           </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-800">{apt.date.toLocaleDateString('fr-FR')}</div>
                          <div className="text-xs text-slate-500">{apt.date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {apt.type}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                             apt.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                             apt.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                             'bg-slate-100 text-slate-800'
                          }`}>
                            {apt.status === 'upcoming' ? 'Confirmé' : apt.status === 'waiting' ? 'En attente' : 'Terminé'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {apt.status === 'waiting' && (
                              <button 
                                onClick={() => handleConfirmAppointment(apt.id)}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" 
                                title="Confirmer"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => openRescheduleModal(apt)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Modifier / Détails"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Annuler"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        <div className="flex flex-col items-center">
                          <Calendar className="mb-2 opacity-20" size={48} />
                          <p>Aucun rendez-vous trouvé pour ce filtre.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[650px] flex flex-col md:flex-row animate-fade-in-up delay-300">
             {/* Sidebar - Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-slate-200 bg-slate-50 flex flex-col ${selectedConversationId !== null ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Boîte de réception</h3>
                <div className="bg-teal-100 text-teal-600 px-2 py-1 rounded-lg text-xs font-bold">
                    {conversations.filter(c => c.unreadCount > 0).length} nouveaux
                </div>
              </div>
              <div className="p-3 border-b border-slate-200 bg-white">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Patient ou confrère..." className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50" />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                  <div 
                    key={conv.id} 
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-4 cursor-pointer transition-all border-b border-slate-100 hover:bg-white ${selectedConversationId === conv.id ? 'bg-white border-l-4 border-l-teal-600 shadow-sm' : 'border-l-4 border-l-transparent bg-slate-50/50'}`}
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
                                <p className="text-xs text-teal-600 font-medium">{selectedConversation.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                                <Phone size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
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
                                    ? 'bg-teal-600 text-white rounded-br-none' 
                                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                                }`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-teal-200' : 'text-slate-400'}`}>{msg.time}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <button type="button" className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <input 
                                type="text" 
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Écrivez votre réponse..." 
                                className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-500 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-teal-500/50 focus:bg-white transition-all outline-none"
                            />
                            <button 
                                type="submit" 
                                disabled={!inputMessage.trim()}
                                className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all hover:scale-105"
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
                     <h3 className="text-lg font-bold text-slate-700 mb-2">Messagerie Sécurisée</h3>
                     <p className="text-slate-500 max-w-xs">Gérez vos échanges avec vos patients et confrères en toute confidentialité.</p>
                   </div>
               )}
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

      {/* Create Appointment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-teal-600 p-6 flex justify-between items-start text-white">
                 <div>
                    <h3 className="text-xl font-bold">Nouveau Rendez-vous</h3>
                    <p className="text-teal-100 text-sm">Ajouter manuellement un patient à l'agenda</p>
                 </div>
                 <button onClick={() => setIsCreateModalOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6">
                 <form onSubmit={handleCreateAppointment} className="space-y-4">
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nom du Patient</label>
                       <input 
                         type="text" 
                         required
                         placeholder="Ex: M. Diop"
                         value={newRdvData.patient}
                         onChange={(e) => setNewRdvData({...newRdvData, patient: e.target.value})}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                       <select 
                         value={newRdvData.type}
                         onChange={(e) => setNewRdvData({...newRdvData, type: e.target.value})}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                       >
                         <option value="Consultation">Consultation</option>
                         <option value="Urgence">Urgence</option>
                         <option value="Suivi">Suivi</option>
                         <option value="Visite">Visite</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                         <input 
                           type="date" 
                           required
                           value={newRdvData.date}
                           onChange={(e) => setNewRdvData({...newRdvData, date: e.target.value})}
                           className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Heure</label>
                         <input 
                           type="time" 
                           required
                           value={newRdvData.time}
                           onChange={(e) => setNewRdvData({...newRdvData, time: e.target.value})}
                           className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                         />
                      </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Note (Optionnel)</label>
                       <textarea 
                         rows={3}
                         placeholder="Détails supplémentaires..."
                         value={newRdvData.notes}
                         onChange={(e) => setNewRdvData({...newRdvData, notes: e.target.value})}
                         className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                       />
                    </div>
                    <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                       <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="flex-1">Annuler</Button>
                       <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-md">Ajouter</Button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* Appointment Details & Reschedule Modal */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Détails du RDV</h3>
                    <p className="text-slate-500 text-sm">Consultation avec {selectedAppointment.patient}</p>
                 </div>
                 <button onClick={() => setIsRescheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                 </button>
              </div>
              
              <div className="p-6 space-y-6">
                 {/* Patient Info */}
                 <div className="flex items-center gap-4">
                   <img src={`https://ui-avatars.com/api/?name=${selectedAppointment.img}&background=random`} alt="Patient" className="w-14 h-14 rounded-full" />
                   <div>
                      <h4 className="font-bold text-slate-800">{selectedAppointment.patient}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        selectedAppointment.status === 'waiting' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {selectedAppointment.type}
                      </span>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">Note :</span>
                    {selectedAppointment.notes}
                 </div>

                 <div className="border-t border-slate-100 pt-6">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <Calendar size={18} className="text-teal-500" /> Reporter le rendez-vous
                    </h4>
                    <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nouvelle date</label>
                          <input 
                            type="date" 
                            required
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nouvel horaire</label>
                          <input 
                            type="time" 
                            required
                            value={rescheduleTime}
                            onChange={(e) => setRescheduleTime(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                          />
                       </div>
                       <div className="flex gap-3 mt-6">
                          <Button type="button" variant="ghost" onClick={() => setIsRescheduleModalOpen(false)} className="flex-1">Annuler</Button>
                          <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white shadow-md">Valider</Button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
