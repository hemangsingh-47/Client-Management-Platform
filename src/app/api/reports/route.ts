import { NextRequest } from 'next/server';
import { ReportService } from '@/lib/services/report.service';
import { reportQuerySchema } from '@/lib/validations/report.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = reportQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const report = await ReportService.generateReport(parsedQuery);
    return successResponse(report, 'Report data generated successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

