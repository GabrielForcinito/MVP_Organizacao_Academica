import { useState, useEffect } from 'react';
import React from 'react';
import { Task, Priority } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Tag, 
  Search,
  Filter,
  X,
  ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('Todas');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIA);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      setTasks(await res.json());
    }
    setLoading(false);
  };

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

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, priority, due_date: date })
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setShowModal(false);
      setTitle('');
      setCategory('');
    }
  };

  const categories = ['Todas', ...Array.from(new Set(tasks.filter(t => t.category).map(t => t.category!)))];
  const filteredTasks = filter === 'Todas' ? tasks : tasks.filter(t => t.category === filter);
  const pendingCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Tarefas</h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{pendingCount} itens pendentes</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Nova Tarefa
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
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence initial={false}>
          {filteredTasks.length > 0 ? filteredTasks.map(task => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={task.id}
              onClick={() => toggleTask(task)}
              className={cn(
                "group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden flex flex-col min-h-[180px]",
                task.completed && "opacity-60 grayscale-[0.5]"
              )}
            >
              {/* Status Indicator Bar */}
              <div className={cn(
                "absolute top-0 left-0 w-full h-1.5",
                task.completed ? "bg-emerald-500" : 
                task.priority === Priority.ALTA ? "bg-rose-500" : "bg-indigo-400"
              )} />

              <div className="flex justify-between items-start mb-4">
                 <span className={cn(
                   "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                   task.completed ? "bg-emerald-50 text-emerald-600" :
                   task.priority === Priority.ALTA ? "bg-rose-50 text-rose-500" : "bg-indigo-50 text-indigo-600"
                 )}>
                   {task.completed ? 'Concluída' : task.priority}
                 </span>
                 <div className={cn(
                   "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                   task.completed ? "bg-emerald-500 border-emerald-500" : "border-slate-200 group-hover:border-indigo-200"
                 )}>
                   {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                 </div>
              </div>

              <h4 className={cn(
                "text-lg font-bold text-slate-800 leading-tight mb-2 pr-4",
                task.completed && "line-through text-slate-400"
              )}>
                {task.title}
              </h4>
              
              <p className="text-sm text-slate-400 font-medium mb-6 line-clamp-2">
                {task.description || 'Sem descrição adicional.'}
              </p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                     <Tag className="w-3.5 h-3.5 text-slate-400" />
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     {task.category || 'Geral'}
                   </span>
                </div>
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">
                  {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
                </span>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-32 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6">
                 <ClipboardList className="w-10 h-10 text-slate-200" />
               </div>
               <p className="text-slate-400 font-bold uppercase tracking-widest">Nenhuma tarefa encontrada</p>
               <button onClick={() => setShowModal(true)} className="mt-4 text-primary font-black text-xs hover:underline uppercase tracking-widest">
                 Criar nova tarefa
               </button>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Add Task Modal */}
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
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Criar Tarefa</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Defina seus próximos passos</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">O que deve ser feito?</label>
                  <input
                    required
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                    placeholder="Ex: Estudar para prova de Cálculo"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Matéria/Categoria</label>
                    <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                      placeholder="Ex: Engenharia"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prioridade</label>
                    <div className="flex gap-2">
                      {[Priority.BAIXA, Priority.MEDIA, Priority.ALTA].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "flex-1 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-tighter transition-all shadow-sm",
                            priority === p 
                              ? p === Priority.ALTA ? "bg-rose-500 text-white" : "bg-indigo-600 text-white"
                              : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Prazo Final</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-[1.25rem] px-6 py-4 outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all mt-4"
                >
                  Salvar Tarefa
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
