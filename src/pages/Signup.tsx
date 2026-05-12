import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, course, semester }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      login(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-violet-50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <div className="w-full max-w-xl relative z-10">
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center mx-auto mb-6 rotate-3">
             <BookOpen className="h-8 w-8 text-white -rotate-3" />
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Criar Perfil</h2>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Inicie sua organização acadêmica</p>
        </motion.div>
        
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8" 
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-xs text-center font-black uppercase tracking-widest border border-rose-100">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1" htmlFor="name">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-[1.25rem] border-2 border-slate-50 bg-slate-50 py-4 pl-14 pr-6 focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1" htmlFor="email">Email Acadêmico</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-[1.25rem] border-2 border-slate-50 bg-slate-50 py-4 pl-14 pr-6 focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="aluno@univ.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1" htmlFor="course">Curso</label>
              <div className="relative group">
                <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="course"
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="block w-full rounded-[1.25rem] border-2 border-slate-50 bg-slate-50 py-4 pl-14 pr-6 focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="Ex: Engenharia"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1" htmlFor="semester">Semestre Atual</label>
              <input
                id="semester"
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="block w-full rounded-[1.25rem] border-2 border-slate-50 bg-slate-50 py-4 px-6 focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                placeholder="Ex: 5º semestre"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1" htmlFor="password">Palavra-Chave (Senha)</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-[1.25rem] border-2 border-slate-50 bg-slate-50 py-4 pl-14 pr-6 focus:bg-white focus:border-indigo-100 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-[1.5rem] py-5 font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Criando registro...' : 'Criar minha conta'}
          </button>
        </motion.form>

        <motion.p 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.3 }}
           className="mt-10 text-center text-sm font-bold text-slate-400"
        >
          Já faz parte do StudyFlow?{' '}
          <Link to="/login" className="text-indigo-600 font-black hover:underline ml-1">
            Fazer login
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
