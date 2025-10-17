import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { HttpStatus } from '../utils/Enums';

export class TaskController {

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const { title, description, status, order } = req.body;

      if (!title || !description) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Title and description are required'
        });
        return;
      }

      const projectExists = await Project.findById(projectId);
      if (!projectExists) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      const task = new Task({
        projectId,
        title,
        description,
        status: status || 'todo',
        order: order || 0
      });

      await task.save();

      res.status(HttpStatus.CREATED).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error creating task',
        error: (error as Error).message
      });
    }
  }


  async getTasksByProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;

      const projectExists = await Project.findById(projectId);
      if (!projectExists) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      const tasks = await Task.find({ projectId }).sort({ order: 1, createdDate: 1 });

      res.status(HttpStatus.OK).json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching tasks',
        error: (error as Error).message
      });
    }
  }


  async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const task = await Task.findById(id);

      if (!task) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: task
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error fetching task',
        error: (error as Error).message
      });
    }
  }


  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, status, order } = req.body;

      const task = await Task.findByIdAndUpdate(
        id,
        { title, description, status, order },
        { new: true, runValidators: true }
      );

      if (!task) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Task not found'
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: task,
        message: 'Task updated successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating task',
        error: (error as Error).message
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
          message: 'Task not found'
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error deleting task',
        error: (error as Error).message
      });
    }
  }


  async bulkUpdateTasks(req: Request, res: Response): Promise<void> {
    try {
      const { tasks } = req.body;

      if (!Array.isArray(tasks) || tasks.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid tasks array'
        });
        return;
      }

      const updatePromises = tasks.map((taskUpdate: any) =>
        Task.findByIdAndUpdate(
          taskUpdate.id,
          { status: taskUpdate.status, order: taskUpdate.order },
          { new: true }
        )
      );

      const updatedTasks = await Promise.all(updatePromises);

      res.status(HttpStatus.OK).json({
        success: true,
        data: updatedTasks,
        message: 'Tasks updated successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error updating tasks',
        error: (error as Error).message
      });
    }
  }
}
