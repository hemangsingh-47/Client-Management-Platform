import { ClientRepository } from '../repositories/client.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import { ClientQueryParams, CreateClientInput, UpdateClientInput } from '../validations/client.schema';
import { ApiError } from '../utils/api-error';
import { calculateCompletedTotal, calculateOutstanding, toNumber } from '../utils/financial-calculator';

export class ClientService {
  static async listClients(params: ClientQueryParams) {
    const { total, clients } = await ClientRepository.findMany(params);

    // Compute derived financial metrics for each client
    const enrichedClients = clients.map((client) => {
      let clientPaid = 0;
      let clientOutstanding = 0;

      for (const project of client.projects) {
        const paid = toNumber(calculateCompletedTotal(project.payments));
        const outstanding = toNumber(calculateOutstanding(project.budget, paid));
        clientPaid += paid;
        clientOutstanding += outstanding;
      }

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        companyName: client.companyName,
        phone: client.phone,
        address: client.address,
        notes: client.notes,
        status: client.status,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
        totalProjects: client._count.projects,
        totalPaid: clientPaid,
        outstanding: clientOutstanding,
      };
    });

    return {
      items: enrichedClients,
      pagination: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit) || 1,
      },
    };
  }

  static async getClientById(id: string) {
    const client = await ClientRepository.findById(id);
    if (!client) {
      throw ApiError.notFound(`Client with ID '${id}' not found`);
    }

    let totalPaid = 0;
    let totalOutstanding = 0;

    const projectsSummary = client.projects.map((p) => {
      const paid = toNumber(calculateCompletedTotal(p.payments));
      const outstanding = toNumber(calculateOutstanding(p.budget, paid));
      totalPaid += paid;
      totalOutstanding += outstanding;

      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;

      return {
        id: p.id,
        title: p.title,
        budget: toNumber(p.budget),
        status: p.status,
        progress: p.progress,
        deadline: p.deadline.toISOString(),
        totalPaid: paid,
        outstanding,
        tasksCount: p.tasks.length,
        completedTasksCount: completedTasks,
      };
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      companyName: client.companyName,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
      status: client.status,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      totalProjects: client._count.projects,
      totalPaid,
      outstanding: totalOutstanding,
      projects: projectsSummary,
      recentActivities: client.activities,
    };
  }

  static async createClient(data: CreateClientInput) {
    const existing = await ClientRepository.findByEmail(data.email);
    if (existing) {
      throw ApiError.conflict(`A client with email '${data.email}' already exists`);
    }

    const client = await ClientRepository.create(data);

    await ActivityRepository.create({
      clientId: client.id,
      type: 'CLIENT_CREATED',
      description: `Client "${client.name}" was added to FreelanceHub.`,
    });

    return client;
  }

  static async updateClient(id: string, data: UpdateClientInput) {
    const client = await ClientRepository.findById(id);
    if (!client) {
      throw ApiError.notFound(`Client with ID '${id}' not found`);
    }

    if (data.email && data.email !== client.email) {
      const emailExists = await ClientRepository.findByEmail(data.email);
      if (emailExists) {
        throw ApiError.conflict(`A client with email '${data.email}' already exists`);
      }
    }

    return ClientRepository.update(id, data);
  }

  static async deleteClient(id: string) {
    const client = await ClientRepository.findById(id);
    if (!client) {
      throw ApiError.notFound(`Client with ID '${id}' not found`);
    }

    // Safety check: Prevent deletion if client has projects
    const projectCount = await ClientRepository.countProjects(id);
    if (projectCount > 0) {
      throw ApiError.conflict(
        `Cannot delete client "${client.name}". The client has ${projectCount} associated project(s). Delete or reassign projects first.`
      );
    }

    return ClientRepository.delete(id);
  }
}

