import { ProjectRepository } from '../repositories/project.repository';
import { ClientRepository } from '../repositories/client.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { ProjectQueryParams, CreateProjectInput, UpdateProjectInput } from '../validations/project.schema';
import { ApiError } from '../utils/api-error';
import { calculateCompletedTotal, calculateOutstanding, toNumber } from '../utils/financial-calculator';

export class ProjectService {
  static async listProjects(params: ProjectQueryParams) {
    const { total, projects } = await ProjectRepository.findMany(params);

    const enriched = projects.map((p) => {
      const budget = toNumber(p.budget);
      const totalPaid = toNumber(calculateCompletedTotal(p.payments));
      const outstanding = toNumber(calculateOutstanding(p.budget, totalPaid));

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        clientId: p.clientId,
        clientName: p.client.name,
        companyName: p.client.companyName,
        budget,
        startDate: p.startDate.toISOString(),
        deadline: p.deadline.toISOString(),
        status: p.status,
        priority: p.priority,
        progress: p.progress,
        notes: p.notes,
        totalPaid,
        outstanding,
        tasksCount: p._count.tasks,
        milestonesCount: p._count.milestones,
        deliverablesCount: p._count.deliverables,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    return {
      items: enriched,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  }

  static async getProjectById(id: string) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw ApiError.notFound(`Project with ID '${id}' not found`);
    }

    const budget = toNumber(project.budget);
    const totalPaid = toNumber(calculateCompletedTotal(project.payments));
    const outstanding = toNumber(calculateOutstanding(project.budget, totalPaid));

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      clientId: project.clientId,
      client: {
        id: project.client.id,
        name: project.client.name,
        companyName: project.client.companyName,
        email: project.client.email,
        phone: project.client.phone,
      },
      budget,
      startDate: project.startDate.toISOString(),
      deadline: project.deadline.toISOString(),
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      notes: project.notes,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      financials: {
        budget,
        totalPaid,
        outstanding,
      },
      tasks: project.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        dueDate: t.dueDate.toISOString(),
        priority: t.priority,
        status: t.status,
        completedAt: t.completedAt?.toISOString() ?? null,
      })),
      milestones: project.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        dueDate: m.dueDate.toISOString(),
        status: m.status,
        completedAt: m.completedAt?.toISOString() ?? null,
      })),
      deliverables: project.deliverables.map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        submissionDate: d.submissionDate.toISOString(),
        attachmentUrl: d.attachmentUrl,
        attachmentType: d.attachmentType,
        status: d.status,
        notes: d.notes,
      })),
      payments: project.payments.map((p) => ({
        id: p.id,
        amount: toNumber(p.amount),
        paymentDate: p.paymentDate.toISOString(),
        paymentMethod: p.paymentMethod,
        referenceNumber: p.referenceNumber,
        status: p.status,
        notes: p.notes,
      })),
      recentActivities: project.activities,
    };
  }

  static async createProject(data: CreateProjectInput) {
    const client = await ClientRepository.findById(data.clientId);
    if (!client) {
      throw ApiError.badRequest(`Client with ID '${data.clientId}' does not exist`);
    }

    const project = await ProjectRepository.create(data);

    await ActivityRepository.create({
      projectId: project.id,
      clientId: project.clientId,
      type: 'PROJECT_CREATED',
      description: `New project "${project.title}" created for ${client.name}.`,
    });

    return project;
  }

  static async updateProject(id: string, data: UpdateProjectInput) {
    const existing = await ProjectRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Project with ID '${id}' not found`);
    }

    if (data.clientId) {
      const client = await ClientRepository.findById(data.clientId);
      if (!client) {
        throw ApiError.badRequest(`Client with ID '${data.clientId}' does not exist`);
      }
    }

    const updated = await ProjectRepository.update(id, data);

    // Record activity if status changed
    if (data.status && data.status !== existing.status) {
      await ActivityRepository.create({
        projectId: id,
        clientId: updated.clientId,
        type: 'STATUS_CHANGED',
        description: `Project "${updated.title}" status changed to ${data.status}.`,
      });
    }

    return updated;
  }

  static async deleteProject(id: string) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw ApiError.notFound(`Project with ID '${id}' not found`);
    }

    // Protection of financial integrity: prevent deletion if project has payments
    const paymentsCount = await ProjectRepository.countPayments(id);
    if (paymentsCount > 0) {
      throw ApiError.conflict(
        `Cannot delete project "${project.title}" because it has ${paymentsCount} associated payment record(s). Financial records must be preserved for audit.`
      );
    }

    return ProjectRepository.delete(id);
  }
}

