import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { 
  updateBookingInAirtable, 
  deleteBookingFromAirtable, 
  checkBookingOverlap 
} from '@/lib/airtable';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Delete the booking from Airtable
    await deleteBookingFromAirtable(id);

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['checkinDate', 'checkoutDate', 'customerName', 'customerPhone', 'bookingAmount', 'advanceAmount', 'numberOfGuests'];
    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate data types and values
    if (typeof body.customerName !== 'string' || body.customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Customer name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (typeof body.customerPhone !== 'string' || body.customerPhone.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Customer phone must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (typeof body.bookingAmount !== 'number' || body.bookingAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'Booking amount must be a positive number' },
        { status: 400 }
      );
    }

    if (typeof body.advanceAmount !== 'number' || body.advanceAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'Advance amount must be a positive number' },
        { status: 400 }
      );
    }

    if (body.advanceAmount > body.bookingAmount) {
      return NextResponse.json(
        { success: false, error: 'Advance amount cannot be greater than booking amount' },
        { status: 400 }
      );
    }

    if (typeof body.numberOfGuests !== 'number' || body.numberOfGuests < 1) {
      return NextResponse.json(
        { success: false, error: 'Number of guests must be at least 1' },
        { status: 400 }
      );
    }

    // Validate check-in date
    const checkinDate = new Date(body.checkinDate);
    if (isNaN(checkinDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid check-in date format' },
        { status: 400 }
      );
    }

    // Validate check-out date
    const checkoutDate = new Date(body.checkoutDate);
    if (isNaN(checkoutDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid check-out date format' },
        { status: 400 }
      );
    }

    // Check if check-out date is after check-in date
    if (checkoutDate <= checkinDate) {
      return NextResponse.json(
        { success: false, error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings using Airtable (excluding current booking)
    const hasOverlap = await checkBookingOverlap(body.checkinDate, body.checkoutDate, id);

    if (hasOverlap) {
      return NextResponse.json(
        { success: false, error: 'The selected dates overlap with an existing booking' },
        { status: 409 }
      );
    }

    // Update the booking in Airtable
    const bookingData = {
      checkinDate: body.checkinDate,
      checkoutDate: body.checkoutDate,
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      bookingAmount: Number(body.bookingAmount),
      advanceAmount: Number(body.advanceAmount),
      numberOfGuests: Number(body.numberOfGuests),
    };

    const updatedBooking = await updateBookingInAirtable(id, bookingData);

    // Transform response to match frontend interface
    const responseBooking = {
      id: updatedBooking.id!,
      ...updatedBooking.fields
    };

    return NextResponse.json({
      success: true,
      data: responseBooking,
      message: 'Booking updated successfully',
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
