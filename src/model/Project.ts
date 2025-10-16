import mongoose, { Schema } from 'mongoose';
import { IProject } from '../types';

const projectSchema = new Schema<IProject>({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  createdDate: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IProject>('Project', projectSchema);