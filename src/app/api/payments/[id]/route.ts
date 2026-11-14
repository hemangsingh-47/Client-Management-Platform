import { NextRequest } from 'next/server';
import { PaymentService } from '@/lib/services/payment.service';
import { updatePaymentSchema } from '@/lib/validations/payment.schema';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payment = await PaymentService.getPaymentById(id);
    return successResponse(payment, 'Payment retrieved successfully');
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
    const validatedData = updatePaymentSchema.parse(body);
    const updated = await PaymentService.updatePayment(id, validatedData);
    return successResponse(updated, 'Payment updated successfully');
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
    await PaymentService.deletePayment(id);
    return successResponse({ id }, 'Payment deleted successfully');
  } catch (error) {
    return errorResponse(error);
  }
}

