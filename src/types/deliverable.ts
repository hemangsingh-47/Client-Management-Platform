export type DeliverableStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REVISION_REQUIRED';

export type AttachmentType =
  | 'Figma'
  | 'GitHub'
  | 'Document'
  | 'Archive'
  | 'External Link';

export interface DeliverableActivity {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  projectId: string;
  description: string;
  submissionDate: string;
  status: DeliverableStatus;
  attachmentType: AttachmentType;
  attachmentUrl?: string;
  version?: string;
  notes?: string;
  createdAt: string;
  activity?: DeliverableActivity[];
}

