import { NextRequest } from 'next/server';
import { MilestoneService } from '@/lib/services/milestone.service';
import { milestoneQuerySchema, createMilestoneSchema } from '@/lib/validations/milestone.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = milestoneQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await MilestoneService.listMilestones(parsedQuery);
    return successResponse(result, 'Milestones retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMilestoneSchema.parse(body);
    const milestone = await MilestoneService.createMilestone(validatedData);
    return successResponse(milestone, 'Milestone created successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

