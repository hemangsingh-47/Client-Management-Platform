import { NextRequest } from 'next/server';
import { ClientService } from '@/lib/services/client.service';
import { clientQuerySchema, createClientSchema } from '@/lib/validations/client.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = clientQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await ClientService.listClients(parsedQuery);
    return successResponse(result, 'Clients retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createClientSchema.parse(body);
    const client = await ClientService.createClient(validatedData);
    return successResponse(client, 'Client created successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

