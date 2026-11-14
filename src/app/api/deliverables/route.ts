import { NextRequest } from 'next/server';
import { DeliverableService } from '@/lib/services/deliverable.service';
import { deliverableQuerySchema, createDeliverableSchema } from '@/lib/validations/deliverable.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = deliverableQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await DeliverableService.listDeliverables(parsedQuery);
    return successResponse(result, 'Deliverables retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createDeliverableSchema.parse(body);
    const deliverable = await DeliverableService.createDeliverable(validatedData);
    return successResponse(deliverable, 'Deliverable created successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

