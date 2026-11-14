import { DeliverableRepository } from '../repositories/deliverable.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { DeliverableQueryParams, CreateDeliverableInput, UpdateDeliverableInput } from '../validations/deliverable.schema';
import { ApiError } from '../utils/api-error';

export class DeliverableService {
  static async listDeliverables(params: DeliverableQueryParams) {
    const { total, deliverables } = await DeliverableRepository.findMany(params);

    const items = deliverables.map((d) => ({
      id: d.id,
      title: d.title,
      description: d.description,
      projectId: d.projectId,
      projectName: d.project.title,
      clientName: d.project.client.name,
      submissionDate: d.submissionDate.toISOString(),
      attachmentUrl: d.attachmentUrl,
      attachmentType: d.attachmentType,
      status: d.status,
      notes: d.notes,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
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

  static async getDeliverableById(id: string) {
    const deliverable = await DeliverableRepository.findById(id);
    if (!deliverable) {
      throw ApiError.notFound(`Deliverable with ID '${id}' not found`);
    }

    return {
      id: deliverable.id,
      title: deliverable.title,
      description: deliverable.description,
      projectId: deliverable.projectId,
      project: deliverable.project,
      submissionDate: deliverable.submissionDate.toISOString(),
      attachmentUrl: deliverable.attachmentUrl,
      attachmentType: deliverable.attachmentType,
      status: deliverable.status,
      notes: deliverable.notes,
      createdAt: deliverable.createdAt.toISOString(),
      updatedAt: deliverable.updatedAt.toISOString(),
    };
  }

  static async createDeliverable(data: CreateDeliverableInput) {
    const project = await ProjectRepository.findById(data.projectId);
    if (!project) {
      throw ApiError.badRequest(`Project with ID '${data.projectId}' does not exist`);
    }

    const deliverable = await DeliverableRepository.create(data);

    await ActivityRepository.create({
      projectId: project.id,
      clientId: project.clientId,
      type: 'DELIVERABLE_SUBMITTED',
      description: `Deliverable "${deliverable.title}" recorded for project "${project.title}".`,
    });

    return deliverable;
  }

  static async updateDeliverable(id: string, data: UpdateDeliverableInput) {
    const existing = await DeliverableRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Deliverable with ID '${id}' not found`);
    }

    const updated = await DeliverableRepository.update(id, data);

    if (data.status && data.status !== existing.status) {
      await ActivityRepository.create({
        projectId: existing.projectId,
        clientId: existing.project.clientId,
        type: 'STATUS_CHANGED',
        description: `Deliverable "${updated.title}" status changed to ${data.status}.`,
      });
    }

    return updated;
  }

  static async deleteDeliverable(id: string) {
    const existing = await DeliverableRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Deliverable with ID '${id}' not found`);
    }

    return DeliverableRepository.delete(id);
  }
}

