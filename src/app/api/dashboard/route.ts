import { DashboardService } from '@/lib/services/dashboard.service';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET() {
  try {
    const metrics = await DashboardService.getDashboardMetrics();
    return successResponse(metrics, 'Dashboard metrics retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

