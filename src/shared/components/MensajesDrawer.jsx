// src/shared/components/MensajesDrawer.jsx — Drawer de mensajes internos
// Panel lateral con lista de mensajes del sistema
import React, { useState, useEffect } from 'react';
import { useBackendList } from '../../hooks/useBackendData';
import { X, MessageCircle, Mail, MailOpen, Trash2 } from 'lucide-react';

export function MensajesDrawer({ isOpen, onClose }) {
  const { data: mensajes, refresh } = useBackendList('siso_mensajes', []);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen, refresh]);

  const filtered = mensajes.filter(m => {
    if (filter === 'unread') return !m.leido;
    return true;
  });

  const marcarLeido = (id) => {
    const updated = mensajes.map(m => m.id === id ? { ...m, leido: true } : m);
    localStorage.setItem('siso_mensajes', JSON.stringify(updated));
    refresh();
  };

  const eliminar = (id) => {
    const updated = mensajes.filter(m => m.id !== id);
    localStorage.setItem('siso_mensajes', JSON.stringify(updated));
    refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-96 max-w-full bg-white shadow-2xl h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-800">Mensajes</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {mensajes.filter(m => !m.leido).length} nuevos
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-2 border-b border-gray-100 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1 rounded-full ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`text-xs px-3 py-1 rounded-full ${filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            No leídos
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No hay mensajes
            </div>
          )}
          {filtered.map(msg => (
            <div key={msg.id || Math.random()} className="px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!msg.leido && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                    <p className={`text-sm truncate ${msg.leido ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                      {msg.asunto || msg.titulo || 'Sin asunto'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{msg.mensaje || msg.texto || ''}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {msg.fecha ? new Date(msg.fecha).toLocaleDateString() : ''}
                    {msg.remitente ? ` · ${msg.remitente}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!msg.leido && (
                    <button onClick={() => marcarLeido(msg.id)} className="p-1 text-gray-400 hover:text-blue-600" title="Marcar leído">
                      <MailOpen className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => eliminar(msg.id)} className="p-1 text-gray-400 hover:text-red-600" title="Eliminar">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}