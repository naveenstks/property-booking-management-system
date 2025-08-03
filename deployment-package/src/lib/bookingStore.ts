export interface Booking {
  id: string;
  checkinDate: string;
  checkoutDate: string;
  customerName: string;
  customerPhone: string;
  bookingAmount: number;
  advanceAmount: number;
  numberOfGuests: number;
  createdAt: string;
}

// Shared in-memory storage for demo purposes
// In a real application, this would be replaced with a database
export const bookings: Booking[] = [];
