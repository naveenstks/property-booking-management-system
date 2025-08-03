// Airtable Database Integration
import Airtable from 'airtable';

// Configure Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

const BOOKINGS_TABLE = 'Bookings';

export interface AirtableBooking {
  id?: string;
  fields: {
    checkinDate: string;
    checkoutDate: string;
    customerName: string;
    customerPhone: string;
    bookingAmount: number;
    advanceAmount: number;
    numberOfGuests: number;
    createdAt: string;
  };
}

// Get all bookings from Airtable
export async function getBookingsFromAirtable(): Promise<AirtableBooking[]> {
  try {
    const records = await base(BOOKINGS_TABLE).select({
      sort: [{ field: 'checkinDate', direction: 'asc' }]
    }).all();

    return records.map((record: any) => ({
      id: record.id,
      fields: record.fields as AirtableBooking['fields']
    }));
  } catch (error) {
    console.error('Error fetching bookings from Airtable:', error);
    throw new Error('Failed to fetch bookings');
  }
}

// Create new booking in Airtable
export async function createBookingInAirtable(bookingData: Omit<AirtableBooking['fields'], 'createdAt'>): Promise<AirtableBooking> {
  try {
    const record = await base(BOOKINGS_TABLE).create([
      {
        fields: {
          ...bookingData,
          createdAt: new Date().toISOString()
        }
      }
    ]);

    return {
      id: record[0].id,
      fields: record[0].fields as AirtableBooking['fields']
    };
  } catch (error) {
    console.error('Error creating booking in Airtable:', error);
    throw new Error('Failed to create booking');
  }
}

// Update booking in Airtable
export async function updateBookingInAirtable(id: string, bookingData: Omit<AirtableBooking['fields'], 'createdAt'>): Promise<AirtableBooking> {
  try {
    const record = await base(BOOKINGS_TABLE).update([
      {
        id,
        fields: bookingData
      }
    ]);

    return {
      id: record[0].id,
      fields: record[0].fields as AirtableBooking['fields']
    };
  } catch (error) {
    console.error('Error updating booking in Airtable:', error);
    throw new Error('Failed to update booking');
  }
}

// Delete booking from Airtable
export async function deleteBookingFromAirtable(id: string): Promise<void> {
  try {
    await base(BOOKINGS_TABLE).destroy([id]);
  } catch (error) {
    console.error('Error deleting booking from Airtable:', error);
    throw new Error('Failed to delete booking');
  }
}

// Check for overlapping bookings
export async function checkBookingOverlap(
  checkinDate: string, 
  checkoutDate: string, 
  excludeId?: string
): Promise<boolean> {
  try {
    const bookings = await getBookingsFromAirtable();
    
    return bookings.some(booking => {
      if (excludeId && booking.id === excludeId) return false;
      
      const existingCheckin = new Date(booking.fields.checkinDate);
      const existingCheckout = new Date(booking.fields.checkoutDate);
      const newCheckin = new Date(checkinDate);
      const newCheckout = new Date(checkoutDate);
      
      return (
        (newCheckin >= existingCheckin && newCheckin < existingCheckout) ||
        (newCheckout > existingCheckin && newCheckout <= existingCheckout) ||
        (newCheckin <= existingCheckin && newCheckout >= existingCheckout)
      );
    });
  } catch (error) {
    console.error('Error checking booking overlap:', error);
    return false;
  }
}
