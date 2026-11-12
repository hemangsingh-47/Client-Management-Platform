'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  PaymentSummaryCards,
  PaymentFilters,
  PaymentTable,
  PaymentFormModal,
  PaymentReceiptModal,
  PaymentDeleteModal,
  PaymentMethodFilter,
  PaymentStatusFilter,
  PaymentSortOption,
  PaymentFormData,
} from '@/components/payments';
import { Payment } from '@/types/payment';
import { useAppContext } from '@/context/app-context';
import { Plus } from 'lucide-react';

export default function PaymentsPage() {
  const {
    payments,
    projects,
    clients,
    addPayment,
    updatePayment,
    deletePayment,
  } = useAppContext();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethodFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<PaymentStatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<PaymentSortOption>('date_desc');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);

  // Filter computation
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Method filter
    if (methodFilter !== 'ALL') {
      result = result.filter((p) => p.paymentMethod === methodFilter);
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const project = projects.find((proj) => proj.id === p.projectId);
        const client = clients.find((c) => c.id === p.clientId);
        const projectMatch = project?.title.toLowerCase().includes(q);
        const clientMatch =
          client?.name.toLowerCase().includes(q) ||
          (client?.companyName && client.companyName.toLowerCase().includes(q));
        const refMatch = p.reference.toLowerCase().includes(q);
        return Boolean(projectMatch || clientMatch || refMatch);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
        case 'date_asc':
          return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
        case 'amount_desc':
          return b.amount - a.amount;
        case 'amount_asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [payments, projects, clients, methodFilter, statusFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    methodFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    sortBy !== 'date_desc';

  const handleClearFilters = () => {
    setSearchQuery('');
    setMethodFilter('ALL');
    setStatusFilter('ALL');
    setSortBy('date_desc');
  };

  // Actions
  const handleOpenAdd = () => {
    setEditingPayment(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Payment) => {
    setEditingPayment(p);
    setIsFormOpen(true);
  };

  const handleOpenReceipt = (p: Payment) => {
    setSelectedPayment(p);
    setIsReceiptOpen(true);
  };

  const handleOpenDelete = (p: Payment) => {
    setDeletingPayment(p);
    setIsDeleteOpen(true);
  };

  const handleSavePayment = (data: PaymentFormData) => {
    if (editingPayment) {
      updatePayment(editingPayment.id, data);
    } else {
      addPayment(data);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingPayment) return;
    deletePayment(deletingPayment.id);
    setDeletingPayment(null);
  };

  const selectedProject = selectedPayment
    ? projects.find((p) => p.id === selectedPayment.projectId)
    : undefined;

  const selectedClient = selectedPayment
    ? clients.find((c) => c.id === selectedPayment.clientId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Payments"
        description="Track your freelance income, payments, and outstanding balances."
        action={
          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Record Payment</span>
          </Button>
        }
      />

      {/* 2. Summary Statistics (4 Cards) */}
      <PaymentSummaryCards payments={payments} projects={projects} />

      {/* 3. Filter Controls */}
      <PaymentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        methodFilter={methodFilter}
        onMethodChange={setMethodFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Payment History Table */}
      <PaymentTable
        payments={filteredPayments}
        projects={projects}
        clients={clients}
        onViewReceipt={handleOpenReceipt}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddNew={handleOpenAdd}
        onClearFilters={handleClearFilters}
        isFiltered={hasActiveFilters}
      />

      {/* Modals */}
      <PaymentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPayment(null);
        }}
        onSave={handleSavePayment}
        initialData={editingPayment}
        projects={projects}
        clients={clients}
        existingPayments={payments}
      />

      <PaymentReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => {
          setIsReceiptOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        project={selectedProject}
        client={selectedClient}
        onEdit={handleOpenEdit}
      />

      <PaymentDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingPayment(null);
        }}
        onConfirm={handleConfirmDelete}
        amount={deletingPayment?.amount || 0}
        reference={deletingPayment?.reference || ''}
      />
    </div>
  );
}
