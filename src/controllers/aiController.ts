import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { getGeminiModel } from '../config/gemini';
import { HttpStatus } from '../utils/Enums';

export class AIController {
  async summarizeProject(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      console.log(`Processing projectId: ${projectId}`);

      if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(`Invalid projectId format: ${projectId}`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid project ID format',
        });
        return;
      }
      console.log(`Fetching project: ${projectId}`);
      const project = await Project.findById(projectId);
      if (!project) {
        console.log(`Project not found: ${projectId}`);
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

     
      console.log(`Fetching tasks for project: ${projectId}`);
      const tasks = await Task.find({ projectId });
      if (tasks.length === 0) {
        console.log(`[Summarize] No tasks found for project: ${projectId}`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'No tasks found for this project',
        });
        return;
      }

      console.log(`Found ${tasks.length} tasks`);
      const tasksList = tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.status.toUpperCase()}] ${task.title}: ${task.description}`
        )
        .join('\n');

      console.log(`Generating summary for project: ${project.name}`);
      const model = getGeminiModel();
      const prompt = `Summarize the following project tasks in a concise way. Project name: "${project.name}":\n\n${tasksList}\n\nProvide a brief overview of the project status, what's completed, in progress, and pending.`;

      console.log(`[Summarize] Sending prompt to Gemini API`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      console.log(`[Summarize] Summary generated successfully for project: ${projectId}`);
      res.status(HttpStatus.OK).json({
        success: true,
        data: { summary },
        message: 'Project summary generated successfully',
      });
    } catch (error: any) {
      console.error(`[Summarize] Error for project ${req.params.projectId}:`, error);
      const errorMessage =
        error.message.includes('API_KEY_INVALID')
          ? 'Invalid Gemini API key. Please contact the administrator.'
          : error.message.includes('Missing or invalid GEMINI_API_KEY')
          ? 'Gemini API key is missing or invalid.'
          : error.message.includes('is not found for API version')
          ? 'Gemini model not available. Test available models with GET /api/test-gemini-model or check Google AI Studio for supported models.'
          : 'Error generating summary: ' + error.message;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
        error: error.message,
      });
    }
  }

  async askQuestion(req: Request, res: Response): Promise<void> {
    try {
      const { taskId, question } = req.body;
      console.log(`[QA] Processing taskId: ${taskId}, question: ${question}`);

      // Validate input
      if (!question || question.trim() === '') {
        console.log(`[QA] Question is empty`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Question is required',
        });
        return;
      }
      if (!taskId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(`[QA] Invalid taskId format: ${taskId}`);
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid task ID format',
        });
        return;
      }

      // Fetch task
      console.log(`[QA] Fetching task: ${taskId}`);
      const task = await Task.findById(taskId);
      if (!task) {
        console.log(`[QA] Task not found: ${taskId}`);
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Task not found',
        });
        return;
      }

      // Fetch project
      console.log(`[QA] Fetching project for task: ${taskId}`);
      const project = await Project.findById(task.projectId);
      if (!project) {
        console.log(`[QA] Project not found for task: ${taskId}`);
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Project not found',
        });
        return;
      }

      // Fetch tasks for context
      console.log(`[QA] Fetching tasks for project: ${task.projectId}`);
      const tasks = await Task.find({ projectId: task.projectId });
      const tasksList = tasks
        .map(
          (task, index) =>
            `${index + 1}. [${task.status.toUpperCase()}] ${task.title}: ${task.description}`
        )
        .join('\n');

      console.log(`Generating answer for task: ${task.title}`);
      const model = getGeminiModel();
      const prompt = `Based on these project tasks for "${project.name}":\n\n${tasksList}\n\nAnswer this question about task "${task.title}": ${question}`;

      console.log(`Sending prompt to Gemini API`);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();

      console.log(`Answer generated successfully for task: ${taskId}`);
      res.status(HttpStatus.OK).json({
        success: true,
        data: { answer, question },
        message: 'Answer generated successfully',
      });
    } catch (error: any) {
      console.error(`Error for task ${req.body.taskId}:`, error);
      const errorMessage =
        error.message.includes('API_KEY_INVALID')
          ? 'Invalid Gemini API key. Please contact the administrator.'
          : error.message.includes('Missing or invalid GEMINI_API_KEY')
          ? 'Gemini API key is missing or invalid.'
          : error.message.includes('is not found for API version')
          ? 'Gemini model not available. Test available models with GET /api/test-gemini-model or check Google AI Studio for supported models.'
          : 'Error answering question: ' + error.message;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessage,
        error: error.message,
      });
    }
  }
}