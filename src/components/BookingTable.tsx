"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Booking {
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

interface BookingTableProps {
  bookings: Booking[];
  onBookingSelect: (booking: Booking) => void;
  onBookingDelete: (id: string) => void;
  selectedBookingId?: string;
}

export default function BookingTable({
  bookings,
  onBookingSelect,
  onBookingDelete,
  selectedBookingId,
}: BookingTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  const getRemainingAmount = (bookingAmount: number, advanceAmount: number) => {
    return bookingAmount - advanceAmount;
  };

  const calculateDays = (checkinDate: string, checkoutDate: string) => {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <img 
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/58261ba7-e267-4ab5-aca0-cbc8ce271789.png" 
            alt="No bookings found empty state illustration" 
            onError={(e) => { 
              e.currentTarget.onerror = null; 
              e.currentTarget.style.display = 'none'; 
            }} 
            className="mx-auto mb-4 rounded-lg opacity-50"
          />
        </div>
        <p className="text-muted-foreground text-lg">No bookings found</p>
        <p className="text-muted-foreground text-sm">
          Add your first booking using the form on the left
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Advance</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const remainingAmount = getRemainingAmount(booking.bookingAmount, booking.advanceAmount);
              const days = calculateDays(booking.checkinDate, booking.checkoutDate);
              const isSelected = selectedBookingId === booking.id;
              
              return (
                <TableRow 
                  key={booking.id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    isSelected ? 'bg-muted' : ''
                  }`}
                  onClick={() => onBookingSelect(booking)}
                >
                  <TableCell className="font-medium">
                    {formatDate(booking.checkinDate)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDate(booking.checkoutDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <Badge variant="outline" className="text-xs">
                          {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'guest' : 'guests'}
                        </Badge>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {booking.customerPhone}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {days} {days === 1 ? 'day' : 'days'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(booking.bookingAmount)}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatCurrency(booking.advanceAmount)}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatCurrency(remainingAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingSelect(booking);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const days = calculateDays(booking.checkinDate, booking.checkoutDate);
                          const balanceAmount = booking.bookingAmount - booking.advanceAmount;
                          const copyText = `Checkin Date: ${formatDate(booking.checkinDate)}\nCheckout date: ${formatDate(booking.checkoutDate)}\nNumber of days: ${days}\nName: ${booking.customerName}\nPhone number: ${booking.customerPhone}\nBooking amount: ${formatCurrency(booking.bookingAmount)}\nAdvance Amount: ${formatCurrency(booking.advanceAmount)}\nBalance Amount: ${formatCurrency(balanceAmount)}`;
                          
                          navigator.clipboard.writeText(copyText).then(() => {
                            alert('Booking details copied to clipboard!');
                          }).catch(() => {
                            // Fallback for older browsers
                            const textArea = document.createElement('textarea');
                            textArea.value = copyText;
                            document.body.appendChild(textArea);
                            textArea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textArea);
                            alert('Booking details copied to clipboard!');
                          });
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this booking?')) {
                            onBookingDelete(booking.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary Stats - Updated to show days instead of guests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
          <p className="text-2xl font-bold text-card-foreground">{bookings.length}</p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(bookings.reduce((sum, booking) => sum + booking.bookingAmount, 0))}
          </p>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Days Booked</h3>
          <p className="text-2xl font-bold text-card-foreground">
            {bookings.reduce((sum, booking) => sum + calculateDays(booking.checkinDate, booking.checkoutDate), 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
