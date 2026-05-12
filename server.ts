import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import db from './src/lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'studyflow-secret-key-123';

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // --- Auth Middleware ---
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Não autorizado' });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Sessão inválida' });
    }
  };

  // --- API Routes ---

  // Auth
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, course, semester } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = crypto.randomUUID();
      const stmt = db.prepare('INSERT INTO users (id, email, password, name, course, semester) VALUES (?, ?, ?, ?, ?, ?)');
      stmt.run(userId, email, hashedPassword, name, course, semester);
      
      const token = jwt.sign({ id: userId, email, name }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json({ user: { id: userId, email, name, course, semester } });
    } catch (err: any) {
      if (err.message.includes('UNIQUE')) res.status(400).json({ error: 'Email já cadastrado' });
      else res.status(500).json({ error: 'Erro ao registrar' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user.id, email: user.email, name: user.name, course: user.course, semester: user.semester } });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', authenticate, (req: any, res) => {
    const user = db.prepare('SELECT id, email, name, course, semester, profile_image FROM users WHERE id = ?').get(req.user.id);
    res.json({ user });
  });

  // Tasks
  app.get('/api/tasks', authenticate, (req: any, res) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ?').all(req.user.id);
    res.json(tasks);
  });

  app.post('/api/tasks', authenticate, (req: any, res) => {
    const { title, category, priority, due_date } = req.body;
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO tasks (id, user_id, title, category, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)').run(id, req.user.id, title, category, priority, due_date);
    res.json({ id, title, category, priority, due_date, completed: 0 });
  });

  app.patch('/api/tasks/:id', authenticate, (req: any, res) => {
    const { completed } = req.body;
    db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND user_id = ?').run(completed ? 1 : 0, req.params.id, req.user.id);
    res.json({ success: true });
  });

  app.delete('/api/tasks/:id', authenticate, (req: any, res) => {
    db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  // Events
  app.get('/api/events', authenticate, (req: any, res) => {
    const events = db.prepare('SELECT * FROM events WHERE user_id = ?').all(req.user.id);
    res.json(events);
  });

  app.post('/api/events', authenticate, (req: any, res) => {
    const { title, type, location, start_time, end_time, description } = req.body;
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO events (id, user_id, title, type, location, start_time, end_time, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(id, req.user.id, title, type, location, start_time, end_time, description);
    res.json({ id, title, type, location, start_time, end_time, description });
  });

  // Notifications
  app.get('/api/notifications', authenticate, (req: any, res) => {
    const notifications = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY date DESC').all(req.user.id);
    res.json(notifications);
  });

  // Productivity
  app.get('/api/productivity', authenticate, (req: any, res) => {
    const stats = db.prepare('SELECT * FROM productivity WHERE user_id = ? ORDER BY date DESC LIMIT 7').all(req.user.id);
    res.json(stats);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyFlow Server running on http://localhost:${PORT}`);
  });
}

startServer();
