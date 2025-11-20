
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Notification, UserRole } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Generate mock notifications when user logs in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const mockNotifications: Notification[] = user.role === UserRole.PATIENT 
      ? [
          {
            id: '1',
            title: 'Rappel de Rendez-vous',
            message: 'Votre consultation avec Dr. Fatou Ndiaye est demain à 14h30.',
            type: 'appointment',
            read: false,
            timestamp: 'Il y a 1 heure'
          },
          {
            id: '2',
            title: 'Nouveau Message',
            message: 'Dr. Ousmane Sow vous a envoyé un message concernant vos résultats.',
            type: 'message',
            read: false,
            timestamp: 'Il y a 3 heures'
          }
        ]
      : [
          {
            id: '1',
            title: 'Nouvelle demande de RDV',
            message: 'Mme Aminata Diallo souhaite prendre rendez-vous pour le 25 Octobre.',
            type: 'appointment',
            read: false,
            timestamp: 'Il y a 30 minutes'
          },
          {
            id: '2',
            title: 'Rappel Agenda',
            message: 'Vous avez 4 consultations prévues cet après-midi.',
            type: 'system',
            read: true,
            timestamp: 'Il y a 4 heures'
          }
        ];

    setNotifications(mockNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      timestamp: 'À l\'instant'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
