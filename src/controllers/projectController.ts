import { Request, Response } from 'express';
import Project from '../models/Project';
import Task from '../models/Task';
import { HttpStatus } from '../utils/Enums';

export class ProjectController {

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Name and description are required'
                });
                return;
            }

            const project = new Project({ name, description });
            await project.save();

            res.status(HttpStatus.CREATED).json({
                success: true,
                data: project,
                message: 'Project created successfully'
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating project',
                error: (error as Error).message
            });
        }
    }


    async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await Project.find().sort({ createdDate: -1 });

            res.status(HttpStatus.OK).json({
                success: true,
                data: projects,
                count: projects.length
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching projects',
                error: (error as Error).message
            });
        }
    }


    async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);

            if (!project) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                data: project
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching project',
                error: (error as Error).message
            });
        }
    }


    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const project = await Project.findByIdAndUpdate(
                id,
                { name, description },
                { new: true, runValidators: true }
            );

            if (!project) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(HttpStatus.OK).json({
                success: true,
                data: project,
                message: 'Project updated successfully'
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error updating project',
                error: (error as Error).message
            });
        }
    }


    async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const project = await Project.findByIdAndDelete(id);

            if (!project) {
                res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            await Task.deleteMany({ projectId: id });

            res.status(HttpStatus.OK).json({
                success: true,
                message: 'Project and associated tasks deleted successfully'
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error deleting project',
                error: (error as Error).message
            });
        }
    }
}
