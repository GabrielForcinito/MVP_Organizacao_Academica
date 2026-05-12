import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Moon, 
  Bell, 
  School, 
  Info, 
  LogOut, 
  Edit2,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import React from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-12 max-w-2xl mx-auto px-4 sm:px-0">
      {/* Profile Hero */}
      <section className="text-center py-10 relative overflow-hidden group">
        <div className="relative inline-block mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-[2.5rem] p-1.5 bg-gradient-to-tr from-indigo-600 to-violet-400 rotate-3 shadow-2xl shadow-indigo-100 group-hover:rotate-6 transition-transform duration-500"
          >
            <div className="w-full h-full rounded-[2.25rem] bg-white p-1 overflow-hidden -rotate-3 group-hover:-rotate-6 transition-transform duration-500">
              {user?.profile_image ? (
                <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover rounded-[2rem]" />
              ) : (
                <div className="w-full h-full rounded-[2rem] bg-indigo-50 flex items-center justify-center text-indigo-600 text-4xl font-black">
                  {user?.name.charAt(0)}
                </div>
              )}
            </div>
          </motion.div>
          <button className="absolute bottom-0 -right-2 bg-white text-indigo-600 p-3 rounded-2xl shadow-xl border border-slate-100 hover:scale-110 active:scale-95 transition-all">
            <Edit2 className="w-5 h-5 flex-shrink-0" />
          </button>
        </div>
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{user?.name}</h2>
          <div className="mt-3 flex items-center justify-center gap-3">
             <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg">{user?.course}</span>
             <span className="text-slate-200">•</span>
             <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{user?.semester} Semestre</span>
          </div>
        </motion.div>
      </section>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Academic Card */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm overflow-hidden relative group">
           <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Status Acadêmico</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Sua trajetória universitária</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                <School className="w-6 h-6" />
              </div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="p-6 bg-slate-50 rounded-3xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Média Global (IRA)</p>
                <p className="text-4xl font-black text-indigo-600 tracking-tighter">8.9 <span className="text-sm font-bold text-slate-300">/ 10.0</span></p>
                <div className="mt-4 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 w-[89%] h-full rounded-full" />
                </div>
              </div>
              <div className="p-6 border border-slate-50 rounded-3xl flex flex-col justify-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Universidade</p>
                 <p className="text-lg font-bold text-slate-800 tracking-tight leading-tight">Tech Institute of Brazil</p>
                 <p className="text-xs text-slate-400 mt-1 font-medium italic">São Paulo, SP</p>
              </div>
           </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Configurações</h3>
             <Settings className="w-6 h-6 text-slate-300" />
          </div>
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white shadow-md rounded-2xl group-hover:scale-110 transition-transform">
                  <Bell className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 tracking-tight block">Notificações Inteligentes</span>
                  <p className="text-[11px] text-slate-400 font-medium">Alertas de provas e entregas críticas</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifEnabled(!notifEnabled)}
                className={cn(
                  "w-14 h-8 rounded-full transition-all relative p-1",
                  notifEnabled ? "bg-indigo-600" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white shadow-sm transition-all",
                  notifEnabled ? "ml-6" : "ml-0"
                )} />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white shadow-md rounded-2xl group-hover:scale-110 transition-transform">
                  <Moon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 tracking-tight block">Modo Escuro</span>
                  <p className="text-[11px] text-slate-400 font-medium">Interface otimizada para estudo noturno</p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={cn(
                  "w-14 h-8 rounded-full transition-all relative p-1",
                  darkMode ? "bg-indigo-600" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white shadow-sm transition-all",
                  darkMode ? "ml-6" : "ml-0"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {['Termos de Uso', 'Privacidade'].map((item) => (
             <button key={item} className="flex justify-between items-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-indigo-100 transition-all group">
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600">{item}</span>
               <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600" />
             </button>
           ))}
        </div>

        {/* Danger Zone */}
        <div className="pt-8">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-rose-50 border-2 border-rose-100 text-rose-500 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95 shadow-xl shadow-rose-100/20"
           >
              <LogOut className="w-6 h-6" />
              Encerrar Sessão
           </button>
           <p className="text-center mt-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Versão 2.4.1 (Stable Build)</p>
        </div>
      </div>
    </div>
  );
}
