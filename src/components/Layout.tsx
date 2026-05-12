import { Outlet, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, CalendarDays, Bell, BookOpen, CalendarRange, LogOut, Search } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Início', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tarefas', icon: ClipboardList },
    { path: '/calendar', label: 'Agenda', icon: CalendarDays },
    { path: '/schedule', label: 'Grade', icon: CalendarRange },
    { path: '/notifications', label: 'Avisos', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-surface flex selection:bg-indigo-100 selection:text-primary">
      {/* Sidebar - Desktop (hidden on mobile) */}
      <aside className="hidden lg:flex w-24 flex-col items-center py-10 bg-white border-r border-slate-200 sticky top-0 h-screen shrink-0">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-12 shadow-lg shadow-indigo-100 group cursor-pointer transition-transform hover:rotate-6">
          <BookOpen className="text-white w-8 h-8" />
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-4 rounded-2xl transition-all group relative",
                  isActive 
                    ? "text-primary bg-indigo-50 shadow-sm" 
                    : "text-slate-400 hover:text-primary hover:bg-slate-50"
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-[10px] uppercase font-bold tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <button 
          onClick={logout}
          className="p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-24 bg-white/80 backdrop-blur-md items-center justify-between px-12 sticky top-0 z-30 border-b border-slate-100/50">
          <div className="max-w-md w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar tarefas, aulas ou provas..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-600 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-4 pr-6 border-r border-slate-100">
               <div className="text-right">
                 <p className="text-sm font-bold text-slate-800 tracking-tight">{user?.name}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.course}</p>
               </div>
               <Link to="/profile" className="w-12 h-12 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                 {user?.profile_image ? (
                   <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                     {user?.name?.charAt(0)}
                   </div>
                 )}
               </Link>
             </div>
             <button className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95">
               Nova Tarefa
             </button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-5 sticky top-0 z-30 bg-surface/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudyFlow</h1>
          </div>
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
            {user?.profile_image ? (
              <img src={user.profile_image} alt={user.name} />
            ) : (
              <span className="text-primary font-bold">{user?.name?.charAt(0)}</span>
            )}
          </Link>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 pb-32 lg:pb-12">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav - Mobile ONLY */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-6 py-4 flex justify-between items-end safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all relative px-2 mb-1",
                isActive ? "text-primary" : "text-slate-400"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive && "bg-indigo-50"
              )}>
                <Icon className={cn("w-6 h-6", isActive && "fill-primary/10")} />
              </div>
              <span className="text-[9px] font-black tracking-tighter uppercase">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
