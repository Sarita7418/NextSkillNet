// en app/types/index.ts

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  education: string;
  location: string;
  salary: number;
  availability: 'immediate' | 'two-weeks' | 'one-month';
  createdAt: Date;
  profileImage?: string;
  resumeUrl?: string;
  [key: string]: any;
}