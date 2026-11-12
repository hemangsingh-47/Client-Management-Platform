'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Client, INITIAL_CLIENTS } from '@/lib/mock-data/clients';
import { Project, INITIAL_PROJECTS } from '@/lib/mock-data/projects';
import { Task } from '@/types/task';
import { INITIAL_TASKS } from '@/lib/mock-data/tasks';
import { Milestone } from '@/types/milestone';
import { INITIAL_MILESTONES } from '@/lib/mock-data/milestones';
import { Deliverable, DeliverableStatus } from '@/types/deliverable';
import { INITIAL_DELIVERABLES } from '@/lib/mock-data/deliverables';
import { Payment } from '@/types/payment';
import { INITIAL_PAYMENTS } from '@/lib/mock-data/payments';
import { calculateProjectProgress } from '@/lib/utils/project-utils';

const STORAGE_KEY = 'freelancehub_app_state_v1';

export interface AppContextType {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  milestones: Milestone[];
  deliverables: Deliverable[];
  payments: Payment[];

  // Client Actions
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalProjects' | 'totalPaid' | 'outstanding' | 'lastActivity'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;

  // Milestone Actions
  addMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt'>) => Milestone;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  toggleMilestoneCompleted: (id: string) => void;

  // Deliverable Actions
  addDeliverable: (deliverable: Omit<Deliverable, 'id' | 'createdAt'>) => Deliverable;
  updateDeliverable: (id: string, updates: Partial<Deliverable>) => void;
  deleteDeliverable: (id: string) => void;
  updateDeliverableStatus: (id: string, status: DeliverableStatus, note?: string) => void;

