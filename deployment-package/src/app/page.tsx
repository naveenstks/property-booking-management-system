"use client";

import { useState, useEffect } from "react";
import BookingForm from "@/components/BookingForm";
import BookingTable from "@/components/BookingTable";
import MonthlyBookings from "@/components/MonthlyBookings";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load bookings on component mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const result = await response.json();
          setBookings(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load bookings:', error);
      }
    };
    loadBookings();
  }, []);

  const handleBookingSubmit = async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    try {
      if (selectedBooking) {
        // Update existing booking
        const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (response.ok) {
          setBookings(prev => 
            prev.map(booking => 
              booking.id === selectedBooking.id ? result.data : booking
            )
          );
          setAlert({ type: 'success', message: 'Booking updated successfully!' });
          setSelectedBooking(null);
        } else {
          setAlert({ type: 'error', message: result.error || 'Failed to update booking' });
        }
      } else {
        // Create new booking
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (response.ok) {
          setBookings(prev => [...prev, result.data]);
          setAlert({ type: 'success', message: 'Booking saved successfully!' });
        } else {
          setAlert({ type: 'error', message: result.error || 'Failed to save booking' });
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    }

    // Clear alert after 10 seconds
    setTimeout(() => setAlert(null), 10000);
  };

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleBookingDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking.id !== id));
        setAlert({ type: 'success', message: 'Booking deleted successfully!' });
        if (selectedBooking?.id === id) {
          setSelectedBooking(null);
        }
      } else {
        setAlert({ type: 'error', message: 'Failed to delete booking' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Network error. Please try again.' });
    }

    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="w-full mb-8">
        <img 
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1222d3c1-aeea-440e-ad41-17a1e7349e33.png" 
          alt="Property Booking Management Dashboard Modern Clean Interface" 
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.style.display = 'none'; 
          }} 
          className="w-full h-64 object-cover rounded-lg shadow-lg"
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Property Booking Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your weekend property bookings with ease
          </p>
        </div>

        {/* Alert Messages */}
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'error' ? 'border-destructive' : 'border-green-500'}`}>
            <AlertDescription className={alert.type === 'error' ? 'text-destructive' : 'text-green-600'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Form */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                {selectedBooking ? 'Update Booking' : 'Add New Booking'}
              </h2>
              <BookingForm 
                onSubmit={handleBookingSubmit}
                selectedBooking={selectedBooking}
                onClearSelection={() => setSelectedBooking(null)}
                existingBookings={bookings}
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
                Current Bookings
              </h2>
              <BookingTable 
                bookings={bookings}
                onBookingSelect={handleBookingSelect}
                onBookingDelete={handleBookingDelete}
                selectedBookingId={selectedBooking?.id}
              />
            </div>
          </div>
        </div>

        {/* Monthly Bookings Section */}
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
            Monthly Bookings Overview
          </h2>
          <MonthlyBookings bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
