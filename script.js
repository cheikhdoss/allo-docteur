
import { GoogleGenAI } from "@google/genai";

// --- STATE MANAGEMENT ---
const state = {
    user: null, // null | { name, role, ... }
    currentView: 'landing', // landing | auth | patient-dashboard | doctor-dashboard
    notifications: [],
    chatOpen: false,
    // History initialized with the model's greeting
    chatMessages: [{ role: 'model', text: "Bonjour ! Je suis l'assistant Allo Docteur. Comment puis-je vous aider ?" }]
};

// --- MOCK DATA ---
const MOCK_DATA = {
    appointments: [
        { id: '1', doctor: 'Dr. Fatou Ndiaye', speciality: 'Cardiologue', date: '12 Oct', time: '14:30', status: 'confirmed', location: 'Clinique du Cap, Dakar' },
        { id: '2', doctor: 'Dr. Ousmane Sow', speciality: 'Généraliste', date: '24 Nov', time: '09:15', status: 'pending', location: 'Cabinet Médical Plateau' },
    ],
    doctorAppointments: [
        { id: '1', patient: 'Aminata Diallo', type: 'Consultation', time: '09:00', status: 'upcoming', img: 'AD' },
        { id: '2', patient: 'Cheikh Ndiaye', type: 'Urgence', time: '10:30', status: 'waiting', img: 'CN' },
        { id: '3', patient: 'Aissatou Ba', type: 'Suivi', time: '11:15', status: 'done', img: 'AB' },
        { id: '4', patient: 'Moussa Camara', type: 'Consultation', time: '14:00', status: 'upcoming', img: 'MC' },
    ],
    messages: [
        { id: 1, sender: 'Dr. Fatou Ndiaye', text: 'Bonjour, vos résultats sont disponibles.', time: '10:30', unread: true },
        { id: 2, sender: 'Secrétariat', text: 'Rappel de votre RDV demain.', time: 'Hier', unread: false },
    ]
};

// --- CORE FUNCTIONS ---

function init() {
    renderApp();
}

function navigateTo(view) {
    state.currentView = view;
    renderApp();
    window.scrollTo(0, 0);
}

function login(role, name) {
    state.user = {
        id: Date.now().toString(),
        name: name,
        role: role, // 'patient' or 'doctor'
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        // Add specific data based on role
        specialization: role === 'doctor' ? 'Cardiologie' : null,
        medicalHistory: role === 'patient' ? 'Allergie Pénicilline' : null
    };
    
    // Setup mock notifications
    state.notifications = [
        { id: 1, title: 'Bienvenue', message: `Bienvenue sur Allo Docteur, ${name}`, read: false, type: 'system' }
    ];
    
    navigateTo(role === 'patient' ? 'patient-dashboard' : 'doctor-dashboard');
}

function logout() {
    state.user = null;
    state.notifications = [];
    state.chatMessages = [{ role: 'model', text: "Bonjour ! Je suis l'assistant Allo Docteur. Comment puis-je vous aider ?" }];
    navigateTo('landing');
}

// --- RENDERING ---

function renderApp() {
    const app = document.getElementById('app');
    if (!app) return;
    
    renderNavbar();
    
    switch(state.currentView) {
        case 'landing':
            app.innerHTML = getLandingPageHTML();
            break;
        case 'auth':
            app.innerHTML = getAuthPageHTML();
            break;
        case 'patient-dashboard':
            if (!state.user) { navigateTo('auth'); return; }
            app.innerHTML = getPatientDashboardHTML();
            break;
        case 'doctor-dashboard':
            if (!state.user) { navigateTo('auth'); return; }
            app.innerHTML = getDoctorDashboardHTML();
            break;
        default:
            app.innerHTML = getLandingPageHTML();
    }
    
    renderChatWidget();
    
    // Initialize Icons
    if(window.lucide) window.lucide.createIcons();
}

function renderNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    const isLoggedIn = !!state.user;
    
    container.innerHTML = `
    <nav class="bg-white border-b border-slate-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center cursor-pointer" onclick="window.app.navigateTo('landing')">
            <div class="flex-shrink-0 flex items-center gap-2">
              <div class="bg-blue-600 p-1.5 rounded-lg">
                <i data-lucide="stethoscope" class="h-6 w-6 text-white"></i>
              </div>
              <span class="font-bold text-xl text-slate-800 tracking-tight">Allo Docteur</span>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            ${isLoggedIn ? `
              <div class="flex items-center gap-4">
                <div class="relative group cursor-pointer">
                    <button class="p-2 text-slate-500 hover:text-blue-600 relative">
                        <i data-lucide="bell" class="w-5 h-5"></i>
                        <span class="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">1</span>
                    </button>
                    <div class="hidden group-hover:block absolute right-0 mt-0 pt-2 w-64 z-50">
                        <div class="bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                            <div class="text-sm p-2 hover:bg-slate-50 rounded cursor-pointer">
                                <p class="font-bold text-slate-800">Bienvenue !</p>
                                <p class="text-xs text-slate-500">Ravi de vous revoir.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="hidden md:flex flex-col items-end">
                  <span class="text-sm font-medium text-slate-900">${state.user.name}</span>
                  <span class="text-xs text-slate-500 capitalize">${state.user.role === 'doctor' ? 'Médecin' : 'Patient'}</span>
                </div>
                <img src="${state.user.avatar}" alt="Profile" class="h-8 w-8 rounded-full border border-slate-200" />
                <button onclick="window.app.logout()" class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <i data-lucide="log-out" class="w-5 h-5"></i>
                </button>
              </div>
            ` : `
              <div class="flex items-center gap-3">
                <button onclick="window.app.navigateTo('auth')" class="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 text-sm">
                  Connexion
                </button>
                <button onclick="window.app.navigateTo('auth')" class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
                  S'inscrire
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    </nav>
    `;
}

function renderChatWidget() {
    const container = document.getElementById('chat-widget-container');
    if (!container) return;

    if (!state.chatOpen) {
        container.innerHTML = `
            <div class="fixed bottom-6 right-6 z-50">
                <button onclick="window.app.toggleChat()" class="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-110 flex items-center gap-2">
                    <i data-lucide="bot" class="w-6 h-6"></i>
                    <span class="font-semibold hidden md:inline">Assistant IA</span>
                </button>
            </div>
        `;
    } else {
        const messagesHTML = state.chatMessages.map(msg => `
            <div class="flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4">
                <div class="max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                }">
                  ${msg.text}
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans animate-fade-in-up">
                <div class="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col border border-slate-200 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-600 to-teal-500 p-4 flex justify-between items-center text-white">
                        <div class="flex items-center gap-2">
                            <i data-lucide="bot" class="w-5 h-5"></i>
                            <h3 class="font-semibold">Assistant Allo Docteur</h3>
                        </div>
                        <button onclick="window.app.toggleChat()" class="hover:bg-white/20 rounded-full p-1 transition-colors">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <div id="chat-messages" class="flex-1 overflow-y-auto p-4 bg-slate-50">
                        ${messagesHTML}
                        <div id="chat-loading" class="hidden flex justify-start mb-4">
                             <div class="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                                <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    </div>

                    <div class="p-3 bg-white border-t border-slate-100">
                        <form onsubmit="window.app.handleChatSubmit(event)" class="flex gap-2">
                            <input id="chat-input" type="text" placeholder="Posez une question..." class="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500" autocomplete="off" />
                            <button type="submit" class="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                                <i data-lucide="send" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        // Scroll to bottom
        setTimeout(() => {
            const chatBox = document.getElementById('chat-messages');
            if(chatBox) chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);
        
        // Focus input if not loading
        setTimeout(() => {
           const input = document.getElementById('chat-input');
           if(input) input.focus();
        }, 50);
    }
    if(window.lucide) window.lucide.createIcons();
}

// --- HTML GENERATORS ---

