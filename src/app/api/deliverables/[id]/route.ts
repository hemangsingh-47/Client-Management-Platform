import { NextRequest } from 'next/server';
import { DeliverableService } from '@/lib/services/deliverable.service';
import { updateDeliverableSchema } from '@/lib/validations/deliverable.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deliverable = await DeliverableService.getDeliverableById(id);
    return successResponse(deliverable, 'Deliverable retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateDeliverableSchema.parse(body);
    const updated = await DeliverableService.updateDeliverable(id, validatedData);
    return successResponse(updated, 'Deliverable updated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await DeliverableService.deleteDeliverable(id);
    return successResponse({ id }, 'Deliverable deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

