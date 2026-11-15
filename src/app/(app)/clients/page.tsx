'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  ClientSummaryCards,
  ClientTable,
  ClientFormModal,
  ClientDeleteModal,
  ClientFormData,
} from '@/components/clients';
import { Client } from '@/lib/mock-data/clients';
import { useAppContext } from '@/context/app-context';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, isLoading, error, refreshData } = useAppContext();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Open Add Client modal
  const handleOpenAdd = () => {
    setActionError(null);
    setEditingClient(null);
    setIsFormOpen(true);
  };

  // Open Edit Client modal
  const handleOpenEdit = (client: Client) => {
    setActionError(null);
    setEditingClient(client);
    setIsFormOpen(true);
  };

  // Open Delete confirmation modal
  const handleOpenDelete = (client: Client) => {
    setActionError(null);
    setDeletingClient(client);
    setIsDeleteOpen(true);
  };

  // Save (Create or Update) client
  const handleSaveClient = async (data: ClientFormData) => {
    try {
      setActionError(null);
      if (editingClient) {
        await updateClient(editingClient.id, {
          name: data.name,
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          status: data.status,
          notes: data.notes,
        });
      } else {
        await addClient({
          name: data.name,
          companyName: data.companyName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          notes: data.notes,
          status: data.status,
        });
      }
      setIsFormOpen(false);
      setEditingClient(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Failed to save client');
    }
  };

  // Confirm delete client
  const handleConfirmDelete = async () => {
    if (!deletingClient) return;
    try {
      setActionError(null);
      await deleteClient(deletingClient.id);
      setIsDeleteOpen(false);
      setDeletingClient(null);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : 'Cannot delete client with active projects or records');
      setIsDeleteOpen(false);
      setDeletingClient(null);
    }
  };

  const displayError = actionError || error;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Clients"
        description="Manage your client relationships and keep all important details in one place."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshData()}
              disabled={isLoading}
              className="flex items-center gap-1.5 shadow-xs"
              title="Refresh Clients from Database"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Client</span>
            </Button>
          </div>
        }
      />

      {/* Database Error Banner */}
      {displayError && (
        <div className="p-4 rounded-xl bg-error-bg/70 border border-error-border text-error-text flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0" />
            <span>{displayError}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setActionError(null);
              refreshData();
            }}
            className="shrink-0 h-8 text-xs border-error-border hover:bg-error-bg"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && clients.length === 0 ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-surface-subtle border border-border-subtle" />
            ))}
          </div>
          <div className="h-96 rounded-xl bg-surface-subtle border border-border-subtle" />
        </div>
      ) : (
        <>
          {/* Summary Metrics */}
          <ClientSummaryCards clients={clients} />

          {/* Client Directory Table */}
          <ClientTable
            clients={clients}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onAddNew={handleOpenAdd}
          />
        </>
      )}

      {/* Add / Edit Client Modal */}
      <ClientFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        initialData={editingClient}
      />

      {/* Delete Client Confirmation Modal */}
      <ClientDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingClient(null);
        }}
        onConfirm={handleConfirmDelete}
        clientName={deletingClient?.name || 'this client'}
      />
    </div>
  );
}
