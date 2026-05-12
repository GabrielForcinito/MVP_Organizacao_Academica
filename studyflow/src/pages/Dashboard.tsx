import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Task, Event, EventType, Priority } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  Plus, 
  Calendar as CalendarIcon,
  BookOpen
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const [tasksRes, eventsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/events')
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
    };
    fetchData();
  }, []);

  const todayTasks = tasks.filter(t => t.due_date === format(new Date(), 'yyyy-MM-dd'));
  const upcomingExams = events.filter(e => e.type === EventType.PROVA);
  
  const productivity = 84; 

  // Calendar logic
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month))
  });

  const toggleTask = async (task: Task) => {
    const updated = !task.completed;
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: updated })
    });
    if (res.ok) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: updated ? 1 : 0 } : t));
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="mt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface tracking-tight">Olá, {user?.name.split(' ')[0]}! 👋</h2>
            <p className="text-sm text-secondary font-medium">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })} • {user?.course}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 min-w-[280px]">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semestre Letivo</span>
              <span className="text-2xl font-bold text-primary">{productivity}%</span>
            </div>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${productivity}%` }}
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)]" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Daily Tasks Summary */}
        <section className="md:col-span-12 lg:col-span-7">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-on-surface tracking-tight">Tarefas Pendentes</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                {todayTasks.filter(t => !t.completed).length} totais
              </span>
            </div>
            
            <div className="space-y-4">
              {todayTasks.length > 0 ? todayTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task)}
                  className="group p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-4"
                >
                  <div className={cn(
                    "w-6 h-6 rounded border-2 transition-all flex items-center justify-center",
                    task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-300"
                  )}>
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className={cn(
                        "text-sm font-bold text-slate-800",
                        task.completed && "line-through text-slate-400"
                      )}>{task.title}</h4>
                      {!task.completed && (
                        <span className={cn(
                          "text-[10px] uppercase font-black tracking-tighter",
                          task.priority === Priority.ALTA ? "text-rose-500" : "text-amber-500"
                        )}>
                          {task.priority === Priority.ALTA ? 'Urgente' : 'Médio'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-secondary mt-0.5">
                      {task.completed ? `Concluído hoje` : `Entrega até ${format(new Date(task.due_date), "HH:mm")}`}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="w-12 h-12 text-slate-200 mb-4" />
                  <p className="text-sm text-secondary font-medium">Você está em dia com suas tarefas!</p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-8">
              <button onClick={() => window.location.href='/tasks'} className="w-full py-4 text-sm text-primary font-bold border-2 border-dashed border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-colors">
                Ver todas as tarefas
              </button>
            </div>
          </div>
        </section>

        {/* Home Calendar Widget */}
        <section className="md:col-span-12 lg:col-span-5 flex flex-col gap-8">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm h-full flex flex-col">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-500" />
              Horário de Hoje
            </h3>
            <div className="flex flex-col gap-6">
              {events.filter(e => isSameDay(new Date(e.start_time), new Date())).length > 0 ? (
                events.filter(e => isSameDay(new Date(e.start_time), new Date())).map((event, idx) => (
                  <div key={event.id} className={cn(
                    "flex gap-4 items-start relative pl-4 border-l-2 p-4 rounded-r-2xl transition-all",
                    idx === 0 ? "border-indigo-600 bg-indigo-50/50" : "border-slate-200 hover:bg-slate-50"
                  )}>
                    <span className={cn(
                      "text-xs font-bold w-12",
                      idx === 0 ? "text-indigo-600" : "text-slate-400"
                    )}>{format(new Date(event.start_time), 'HH:mm')}</span>
                    <div>
                      <h4 className={cn(
                        "text-sm font-bold",
                        idx === 0 ? "text-slate-800" : "text-slate-700"
                      )}>{event.title}</h4>
                      <p className="text-xs text-slate-500">{event.location || 'Sem local'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                   <p className="text-sm text-slate-400 italic">Sem aulas hoje</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
             <div className="relative z-10">
               <span className="bg-indigo-500/30 text-indigo-200 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Próxima Prova</span>
               {upcomingExams.length > 0 ? (
                 <>
                   <h2 className="text-2xl font-bold mt-4">{upcomingExams[0].title}</h2>
                   <div className="flex items-center gap-2 mt-2 opacity-80 text-sm">
                     <CalendarIcon className="w-4 h-4" />
                     <span>{format(new Date(upcomingExams[0].start_time), "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
                   </div>
                 </>
               ) : (
                 <h2 className="text-2xl font-bold mt-4">Nenhuma prova agendada</h2>
               )}
             </div>
             <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
             <div className="absolute right-12 top-0 w-24 h-24 bg-white rounded-full opacity-5"></div>
          </div>
        </section>
      </div>

      {/* FAB */}
      <button className="fixed bottom-24 right-8 w-16 h-16 bg-primary text-on-primary rounded-[1.25rem] shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40 shadow-indigo-200 font-bold text-2xl group">
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
