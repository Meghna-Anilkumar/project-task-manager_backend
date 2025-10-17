import { Request, Response } from 'express';
import Task from '../models/Task';
import { HttpStatus } from '../utils/Enums';

export class TaskController {
  async getTasksByProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params; // Changed from req.query to req.params
      if (!projectId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'projectId parameter is required',
        });
        return;
      }
      const tasks = await Task.find({ projectId });
      res.status(HttpStatus.OK).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching tasks',
        error: (error as Error).message,
      });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params; // Changed to req.params
      const { title, description, status } = req.body;
      if (!title || !description || !status || !projectId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Title, description, status, and projectId are required',
        });
        return;
      }
      const task = new Task({ title, description, status, projectId });
      await task.save();
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: task,
        message: 'Task created successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating task',
        error: (error as Error).message,
      });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status, projectId } = req.body;
      const task = await Task.findByIdAndUpdate(
        id,
        { title, description, status, projectId },
        { new: true, runValidators: true },
      );
      if (!task) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        data: task,
        message: 'Task updated successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating task',
        error: (error as Error).message,
      });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }
      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error deleting task',
        error: (error as Error).message,
      });
    }
  }
}