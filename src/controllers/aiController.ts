import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { getGeminiModel } from '../config/gemini';
import { HttpStatus } from '../utils/Enums';

export class AIController {
  // Summarize all tasks in a project
  async summarizeProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;

      const project = await Project.findById(projectId);
      if (!project) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      const tasks = await Task.find({ projectId });
      if (tasks.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No tasks found for this project'
        });
        return;
      }

      const tasksList = tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.status.toUpperCase()}] ${task.title}: ${task.description}`
        )
        .join('\n');

      const model = getGeminiModel();
      const prompt = `Summarize the following project tasks in a concise way. Project name: "${project.name}":\n\n${tasksList}\n\nProvide a brief overview of the project status, what's completed, in progress, and pending.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      res.status(HttpStatus.OK).json({
        success: true,
        data: { summary },
        message: 'Project summary generated successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error generating summary',
        error: (error as Error).message
      });
    }
  }

  // Answer questions about project tasks
  async askQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const { question } = req.body;

      if (!question || question.trim() === '') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Question is required'
        });
        return;
      }

      const project = await Project.findById(projectId);
      if (!project) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      const tasks = await Task.find({ projectId });
      if (tasks.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No tasks found for this project'
        });
        return;
      }

      const tasksList = tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.status.toUpperCase()}] ${task.title}: ${task.description}`
        )
        .join('\n');

      const model = getGeminiModel();
      const prompt = `Based on these project tasks for "${project.name}":\n\n${tasksList}\n\nAnswer this question: ${question}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      res.status(HttpStatus.OK).json({
        success: true,
        data: { answer, question },
        message: 'Answer generated successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error answering question',
        error: (error as Error).message
      });
    }
  }

  // Get AI suggestions for task priorities
  async getTaskSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;

      const project = await Project.findById(projectId);
      if (!project) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found'
        });
        return;
      }

      const tasks = await Task.find({ projectId });
      if (tasks.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No tasks found for this project'
        });
        return;
      }

      const tasksList = tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.status.toUpperCase()}] ${task.title}: ${task.description}`
        )
        .join('\n');

      const model = getGeminiModel();
      const prompt = `Analyze these project tasks and provide suggestions for prioritization and task management:\n\n${tasksList}\n\nProvide actionable suggestions for improving workflow and task priorities.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestions = response.text();

      res.status(HttpStatus.OK).json({
        success: true,
        data: { suggestions },
        message: 'Suggestions generated successfully'
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error generating suggestions',
        error: (error as Error).message
      });
    }
  }
}
