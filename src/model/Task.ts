import mongoose, { Schema } from 'mongoose';
import { ITask } from '../types';

const taskSchema = new Schema<ITask>({
  projectId: { 
    type: String, 
    required: true,
    ref: 'Project'
  },
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  order: { 
    type: Number, 
    default: 0 
  },
  createdDate: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<ITask>('Task', taskSchema);