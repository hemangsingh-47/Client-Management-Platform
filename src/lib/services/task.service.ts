import { TaskRepository } from '../repositories/task.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { TaskQueryParams, CreateTaskInput, UpdateTaskInput } from '../validations/task.schema';
import { ApiError } from '../utils/api-error';

export class TaskService {
  static async listTasks(params: TaskQueryParams) {
    const { total, tasks } = await TaskRepository.findMany(params);

    const items = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      projectId: t.projectId,
      projectName: t.project.title,
      clientName: t.project.client.name,
      dueDate: t.dueDate.toISOString(),
      priority: t.priority,
      status: t.status,
      completedAt: t.completedAt?.toISOString() ?? null,
      isOverdue: t.status !== 'COMPLETED' && new Date(t.dueDate) < new Date(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));

    return {
      items,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  }

  static async getTaskById(id: string) {
    const task = await TaskRepository.findById(id);
    if (!task) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      project: task.project,
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
      status: task.status,
      completedAt: task.completedAt?.toISOString() ?? null,
      isOverdue: task.status !== 'COMPLETED' && new Date(task.dueDate) < new Date(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  static async createTask(data: CreateTaskInput) {
    const project = await ProjectRepository.findById(data.projectId);
    if (!project) {
      throw ApiError.badRequest(`Project with ID '${data.projectId}' does not exist`);
    }

    const task = await TaskRepository.create(data);

    if (data.status === 'COMPLETED') {
      await ActivityRepository.create({
        projectId: project.id,
        clientId: project.clientId,
        type: 'TASK_COMPLETED',
        description: `Task "${task.title}" was marked as completed.`,
      });
    }

    return task;
  }

  static async updateTask(id: string, data: UpdateTaskInput) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }

    const updated = await TaskRepository.update(id, data);

    if (data.status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      await ActivityRepository.create({
        projectId: existing.projectId,
        clientId: existing.project.clientId,
        type: 'TASK_COMPLETED',
        description: `Task "${updated.title}" completed.`,
      });
    }

    return updated;
  }

  static async deleteTask(id: string) {
    const existing = await TaskRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Task with ID '${id}' not found`);
    }

    return TaskRepository.delete(id);
  }
}