function getLandingPageHTML() {
    return `
    <div class="flex flex-col min-h-screen">
      <!-- Hero -->
      <div class="relative bg-white overflow-hidden">
        <div class="max-w-7xl mx-auto">
          <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
             <h1 class="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl animate-fade-in-up">
                <span class="block xl:inline">Trouvez votre médecin et</span>
                <span class="block text-blue-600 xl:inline">prenez rendez-vous</span>
             </h1>
             <p class="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl animate-fade-in-up delay-100">
                Allo Docteur est la plateforme la plus simple pour gérer votre santé au Sénégal. Accédez aux disponibilités de milliers de praticiens.
             </p>
             <div class="mt-5 sm:mt-8 sm:flex gap-4 animate-fade-in-up delay-200">
                <button onclick="window.app.navigateTo('auth')" class="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg shadow-lg hover:shadow-xl transition-all">
                    Prendre rendez-vous
                </button>
                <button onclick="window.app.navigateTo('auth')" class="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-100 md:py-4 md:text-lg transition-all">
                    Vous êtes praticien ?
                </button>
             </div>
          </div>
        </div>
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 animate-slide-in-right delay-300">
          <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Doctor">
          <div class="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent lg:via-white/20"></div>
        </div>
      </div>

      <!-- Search Simulation -->
      <div class="bg-slate-50 py-16 border-y border-slate-200 relative z-20">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-2 flex flex-col md:flex-row items-center animate-fade-in-up delay-200 hover:shadow-3xl transition-shadow duration-300">
                 <div class="flex-1 w-full md:w-auto relative p-2 border-b md:border-b-0 md:border-r border-slate-100">
                    <div class="flex items-center gap-3">
                        <i data-lucide="search" class="text-blue-500"></i>
                        <input type="text" placeholder="Médecin, spécialité..." class="w-full py-2 outline-none text-slate-800 font-medium" readonly />
                    </div>
                 </div>
                 <div class="flex-1 w-full md:w-auto relative p-2">
                    <div class="flex items-center gap-3">
                        <i data-lucide="map-pin" class="text-teal-500"></i>
                        <input type="text" placeholder="Où ? (ex: Dakar)" class="w-full py-2 outline-none text-slate-800 font-medium" readonly />
                    </div>
                 </div>
                 <button onclick="window.app.navigateTo('auth')" class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                    Rechercher
                 </button>
            </div>
        </div>
      </div>
      
      <!-- Footer -->
      <footer class="bg-slate-900 text-slate-300 py-12 mt-auto">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2025 Allo Docteur Sénégal. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
    `;
}

function getAuthPageHTML() {
    return `
    <div class="min-h-screen flex bg-white overflow-hidden">
      <!-- Left Side Form -->
      <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2 xl:w-[600px] z-10 bg-white animate-fade-in-up">
        <div class="mx-auto w-full max-w-sm lg:w-96">
            <div class="mb-8 cursor-pointer" onclick="window.app.navigateTo('landing')">
               <span class="font-bold text-2xl text-slate-900">← Allo Docteur</span>
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900 mb-2">Connexion</h2>
            <p class="text-slate-500 mb-8">Accédez à votre espace santé.</p>
            
            <!-- Role Selector -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="role-selector">
                <button onclick="window.app.selectAuthRole('patient')" id="btn-role-patient" class="p-4 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-700 flex flex-col items-center transition-all">
                    <i data-lucide="user" class="mb-2"></i>
                    <span class="font-bold text-sm">Patient</span>
                </button>
                <button onclick="window.app.selectAuthRole('doctor')" id="btn-role-doctor" class="p-4 rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 flex flex-col items-center transition-all">
                    <i data-lucide="stethoscope" class="mb-2"></i>
                    <span class="font-bold text-sm">Médecin</span>
                </button>
            </div>

            <form onsubmit="window.app.handleLogin(event)" class="space-y-5">
                <div>
                    <label class="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" id="auth-email" data-role="patient" class="mt-1 block w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="test@allodocteur.sn" required>
                </div>
                <div>
                    <label class="block text-sm font-medium text-slate-700">Mot de passe</label>
                    <input type="password" class="mt-1 block w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required>
                </div>
                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Se connecter
                </button>
            </form>
        </div>
      </div>
      
      <!-- Right Side Image -->
      <div class="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <img class="absolute inset-0 h-full w-full object-cover animate-scale-in" src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Medical">
        <div class="absolute inset-0 bg-blue-600 mix-blend-multiply opacity-80"></div>
        <div class="absolute inset-0 flex items-center justify-center p-12">
            <h3 class="text-4xl font-bold text-white text-center animate-slide-in-right delay-200">Votre santé, notre priorité absolue.</h3>
        </div>
      </div>
    </div>
    `;
}

