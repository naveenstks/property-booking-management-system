"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isWithinInterval } from "date-fns";

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

interface MonthlyBookingsProps {
  bookings: Booking[];
}

export default function MonthlyBookings({ bookings }: MonthlyBookingsProps) {
  const now = new Date();
  const lastMonth = subMonths(now, 1);
  const currentMonth = now;
  const nextMonth = addMonths(now, 1);

  const getBookingsForMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    return bookings.filter(booking => {
      const checkinDate = new Date(booking.checkinDate);
      const checkoutDate = new Date(booking.checkoutDate);
      
      // Check if booking overlaps with the month
      return (
        isWithinInterval(checkinDate, { start: monthStart, end: monthEnd }) ||
        isWithinInterval(checkoutDate, { start: monthStart, end: monthEnd }) ||
        (checkinDate <= monthStart && checkoutDate >= monthEnd)
      );
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateDays = (checkinDate: string, checkoutDate: string) => {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const diffTime = Math.abs(checkout.getTime() - checkin.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMonthStats = (monthBookings: Booking[]) => {
    const totalBookings = monthBookings.length;
    const totalRevenue = monthBookings.reduce((sum, booking) => sum + booking.bookingAmount, 0);
    const totalDays = monthBookings.reduce((sum, booking) => 
      sum + calculateDays(booking.checkinDate, booking.checkoutDate), 0
    );
    
    return { totalBookings, totalRevenue, totalDays };
  };

  const lastMonthBookings = getBookingsForMonth(lastMonth);
  const currentMonthBookings = getBookingsForMonth(currentMonth);
  const nextMonthBookings = getBookingsForMonth(nextMonth);

  const lastMonthStats = getMonthStats(lastMonthBookings);
  const currentMonthStats = getMonthStats(currentMonthBookings);
  const nextMonthStats = getMonthStats(nextMonthBookings);

  const MonthCard = ({ 
    title, 
    bookings, 
    stats, 
    variant 
  }: { 
    title: string; 
    bookings: Booking[]; 
    stats: { totalBookings: number; totalRevenue: number; totalDays: number };
    variant: 'past' | 'current' | 'future';
  }) => {
    const borderColor = variant === 'current' ? 'border-blue-500' : 
                       variant === 'past' ? 'border-gray-400' : 'border-green-500';
    
    return (
      <Card className={`${borderColor} border-2`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            {title}
            <Badge variant={variant === 'current' ? 'default' : 'secondary'}>
              {stats.totalBookings} bookings
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="font-semibold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Days</p>
                <p className="font-semibold">{stats.totalDays}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg/Booking</p>
                <p className="font-semibold">
                  {stats.totalBookings > 0 ? Math.round(stats.totalDays / stats.totalBookings) : 0} days
                </p>
              </div>
            </div>

            {/* Bookings List */}
            {bookings.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-2 bg-muted rounded-md text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-muted-foreground text-xs">
                          {format(new Date(booking.checkinDate), "MMM dd")} - {format(new Date(booking.checkoutDate), "MMM dd")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(booking.bookingAmount)}</p>
                        <p className="text-muted-foreground text-xs">
                          {calculateDays(booking.checkinDate, booking.checkoutDate)} days
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground text-sm py-4">
                No bookings for this month
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MonthCard
        title={format(lastMonth, "MMMM yyyy")}
        bookings={lastMonthBookings}
        stats={lastMonthStats}
        variant="past"
      />
      <MonthCard
        title={format(currentMonth, "MMMM yyyy")}
        bookings={currentMonthBookings}
        stats={currentMonthStats}
        variant="current"
      />
      <MonthCard
        title={format(nextMonth, "MMMM yyyy")}
        bookings={nextMonthBookings}
        stats={nextMonthStats}
        variant="future"
      />
    </div>
  );
}
