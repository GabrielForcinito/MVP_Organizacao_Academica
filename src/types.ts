export enum Priority {
  ALTA = 'alta',
  MEDIA = 'media',
  BAIXA = 'baixa'
}

export enum EventType {
  AULA = 'aula',
  PROVA = 'prova',
  TRABALHO = 'trabalho'
}

export interface User {
  id: string;
  email: string;
  name: string;
  course?: string;
  semester?: string;
  profile_image?: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  category?: string;
  priority: Priority;
  due_date: string;
  completed: number;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  type: EventType;
  location?: string;
  start_time: string;
  end_time: string;
  description?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  date: string;
  is_read: number;
}

export interface Productivity {
  id: string;
  user_id: string;
  date: string;
  study_minutes: number;
  tasks_completed: number;
}
