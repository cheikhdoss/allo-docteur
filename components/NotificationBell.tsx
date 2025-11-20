
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, MessageSquare, Info, Check } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar size={16} className="text-blue-500" />;
      case 'message': return <MessageSquare size={16} className="text-teal-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-700 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Check size={12} /> Tout marquer comme lu
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 p-2 rounded-full h-fit ${!notif.read ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className={`text-sm ${!notif.read ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                            {notif.title}
                          </p>
                          <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
            <button className="text-xs font-medium text-slate-500 hover:text-slate-800">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
