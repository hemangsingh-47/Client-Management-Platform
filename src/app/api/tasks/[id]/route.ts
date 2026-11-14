import { NextRequest } from 'next/server';
import { TaskService } from '@/lib/services/task.service';
import { updateTaskSchema } from '@/lib/validations/task.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await TaskService.getTaskById(id);
    return successResponse(task, 'Task retrieved successfully');
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
    const validatedData = updateTaskSchema.parse(body);
    const updated = await TaskService.updateTask(id, validatedData);
    return successResponse(updated, 'Task updated successfully');
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
    await TaskService.deleteTask(id);
    return successResponse({ id }, 'Task deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

