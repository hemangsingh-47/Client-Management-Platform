import { NextRequest } from 'next/server';
import { TaskService } from '@/lib/services/task.service';
import { taskQuerySchema, createTaskSchema } from '@/lib/validations/task.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = taskQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await TaskService.listTasks(parsedQuery);
    return successResponse(result, 'Tasks retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createTaskSchema.parse(body);
    const task = await TaskService.createTask(validatedData);
    return successResponse(task, 'Task created successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

