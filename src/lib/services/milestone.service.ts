import { MilestoneRepository } from '../repositories/milestone.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { MilestoneQueryParams, CreateMilestoneInput, UpdateMilestoneInput } from '../validations/milestone.schema';
import { ApiError } from '../utils/api-error';

export class MilestoneService {
  static async listMilestones(params: MilestoneQueryParams) {
    const milestones = await MilestoneRepository.findMany(params);
    return milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      projectId: m.projectId,
      projectName: m.project.title,
      dueDate: m.dueDate.toISOString(),
      status: m.status,
      completedAt: m.completedAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));
  }

  static async getMilestoneById(id: string) {
    const milestone = await MilestoneRepository.findById(id);
    if (!milestone) {
      throw ApiError.notFound(`Milestone with ID '${id}' not found`);
    }

    return {
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      projectId: milestone.projectId,
      project: milestone.project,
      dueDate: milestone.dueDate.toISOString(),
      status: milestone.status,
      completedAt: milestone.completedAt?.toISOString() ?? null,
      createdAt: milestone.createdAt.toISOString(),
      updatedAt: milestone.updatedAt.toISOString(),
    };
  }

  static async createMilestone(data: CreateMilestoneInput) {
    const project = await ProjectRepository.findById(data.projectId);
    if (!project) {
      throw ApiError.badRequest(`Project with ID '${data.projectId}' does not exist`);
    }

    return MilestoneRepository.create(data);
  }

  static async updateMilestone(id: string, data: UpdateMilestoneInput) {
    const existing = await MilestoneRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Milestone with ID '${id}' not found`);
    }

    return MilestoneRepository.update(id, data);
  }

  static async deleteMilestone(id: string) {
    const existing = await MilestoneRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Milestone with ID '${id}' not found`);
    }

    return MilestoneRepository.delete(id);
  }
}

