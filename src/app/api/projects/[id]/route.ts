import { NextRequest } from 'next/server';
import { ProjectService } from '@/lib/services/project.service';
import { updateProjectSchema } from '@/lib/validations/project.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await ProjectService.getProjectById(id);
    return successResponse(project, 'Project details retrieved successfully');
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
    const validatedData = updateProjectSchema.parse(body);
    const updated = await ProjectService.updateProject(id, validatedData);
    return successResponse(updated, 'Project updated successfully');
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
    await ProjectService.deleteProject(id);
    return successResponse({ id }, 'Project deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

