'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Client } from '@/types/client';
import { Project } from '@/types/project';
import { Task } from '@/types/task';
import { Milestone } from '@/types/milestone';
import { Deliverable, DeliverableStatus } from '@/types/deliverable';
import { Payment } from '@/types/payment';
import {
  clientsApi,
  projectsApi,
  tasksApi,
  milestonesApi,
  deliverablesApi,
  paymentsApi,
  CreateClientDTO,
  UpdateClientDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
  CreateTaskDTO,
  UpdateTaskDTO,
  CreateMilestoneDTO,
  UpdateMilestoneDTO,
  CreateDeliverableDTO,
  UpdateDeliverableDTO,
  CreatePaymentDTO,
  UpdatePaymentDTO,
} from '@/lib/api';

export interface AppContextType {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

  // Client Actions
  addClient: (client: CreateClientDTO) => Promise<Client>;
  updateClient: (id: string, updates: UpdateClientDTO) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;

  // Project Actions
  addProject: (project: CreateProjectDTO) => Promise<Project>;
  updateProject: (id: string, updates: UpdateProjectDTO) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;

  // Task Actions
  addTask: (task: CreateTaskDTO) => Promise<Task>;
  updateTask: (id: string, updates: UpdateTaskDTO) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;

  // Milestone Actions
  addMilestone: (milestone: CreateMilestoneDTO) => Promise<Milestone>;
  updateMilestone: (id: string, updates: UpdateMilestoneDTO) => Promise<Milestone>;
  deleteMilestone: (id: string) => Promise<void>;
  toggleMilestoneCompleted: (id: string) => Promise<void>;

  // Deliverable Actions
  addDeliverable: (deliverable: CreateDeliverableDTO) => Promise<Deliverable>;
  updateDeliverable: (id: string, updates: UpdateDeliverableDTO) => Promise<Deliverable>;
  deleteDeliverable: (id: string) => Promise<void>;
  updateDeliverableStatus: (id: string, status: DeliverableStatus, note?: string) => Promise<void>;

  // Payment Actions
  addPayment: (payment: CreatePaymentDTO) => Promise<Payment>;
  updatePayment: (id: string, updates: UpdatePaymentDTO) => Promise<Payment>;
  deletePayment: (id: string) => Promise<void>;

  // Helpers
  getClient: (id: string) => Client | undefined;
  getProject: (id: string) => Project | undefined;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Centralized Data Fetcher from PostgreSQL via Route Handlers
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const [cRes, pRes, tRes, mRes, dRes, payRes] = await Promise.all([
        clientsApi.getClients({ limit: 100 }),
        projectsApi.getProjects({ limit: 100 }),
        tasksApi.getTasks({ limit: 100 }),
        milestonesApi.getMilestones(),
        deliverablesApi.getDeliverables({ limit: 100 }),
        paymentsApi.getPayments({ limit: 100 }),
      ]);

