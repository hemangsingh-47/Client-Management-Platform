import { NextRequest } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { paymentQuerySchema, createPaymentSchema } from '@/lib/validations/payment.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = paymentQuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const result = await PaymentService.listPayments(parsedQuery);
    return successResponse(result, 'Payments retrieved successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);
    const payment = await PaymentService.recordPayment(validatedData);
    return successResponse(payment, 'Payment recorded successfully', 201);
  } catch (error) {
    return errorResponse(error);
  }
}

