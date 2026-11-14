import { NextRequest } from 'next/server';
import { ProjectService } from '@/lib/services/project.service';
import { projectQuerySchema, createProjectSchema } from '@/lib/validations/project.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = projectQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await ProjectService.listProjects(parsedQuery);
    return successResponse(result, 'Projects retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);
    const project = await ProjectService.createProject(validatedData);
    return successResponse(project, 'Project created successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