      setClients(cRes.items || []);
      setProjects((pRes.items || []) as unknown as Project[]);
      setTasks((tRes.items || []) as unknown as Task[]);
      setMilestones(mRes || []);
      setDeliverables((dRes.items || []) as unknown as Deliverable[]);
      setPayments((payRes.items || []) as unknown as Payment[]);
    } catch (err) {
      console.error('Failed to load application data from database:', err);
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- Client Actions ---
  const addClient = useCallback(
    async (data: CreateClientDTO) => {
      const created = await clientsApi.createClient(data);
      await refreshData();
      return created;
    },
    [refreshData]
  );

  const updateClient = useCallback(
    async (id: string, updates: UpdateClientDTO) => {
      const updated = await clientsApi.updateClient(id, updates);
      await refreshData();
      return updated;
    },
    [refreshData]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      await clientsApi.deleteClient(id);
      await refreshData();
    },
    [refreshData]
  );

  // --- Project Actions ---
  const addProject = useCallback(
    async (data: CreateProjectDTO) => {
      const created = await projectsApi.createProject(data);
      await refreshData();
      return created;
    },
    [refreshData]
  );

  const updateProject = useCallback(
    async (id: string, updates: UpdateProjectDTO) => {
      const updated = await projectsApi.updateProject(id, updates);
      await refreshData();
      return updated;
    },
    [refreshData]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await projectsApi.deleteProject(id);
      await refreshData();
    },
    [refreshData]
  );

  // --- Task Actions ---
  const addTask = useCallback(
    async (data: CreateTaskDTO) => {
      const created = await tasksApi.createTask(data);
      await refreshData();
      return created;
    },
    [refreshData]
  );

  const updateTask = useCallback(
    async (id: string, updates: UpdateTaskDTO) => {
      const updated = await tasksApi.updateTask(id, updates);
      await refreshData();
      return updated;
    },
    [refreshData]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await tasksApi.deleteTask(id);
      await refreshData();
    },
    [refreshData]
  );

  const toggleTaskCompleted = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) return;
      const newStatus = target.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      await tasksApi.updateTask(id, { status: newStatus });
      await refreshData();
    },
    [tasks, refreshData]
  );

  // --- Milestone Actions ---
  const addMilestone = useCallback(
    async (data: CreateMilestoneDTO) => {
      const created = await milestonesApi.createMilestone(data);
      await refreshData();
      return created;
    },
    [refreshData]
  );

  const updateMilestone = useCallback(
    async (id: string, updates: UpdateMilestoneDTO) => {
      const updated = await milestonesApi.updateMilestone(id, updates);
      await refreshData();
      return updated;
    },
    [refreshData]
  );

  const deleteMilestone = useCallback(
    async (id: string) => {
      await milestonesApi.deleteMilestone(id);
      await refreshData();
    },
    [refreshData]
  );

  const toggleMilestoneCompleted = useCallback(
    async (id: string) => {
      const target = milestones.find((m) => m.id === id);
      if (!target) return;
      const newStatus = target.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
      await milestonesApi.updateMilestone(id, { status: newStatus });
      await refreshData();
    },
    [milestones, refreshData]
  );

  // --- Deliverable Actions ---
  const addDeliverable = useCallback(
    async (data: CreateDeliverableDTO) => {
      const created = await deliverablesApi.createDeliverable(data);
      await refreshData();
      return created;
    },
    [refreshData]
  );

  const updateDeliverable = useCallback(
    async (id: string, updates: UpdateDeliverableDTO) => {
      const updated = await deliverablesApi.updateDeliverable(id, updates);
      await refreshData();
      return updated;
    },
    [refreshData]
  );

  const deleteDeliverable = useCallback(
    async (id: string) => {
      await deliverablesApi.deleteDeliverable(id);
      await refreshData();
    },
    [refreshData]
  );

  const updateDeliverableStatus = useCallback(
    async (id: string, status: DeliverableStatus, note?: string) => {
      await deliverablesApi.updateDeliverable(id, { status, notes: note });
      await refreshData();
    },
    [refreshData]
  );

  // --- Payment Actions ---
  const addPayment = useCallback(
    async (data: CreatePaymentDTO) => {
      const created = await paymentsApi.createPayment(data);
      await refreshData();
      return created;
    },
    [refreshData]
  );

  const updatePayment = useCallback(
    async (id: string, updates: UpdatePaymentDTO) => {
      const updated = await paymentsApi.updatePayment(id, updates);
      await refreshData();
      return updated;
    },
    [refreshData]
  );

  const deletePayment = useCallback(
    async (id: string) => {
      await paymentsApi.deletePayment(id);
      await refreshData();
    },
    [refreshData]
  );

  // --- Helpers ---
  const getClient = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);
  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const resetToDefaultData = useCallback(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AppContext.Provider
      value={{
        clients,
        projects,
        tasks,
        milestones,
        deliverables,
        payments,
        isLoading,
        error,
        refreshData,
        addClient,
        updateClient,
        deleteClient,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        toggleMilestoneCompleted,
        addDeliverable,
        updateDeliverable,
        deleteDeliverable,
        updateDeliverableStatus,
        addPayment,
        updatePayment,
        deletePayment,
        getClient,
        getProject,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
