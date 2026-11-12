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
import { Plus } from 'lucide-react';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useAppContext();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  // Open Add Client modal
  const handleOpenAdd = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  // Open Edit Client modal
  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  // Open Delete confirmation modal
  const handleOpenDelete = (client: Client) => {
    setDeletingClient(client);
    setIsDeleteOpen(true);
  };

  // Save (Create or Update) client
  const handleSaveClient = (data: ClientFormData) => {
    if (editingClient) {
      updateClient(editingClient.id, {
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
        notes: data.notes,
      });
    } else {
      addClient({
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        status: data.status,
      });
    }
  };

  // Confirm delete client
  const handleConfirmDelete = () => {
    if (!deletingClient) return;
    deleteClient(deletingClient.id);
    setDeletingClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Clients"
        description="Manage your client relationships and keep all important details in one place."
        action={
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Client</span>
          </Button>
        }
      />

      {/* Summary Metrics */}
      <ClientSummaryCards clients={clients} />

      {/* Client Directory Table */}
      <ClientTable
        clients={clients}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddNew={handleOpenAdd}
      />

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
