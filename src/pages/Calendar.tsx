import { useState, useEffect } from 'react';
import { Event, EventType } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  MapPin, 
  Clock,
  ExternalLink,
  MoreVertical,
  Timer,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { 
  format, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek,
  addMonths,
  subMonths
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import React from 'react';

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>(EventType.AULA);
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) setEvents(await res.json());
  };

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month))
  });

  const selectedDateEvents = events.filter(e => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return e.start_time.startsWith(dateStr);
  }).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        type, 
        location, 
        start_time: `${dateStr}T${startTime}:00`, 
        end_time: `${dateStr}T${endTime}:00` 
      })
    });
    if (res.ok) {
      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      setShowModal(false);
      setTitle('');
      setLocation('');
    }
  };

  return (
    <div className="space-y-10">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Sua Agenda</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Organize seus compromissos</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Novo Evento
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Calendar Grid */}
        <section className="lg:col-span-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
              {format(month, 'MMMM yyyy', { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setMonth(subMonths(month, 1))} className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                <ChevronLeft className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
              </button>
              <button onClick={() => setMonth(addMonths(month, 1))} className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                <ChevronRight className="w-5 h-5 text-slate-400 hover:text-indigo-600" />
              </button>
            </div>
          </div>
          <div className="p-10">
            <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {days.map((day, i) => {
                const isCurrentMonth = day.getMonth() === month.getMonth();
                const isSelected = isSameDay(day, selectedDate);
                const dayEvents = events.filter(e => e.start_time.startsWith(format(day, 'yyyy-MM-dd')));
                
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "relative aspect-square flex flex-col items-center justify-center text-sm rounded-2xl cursor-pointer transition-all border-2",
                      !isCurrentMonth && "text-slate-200 border-transparent",
                      isSelected ? "bg-indigo-600 border-indigo-600 text-white font-black shadow-xl shadow-indigo-100 -translate-y-1 scale-105" : 
                      isCurrentMonth ? "bg-white border-slate-50 hover:border-indigo-100 text-slate-600 font-bold" : "border-transparent"
                    )}
                  >
                    {day.getDate()}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-2 flex gap-0.5">
                        {Array.from(new Set(dayEvents.map(e => e.type))).slice(0, 3).map((type, idx) => (
                          <div key={idx} className={cn(
                            "w-1.5 h-1.5 rounded-full ring-2 ring-white transition-all",
                            isSelected ? "bg-white ring-indigo-600" :
                            type === EventType.PROVA ? "bg-rose-500" : type === EventType.TRABALHO ? "bg-amber-400" : "bg-indigo-400"
                          )} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Selected Day Agenda */}
        <section className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex-1 flex flex-col min-h-[400px]">
             <div className="flex justify-between items-end mb-8">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Compromissos</p>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
                   {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                 </h3>
               </div>
             </div>

             <div className="space-y-6">
               {selectedDateEvents.length > 0 ? selectedDateEvents.map(event => (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={event.id} 
                   className="group flex gap-5 items-start p-4 rounded-3xl hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-indigo-600"
                 >
                   <div className="flex flex-col items-center pt-1 shrink-0">
                     <span className="text-xs font-black text-slate-800 leading-none">{format(new Date(event.start_time), 'HH:mm')}</span>
                     <div className="w-0.5 h-4 bg-slate-100 my-1" />
                     <span className="text-[10px] font-bold text-slate-300 leading-none">{format(new Date(event.end_time), 'HH:mm')}</span>
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 px-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                          event.type === EventType.PROVA ? "bg-rose-50 text-rose-500" :
                          event.type === EventType.TRABALHO ? "bg-amber-50 text-amber-500" : "bg-indigo-50 text-indigo-600"
                        )}>
                          {event.type}
                        </span>
                     </div>
                     <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                     {event.location && (
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                         <MapPin className="w-3 h-3" /> {event.location}
                       </p>
                     )}
                   </div>
                 </motion.div>
               )) : (
                 <div className="flex-1 flex flex-col items-center justify-center py-12 opacity-30 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest">Agenda Livre</p>
                 </div>
               )}
             </div>

             <button 
               onClick={() => setShowModal(true)}
               className="mt-8 w-full py-4 bg-white border-2 border-dashed border-slate-100 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-100 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all active:scale-95"
             >
               Adicionar ao Horário
             </button>
           </div>

           {/* Productivity Action Card */}
           <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Timer className="w-5 h-5 text-indigo-300" />
                  <span className="text-[9px] font-black text-indigo-200 uppercase tracking-[0.3em]">IA Focus Engine</span>
                </div>
                <h5 className="text-xl font-bold tracking-tight mb-2">Iniciar Sessão de Foco?</h5>
                <p className="text-[11px] text-indigo-100 opacity-80 leading-relaxed font-medium mb-8">
                  {selectedDateEvents.length > 0 
                    ? `Detectamos sua aula de ${selectedDateEvents[0].title}. Quer que eu bloqueie notificações nos próximos 50min?`
                    : "Parece que você tem um tempo livre. Que tal adiantar as tarefas pendentes?"}
                </p>
                <button className="w-full bg-white text-indigo-900 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10">
                  Dashboard de Foco
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
           </div>
        </section>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Novo Compromisso</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Sincronize seu calendário</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Título do Evento</label>
                  <input
                    required
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                    placeholder="Ex: P1 - Cálculo Diferencial"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Categoria</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as EventType)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 shadow-sm"
                    >
                      <option value={EventType.AULA}>Aula Regular</option>
                      <option value={EventType.PROVA}>Avaliação / Prova</option>
                      <option value={EventType.TRABALHO}>Entrega / Lab</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Ambiente</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                      placeholder="Ex: Sala 402 / Teams"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Hora Início</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Hora Término</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 shadow-sm"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  Salvar Agendamento
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
