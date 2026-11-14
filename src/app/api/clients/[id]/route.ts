import { NextRequest } from 'next/server';
import { ClientService } from '@/lib/services/client.service';
import { updateClientSchema } from '@/lib/validations/client.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await ClientService.getClientById(id);
    return successResponse(client, 'Client details retrieved successfully');
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
    const validatedData = updateClientSchema.parse(body);
    const updated = await ClientService.updateClient(id, validatedData);
    return successResponse(updated, 'Client updated successfully');
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
    await ClientService.deleteClient(id);
    return successResponse({ id }, 'Client deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

