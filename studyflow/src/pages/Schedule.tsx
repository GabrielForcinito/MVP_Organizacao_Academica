import { useState, useEffect } from 'react';
import { Event, EventType } from '../types';
import { 
  MoreHorizontal, 
  User, 
  Monitor, 
  Library, 
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState('Semanal');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) setEvents(await res.json());
  };

  const daysOfWeek = ['SEGUNDA', 'TERÇA', ' QUARTA', 'QUINTA', 'SEXTA'];
  const today = format(new Date(), 'EEEE', { locale: ptBR }).toUpperCase();

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Grade Horária</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Engenharia de Software • 2024.1</p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-2xl w-fit border border-slate-100">
          <button 
            onClick={() => setView('Semanal')}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", view === 'Semanal' ? "bg-white shadow-xl shadow-slate-200/50 text-indigo-600" : "text-slate-400 hover:text-indigo-600")}
          >
            Semanal
          </button>
          <button 
            onClick={() => setView('Lista')}
            className={cn("px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", view === 'Lista' ? "bg-white shadow-xl shadow-slate-200/50 text-indigo-600" : "text-slate-400 hover:text-indigo-600")}
          >
            Lista
          </button>
        </div>
      </section>

      {/* Weekly Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {daysOfWeek.map((day, dIdx) => (
          <div key={day} className="flex flex-col gap-6">
            <div className={cn(
              "p-6 rounded-[2rem] border transition-all flex flex-col items-center",
              day === today ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105" : "bg-white border-slate-50 shadow-sm"
            )}>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] mb-1">{day === today ? 'HOJE' : day.split(' ')[0]}</span>
              <p className={cn("text-lg font-black tracking-tight", day === today ? "text-white" : "text-slate-800")}>
                {format(new Date(Date.now() + (dIdx - 1) * 24 * 60 * 60 * 1000), 'dd MMM', { locale: ptBR })}
              </p>
            </div>

            {/* Classes per day */}
            <div className="flex flex-col gap-4">
               <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-8 rounded-[2.5rem] shadow-sm border transition-all relative overflow-hidden flex flex-col gap-6",
                  day === today ? "bg-white border-indigo-100 ring-8 ring-indigo-50/50" : "bg-white border-slate-100"
                )}
               >
                 <div className="flex justify-between items-start">
                    <span className={cn(
                      "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest",
                      day === today ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400"
                    )}>
                      08:00
                    </span>
                    <MoreHorizontal className="w-5 h-5 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">Cálculo Diferencial III</h3>
                    <div className="flex items-center gap-2 mt-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Lab 302</span>
                    </div>
                 </div>
                 {day === today && (
                   <div className="mt-2 w-full bg-slate-50 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div initial={{width: 0}} animate={{width: '66%'}} className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full" />
                   </div>
                 )}
               </motion.div>

               <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col gap-6 group hover:border-indigo-100 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-slate-50 text-slate-400 uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      14:00
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">Banco de Dados</h3>
                    <div className="flex items-center gap-2 mt-2 text-slate-400">
                      <User className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Dr. Carlos A.</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Summary Widget */}
        <section className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-2xl font-black text-slate-800 tracking-tighter">Resumo Semanal</h4>
            <Library className="text-slate-200 w-8 h-8" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { label: 'Aulas Totais', val: '12', color: 'indigo' },
              { label: 'Horas Aula', val: '24h', color: 'amber' },
              { label: 'Créditos', val: '20', color: 'emerald' },
              { label: 'Presença', val: '94%', color: 'rose' }
            ].map((stat) => (
              <div key={stat.label} className="p-8 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">{stat.label}</p>
                <p className="text-4xl font-black text-slate-800 tracking-tighter">{stat.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Card */}
        <section className="lg:col-span-4 bg-indigo-900 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-between group">
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-[1.25rem] flex items-center justify-center">
                 <CalendarIcon className="w-6 h-6 text-white" />
               </div>
               <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.25em]">Destaque da Semana</span>
             </div>
             <h4 className="text-3xl font-black tracking-tighter mb-4 leading-none">Prova de Algoritmos</h4>
             <p className="text-sm text-indigo-100 opacity-80 leading-relaxed font-medium">Amanhã • 08:30 às 11:30 • Bloco B - Sala 102</p>
           </div>
           <button className="relative z-10 mt-10 w-full bg-white text-indigo-900 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group/btn">
             Ver Cronograma de Estudos
             <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
           </button>
           <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
        </section>
      </div>
    </div>
  );
}
