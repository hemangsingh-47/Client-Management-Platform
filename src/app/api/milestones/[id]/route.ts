import { NextRequest } from 'next/server';
import { MilestoneService } from '@/lib/services/milestone.service';
import { updateMilestoneSchema } from '@/lib/validations/milestone.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const milestone = await MilestoneService.getMilestoneById(id);
    return successResponse(milestone, 'Milestone retrieved successfully');
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
    const validatedData = updateMilestoneSchema.parse(body);
    const updated = await MilestoneService.updateMilestone(id, validatedData);
    return successResponse(updated, 'Milestone updated successfully');
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
    await MilestoneService.deleteMilestone(id);
    return successResponse({ id }, 'Milestone deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