function getPatientDashboardHTML() {
    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8 animate-fade-in-up">
            <h1 class="text-3xl font-bold text-slate-900">Bonjour, ${state.user.name}</h1>
            <p class="text-slate-500 flex items-center gap-2 mt-1"><i data-lucide="map-pin" class="w-4 h-4 text-blue-500"></i> Dakar, Sénégal</p>
        </div>
        
        <div class="flex gap-4 overflow-x-auto mb-8 animate-fade-in-up delay-100 pb-2">
            <button class="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-lg font-bold shadow-sm whitespace-nowrap"><i data-lucide="search" class="w-4 h-4"></i> Trouver un médecin</button>
            <button class="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium whitespace-nowrap"><i data-lucide="calendar" class="w-4 h-4"></i> Mes RDV</button>
            <button class="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-lg font-medium whitespace-nowrap"><i data-lucide="message-square" class="w-4 h-4"></i> Messages</button>
        </div>
        
        <div class="space-y-8 animate-fade-in-up delay-200">
             <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <h2 class="text-2xl font-bold mb-2 relative z-10">Besoin d'un médecin ?</h2>
                <div class="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 relative z-10 mt-6">
                    <input type="text" placeholder="Cardiologue, Dentiste..." class="flex-1 p-3 outline-none text-slate-800 placeholder-slate-400 rounded-lg" />
                    <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">Rechercher</button>
                </div>
             </div>
             
             <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 group">
                    <div class="flex items-center gap-4 mb-4">
                        <img src="https://ui-avatars.com/api/?name=Dr+Sow&background=random" class="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                        <div>
                            <h3 class="font-bold text-lg text-slate-900">Dr. Ousmane Sow</h3>
                            <p class="text-blue-600 font-medium text-sm">Généraliste</p>
                        </div>
                    </div>
                    <div class="space-y-2 text-sm text-slate-500 mb-6">
                        <p class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i> Dakar Plateau</p>
                        <p class="flex items-center gap-2"><i data-lucide="star" class="w-4 h-4 text-amber-400 fill-current"></i> 4.8 (124 avis)</p>
                    </div>
                    <button class="w-full py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors">Prendre RDV</button>
                 </div>
                 
                 <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6 group">
                    <div class="flex items-center gap-4 mb-4">
                        <img src="https://ui-avatars.com/api/?name=Dr+Faye&background=random" class="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                        <div>
                            <h3 class="font-bold text-lg text-slate-900">Dr. Aminata Faye</h3>
                            <p class="text-blue-600 font-medium text-sm">Dentiste</p>
                        </div>
                    </div>
                     <div class="space-y-2 text-sm text-slate-500 mb-6">
                        <p class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i> Mermoz, Dakar</p>
                        <p class="flex items-center gap-2"><i data-lucide="star" class="w-4 h-4 text-amber-400 fill-current"></i> 4.9 (89 avis)</p>
                    </div>
                    <button class="w-full py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors">Prendre RDV</button>
                 </div>
             </div>
        </div>
    </div>
    `;
}

function getDoctorDashboardHTML() {
    return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8 flex justify-between items-center animate-fade-in-up">
            <div>
                <h1 class="text-3xl font-bold text-slate-900">Tableau de bord</h1>
                <p class="text-slate-500 mt-1">Dr. ${state.user.name}</p>
            </div>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> En ligne
            </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-scale-in delay-100">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-xl"><i data-lucide="users" class="w-6 h-6"></i></div>
                <div>
                    <p class="text-slate-500 text-sm font-medium">Patients aujourd'hui</p>
                    <h3 class="text-2xl font-bold text-slate-900">4</h3>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 animate-scale-in delay-200">
                <div class="p-3 bg-amber-50 text-amber-600 rounded-xl"><i data-lucide="clock" class="w-6 h-6"></i></div>
                <div>
                    <p class="text-slate-500 text-sm font-medium">Prochain RDV</p>
                    <h3 class="text-2xl font-bold text-slate-900">14h00</h3>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-300">
            <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 class="text-lg font-bold text-slate-800 mb-6">Planning du jour</h2>
                <div class="space-y-0 relative timeline-connector">
                    ${MOCK_DATA.doctorAppointments.map((apt, idx) => `
                        <div class="relative pl-24 py-4 group">
                            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-14 text-right text-sm font-bold text-slate-900">${apt.time}</div>
                            <div class="absolute left-16 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white ${apt.status === 'done' ? 'bg-slate-300' : 'bg-teal-500'} shadow-sm z-10"></div>
                            
                            <div class="flex items-center justify-between p-4 rounded-xl border ${apt.status === 'done' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'} transition-all">
                                <div class="flex items-center gap-4">
                                    <img src="https://ui-avatars.com/api/?name=${apt.patient}&background=random" class="w-10 h-10 rounded-full" />
                                    <div>
                                        <h3 class="font-bold text-slate-900">${apt.patient}</h3>
                                        <span class="text-xs px-2 py-0.5 rounded-full ${apt.type === 'Urgence' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'} font-medium">${apt.type}</span>
                                    </div>
                                </div>
                                <button class="p-2 text-slate-400 hover:text-teal-600"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 class="font-bold text-slate-800 mb-4">Actions Rapides</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <button class="flex flex-col items-center p-4 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-colors">
                            <i data-lucide="calendar" class="mb-2"></i>
                            <span class="text-xs font-bold">Bloquer créneau</span>
                        </button>
                        <button class="flex flex-col items-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                            <i data-lucide="user-plus" class="mb-2"></i>
                            <span class="text-xs font-bold">Nouveau patient</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// --- INTERACTION HANDLERS ---

window.app = {
    navigateTo,
    login,
    logout,
    
    selectAuthRole: (role) => {
        const patientBtn = document.getElementById('btn-role-patient');
        const doctorBtn = document.getElementById('btn-role-doctor');
        const emailInput = document.getElementById('auth-email');
        
        if (!patientBtn || !doctorBtn || !emailInput) return;

        if(role === 'patient') {
            patientBtn.classList.replace('border-slate-200', 'border-blue-600');
            patientBtn.classList.replace('text-slate-500', 'text-blue-700');
            patientBtn.classList.add('bg-blue-50');
            
            doctorBtn.classList.replace('border-teal-600', 'border-slate-200');
            doctorBtn.classList.replace('text-teal-700', 'text-slate-500');
            doctorBtn.classList.remove('bg-teal-50');
        } else {
            doctorBtn.classList.replace('border-slate-200', 'border-teal-600');
            doctorBtn.classList.replace('text-slate-500', 'text-teal-700');
            doctorBtn.classList.add('bg-teal-50');
            
            patientBtn.classList.replace('border-blue-600', 'border-slate-200');
            patientBtn.classList.replace('text-blue-700', 'text-slate-500');
            patientBtn.classList.remove('bg-blue-50');
        }
        emailInput.setAttribute('data-role', role);
    },

    handleLogin: (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('auth-email');
        const role = emailInput ? (emailInput.getAttribute('data-role') || 'patient') : 'patient';
        const name = role === 'patient' ? 'Amadou Diallo' : 'Dr. Ibrahima Fall';
        login(role, name);
    },

    toggleChat: () => {
        state.chatOpen = !state.chatOpen;
        renderChatWidget();
    },

    handleChatSubmit: async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        if (!input) return;
        
        const text = input.value.trim();
        if(!text) return;

        // Add User Message
        state.chatMessages.push({ role: 'user', text });
        
        // Clear input immediately and re-render to show user message
        renderChatWidget();
        
        // Show loading
        const loadingEl = document.getElementById('chat-loading');
        if (loadingEl) loadingEl.classList.remove('hidden');

        // Call AI
        try {
            // Pass the FULL history (including the new user message)
            const responseText = await sendMessageToGemini(state.chatMessages);
            state.chatMessages.push({ role: 'model', text: responseText });
        } catch (error) {
            state.chatMessages.push({ role: 'model', text: "Désolé, je ne peux pas répondre pour le moment." });
            console.error(error);
        }

        renderChatWidget();
    }
};

// --- AI SERVICE ---
async function sendMessageToGemini(history) {
    const apiKey = window.process?.env?.API_KEY;
    
    if (!apiKey) {
        return new Promise(resolve => {
            setTimeout(() => resolve("Mode simulation (Clé API manquante). En production, je répondrai via Gemini 2.5 Flash en tenant compte de votre historique de conversation."), 1000);
        });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Separate the last message (prompt) from the history
        const lastMessage = history[history.length - 1];
        const previousHistory = history.slice(0, -1);

        // Use Chat API for context awareness
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: previousHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            })),
            config: {
                systemInstruction: "Tu es un assistant médical pour Allo Docteur Sénégal. Aide les patients à trouver des médecins à Dakar, à comprendre le fonctionnement du site et à prendre rendez-vous. Sois empathique et professionnel."
            }
        });
        
        const result = await chat.sendMessage({ message: lastMessage.text });
        return result.text;
    } catch (error) {
        console.error("AI Error:", error);
        return "Erreur de connexion au service IA. Veuillez vérifier votre clé API.";
    }
}

// Start
init();
