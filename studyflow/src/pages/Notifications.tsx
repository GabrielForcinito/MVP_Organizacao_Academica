import { useState, useEffect } from 'react';
import { Notification } from '../types';
import { 
  Bell, 
  TriangleAlert, 
  FileText, 
  AlarmClock, 
  School,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('Todas');

  useEffect(() => {
    const fetchNotifs = async () => {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        let data = await res.json();
        if (data.length === 0) {
          data = [
            { id: '1', type: 'Prova', title: 'Calculo Diferencial III', body: 'Sua prova presencial começa amanhã às 08:30 no Bloco C. Não esqueça de revisar os teoremas de Green e Stokes.', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), is_read: 0 },
            { id: '2', type: 'Trabalho', title: 'Projeto de Urbanismo', body: 'O prazo para o upload das pranchas finais encerra em 24 horas. Verifique se os arquivos PDF estão no formato correto.', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), is_read: 0 },
            { id: '3', type: 'Lembrete', title: 'Sessão de Estudos: Química', body: 'Você completou 45 minutos de foco hoje. Mantenha a constância para atingir sua meta semanal de 10 horas.', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), is_read: 1 }
          ];
        }
        setNotifications(data);
      }
    };
    fetchNotifs();
  }, []);

  const categories = ['Todas', 'Provas', 'Trabalhos', 'Lembretes'];
  const filtered = filter === 'Todas' ? notifications : notifications.filter(n => n.type + 's' === filter || n.type === filter);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Avisos</h2>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Mantenha-se atualizado</p>
        </div>
        <button className="text-primary text-[10px] uppercase font-black tracking-[0.2em] px-6 py-3 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors">
          Marcar como lidas
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "flex-none px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              filter === cat 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-100 hover:text-indigo-600"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(n => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={n.id} 
            className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6 relative overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className={cn(
               "absolute top-0 left-0 w-full h-1.5",
               n.is_read ? "bg-slate-100" : "bg-primary"
            )} />

            <div className="flex justify-between items-start">
               {n.type === 'Prova' && (
                 <div className="bg-rose-50 text-rose-500 p-3 rounded-2xl shrink-0">
                   <TriangleAlert className="w-6 h-6" />
                 </div>
               )}
               {n.type === 'Trabalho' && (
                 <div className="bg-amber-50 text-amber-500 p-3 rounded-2xl shrink-0">
                   <FileText className="w-6 h-6" />
                 </div>
               )}
               {n.type === 'Lembrete' && (
                 <div className="bg-indigo-50 text-indigo-500 p-3 rounded-2xl shrink-0">
                   <AlarmClock className="w-6 h-6" />
                 </div>
               )}
               <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{format(new Date(n.date), 'HH:mm', { locale: ptBR })}</span>
            </div>

            <div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest mb-1 block",
                n.type === 'Prova' ? "text-rose-500" : n.type === 'Trabalho' ? "text-amber-500" : "text-indigo-500"
              )}>{n.type === 'Prova' ? 'Prova Pendente' : n.type === 'Trabalho' ? 'Trabalho Acadêmico' : 'Lembrete de Foco'}</span>
              <h3 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">{n.title}</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed font-medium">{n.body}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-50">
              {n.type === 'Prova' && (
                <button className="w-full bg-indigo-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-indigo-100">Ver Cronograma</button>
              )}
              {n.type === 'Trabalho' && (
                <div className="space-y-3">
                  <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 w-3/4 h-full rounded-full" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">75% concluído</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Action Card Example */}
        <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-center min-h-[300px]">
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8">
               <School className="text-white w-8 h-8" />
             </div>
             <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-2">Próximo Evento</p>
             <h3 className="text-3xl font-black tracking-tighter mb-4 leading-none">Matemática Discreta</h3>
             <p className="text-sm text-indigo-100 opacity-80 leading-relaxed font-medium">Sua próxima aula começa em 15 minutos na Sala 402 - Bloco B.</p>
             <button className="mt-10 px-8 py-4 bg-white text-indigo-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
               Ver Localização
             </button>
           </div>
           <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500 rounded-full opacity-20"></div>
           <div className="absolute right-12 top-6 w-24 h-24 bg-white rounded-full opacity-5"></div>
        </div>
      </div>
    </div>
  );
}

function Book(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  );
}