  // Payment Actions
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Payment;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // Helpers
  getClient: (id: string) => Client | undefined;
  getProject: (id: string) => Project | undefined;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe SSR hydration: Read localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          if (parsed.clients) setClients(parsed.clients);
          if (parsed.projects) setProjects(parsed.projects);
          if (parsed.tasks) setTasks(parsed.tasks);
          if (parsed.milestones) setMilestones(parsed.milestones);
          if (parsed.deliverables) setDeliverables(parsed.deliverables);
          if (parsed.payments) setPayments(parsed.payments);
          setIsHydrated(true);
        });
        return;
      }
    } catch {
      // Ignore parse or storage errors in private browsing
    }
    queueMicrotask(() => {
      setIsHydrated(true);
    });
  }, []);

  // Save to localStorage when state updates post-hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToPersist = {
        clients,
        projects,
        tasks,
        milestones,
        deliverables,
        payments,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch {
      // Storage quota or restriction
    }
  }, [clients, projects, tasks, milestones, deliverables, payments, isHydrated]);

  // Recalculate project progress whenever tasks or milestones change
  const syncProjectProgress = useCallback((
    targetProjectId: string,
    currentProjects: Project[],
    currentTasks: Task[],
    currentMilestones: Milestone[]
  ): Project[] => {
    return currentProjects.map((p) => {
      if (p.id !== targetProjectId) return p;
      const progress = calculateProjectProgress(p, currentTasks, currentMilestones);
      return { ...p, progress };
    });
  }, []);

  // --- Client Handlers ---
  const addClient = useCallback(
    (data: Omit<Client, 'id' | 'createdAt' | 'totalProjects' | 'totalPaid' | 'outstanding' | 'lastActivity'>) => {
      const id = `cli-${Date.now()}`;
      const newClient: Client = {
        ...data,
        id,
        createdAt: 'Today',
        totalProjects: 0,
        totalPaid: 0,
        outstanding: 0,
        lastActivity: 'Just now',
      };
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    },
    []
  );

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, lastActivity: 'Just now' } : c))
    );
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // --- Project Handlers ---
  const addProject = useCallback((newProjData: Omit<Project, 'id' | 'createdAt'>) => {
    const id = `proj-${Date.now()}`;
    const newProject: Project = {
      ...newProjData,
      id,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setTasks((prev) => prev.filter((t) => t.projectId !== id));
    setMilestones((prev) => prev.filter((m) => m.projectId !== id));
    setDeliverables((prev) => prev.filter((d) => d.projectId !== id));
    setPayments((prev) => prev.filter((p) => p.projectId !== id));
  }, []);

  // --- Task Handlers ---
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const id = `tsk-${Date.now()}`;
    const newTask: Task = {
      ...taskData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks((prevTasks) => {
      const updatedTasks = [newTask, ...prevTasks];
      // update project progress
      setProjects((prevProjects) =>
        syncProjectProgress(taskData.projectId, prevProjects, updatedTasks, milestones)
      );
      return updatedTasks;
    });

    return newTask;
  }, [milestones, syncProjectProgress]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const targetTask = updatedTasks.find((t) => t.id === id);
      if (targetTask) {
        setProjects((prevProjects) =>
          syncProjectProgress(targetTask.projectId, prevProjects, updatedTasks, milestones)
        );
      }
      return updatedTasks;
    });
  }, [milestones, syncProjectProgress]);

  const deleteTask = useCallback((id: string) => {
    setTasks((prevTasks) => {
      const targetTask = prevTasks.find((t) => t.id === id);
      const updatedTasks = prevTasks.filter((t) => t.id !== id);
      if (targetTask) {
        setProjects((prevProjects) =>
          syncProjectProgress(targetTask.projectId, prevProjects, updatedTasks, milestones)
        );
      }
      return updatedTasks;
    });
  }, [milestones, syncProjectProgress]);

  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((t) => {
        if (t.id !== id) return t;
        const willBeCompleted = t.status !== 'COMPLETED';
        return {
          ...t,
          status: (willBeCompleted ? 'COMPLETED' : 'TODO') as Task['status'],
          completedAt: willBeCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      });

      const targetTask = updatedTasks.find((t) => t.id === id);
      if (targetTask) {
        setProjects((prevProjects) =>
          syncProjectProgress(targetTask.projectId, prevProjects, updatedTasks, milestones)
        );
      }
      return updatedTasks;
    });
  }, [milestones, syncProjectProgress]);

  // --- Milestone Handlers ---
  const addMilestone = useCallback((data: Omit<Milestone, 'id' | 'createdAt'>) => {
    const id = `mls-${Date.now()}`;
    const newMilestone: Milestone = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setMilestones((prevM) => {
      const updatedM = [...prevM, newMilestone];
      setProjects((prevP) =>
        syncProjectProgress(data.projectId, prevP, tasks, updatedM)
      );
      return updatedM;
    });

    return newMilestone;
  }, [tasks, syncProjectProgress]);

  const updateMilestone = useCallback((id: string, updates: Partial<Milestone>) => {
    setMilestones((prevM) => {
      const updatedM = prevM.map((m) => (m.id === id ? { ...m, ...updates } : m));
      const target = updatedM.find((m) => m.id === id);
      if (target) {
        setProjects((prevP) =>
          syncProjectProgress(target.projectId, prevP, tasks, updatedM)
        );
      }
      return updatedM;
    });
  }, [tasks, syncProjectProgress]);

  const deleteMilestone = useCallback((id: string) => {
    setMilestones((prevM) => {
      const target = prevM.find((m) => m.id === id);
      const updatedM = prevM.filter((m) => m.id !== id);
      if (target) {
        setProjects((prevP) =>
          syncProjectProgress(target.projectId, prevP, tasks, updatedM)
        );
      }
      return updatedM;
    });
  }, [tasks, syncProjectProgress]);

  const toggleMilestoneCompleted = useCallback((id: string) => {
    setMilestones((prevM) => {
      const updatedM = prevM.map((m) => {
        if (m.id !== id) return m;
        const willBeCompleted = m.status !== 'COMPLETED';
        return {
          ...m,
          status: (willBeCompleted ? 'COMPLETED' : 'IN_PROGRESS') as Milestone['status'],
          completedAt: willBeCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      });

      const target = updatedM.find((m) => m.id === id);
      if (target) {
        setProjects((prevP) =>
          syncProjectProgress(target.projectId, prevP, tasks, updatedM)
        );
      }
      return updatedM;
    });
  }, [tasks, syncProjectProgress]);

  // --- Deliverable Handlers ---
  const addDeliverable = useCallback((data: Omit<Deliverable, 'id' | 'createdAt'>) => {
    const id = `del-${Date.now()}`;
    const newDeliverable: Deliverable = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      activity: [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          action: 'Deliverable created',
        },
      ],
    };
    setDeliverables((prev) => [newDeliverable, ...prev]);
    return newDeliverable;
  }, []);

  const updateDeliverable = useCallback((id: string, updates: Partial<Deliverable>) => {
    setDeliverables((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  }, []);

  const deleteDeliverable = useCallback((id: string) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDeliverableStatus = useCallback((id: string, status: DeliverableStatus, note?: string) => {
    setDeliverables((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const newAct = {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          action: `Status changed to ${status.replace('_', ' ')}`,
          note,
        };
        return {
          ...d,
          status,
          activity: [newAct, ...(d.activity || [])],
        };
      })
    );
  }, []);

  // --- Payment Handlers ---
  const addPayment = useCallback((data: Omit<Payment, 'id' | 'createdAt'>) => {
    const id = `pay-${Date.now()}`;
    const newPayment: Payment = {
      ...data,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  }, []);

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deletePayment = useCallback((id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // --- Helpers ---
  const getClient = useCallback((id: string) => clients.find((c) => c.id === id), [clients]);
  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const resetToDefaultData = useCallback(() => {
    setClients(INITIAL_CLIENTS);
    setProjects(INITIAL_PROJECTS);
    setTasks(INITIAL_TASKS);
    setMilestones(INITIAL_MILESTONES);
    setDeliverables(INITIAL_DELIVERABLES);
    setPayments(INITIAL_PAYMENTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        clients,
        projects,
        tasks,
        milestones,
        deliverables,
        payments,
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

