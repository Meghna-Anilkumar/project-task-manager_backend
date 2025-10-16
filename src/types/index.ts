import { Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  createdDate: Date;
}

export interface ITask extends Document {
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  order: number;
  createdDate: Date;
}