// ═══════════════════════════════════════════════════════════════
// SISO OcupaSalud — Hook useAgenda
// FASE 4 — ETAPA K: Agenda médica
// ═══════════════════════════════════════════════════════════════

import { useState, useCallback } from 'react';
import { _ls, sp } from '../../shared/storage/localStorage.js';
import { LS } from '../../shared/storage/storageKeys.js';
import { formatISO } from '../../shared/utils/formatters.js';

export const useAgenda = () => {
  const [appointments, setAppointments] = useState(() => sp('siso_agendados', []));
  const [selectedDate, setSelectedDate] = useState(formatISO(new Date()));

  const loadAppointments = useCallback(() => {
    const data = sp('siso_agendados', []);
    setAppointments(data);
    return data;
  }, []);

  const addAppointment = useCallback((apt) => {
    const entry = { ...apt, id: 'apt_' + Date.now(), estado: 'pendiente', createdAt: new Date().toISOString() };
    const newList = [...appointments, entry];
    _ls.setItem('siso_agendados', JSON.stringify(newList));
    setAppointments(newList);
    return newList;
  }, [appointments]);

  const updateStatus = useCallback((id, estado) => {
    const newList = appointments.map(a => a.id === id ? { ...a, estado } : a);
    _ls.setItem('siso_agendados', JSON.stringify(newList));
    setAppointments(newList);
    return newList;
  }, [appointments]);

  const getAppointmentsByDate = useCallback((date) => {
    return appointments.filter(a => (a.fecha || '').startsWith(date || selectedDate));
  }, [appointments, selectedDate]);

  return { appointments, selectedDate, setSelectedDate, loadAppointments, addAppointment, updateStatus, getAppointmentsByDate };
};