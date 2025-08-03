"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingFormData {
  checkinDate: string;
  checkoutDate: string;
  customerName: string;
  customerPhone: string;
  bookingAmount: number;
  advanceAmount: number;
  numberOfGuests: number;
}

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

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  selectedBooking?: Booking | null;
  onClearSelection: () => void;
  existingBookings?: Booking[];
}

export default function BookingForm({ onSubmit, selectedBooking, onClearSelection, existingBookings = [] }: BookingFormProps) {
  const [checkinDate, setCheckinDate] = useState<Date>();
  const [checkoutDate, setCheckoutDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BookingFormData>();


  // Function to check if a date is booked (excluding current booking being edited)
  const isDateBooked = (date: Date) => {
    return existingBookings.some(booking => {
      // Skip the current booking being edited
      if (selectedBooking && booking.id === selectedBooking.id) {
        return false;
      }
      
      const bookingCheckin = new Date(booking.checkinDate);
      const bookingCheckout = new Date(booking.checkoutDate);
      
      // Check if the date falls within any existing booking period
      return isWithinInterval(date, { 
        start: bookingCheckin, 
        end: new Date(bookingCheckout.getTime() - 24 * 60 * 60 * 1000) // Exclude checkout date
      });
    });
  };

  // Function to check if a date range overlaps with existing bookings
  const hasDateRangeOverlap = (startDate: Date, endDate: Date) => {
    return existingBookings.some(booking => {
      // Skip the current booking being edited
      if (selectedBooking && booking.id === selectedBooking.id) {
        return false;
      }
      
      const bookingCheckin = new Date(booking.checkinDate);
      const bookingCheckout = new Date(booking.checkoutDate);
      
      // Check for any overlap
      return (
        (startDate >= bookingCheckin && startDate < bookingCheckout) ||
        (endDate > bookingCheckin && endDate <= bookingCheckout) ||
        (startDate <= bookingCheckin && endDate >= bookingCheckout)
      );
    });
  };

  // Populate form when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setValue("customerName", selectedBooking.customerName);
      setValue("customerPhone", selectedBooking.customerPhone);
      setValue("bookingAmount", selectedBooking.bookingAmount);
      setValue("advanceAmount", selectedBooking.advanceAmount);
      setValue("numberOfGuests", selectedBooking.numberOfGuests);
      setCheckinDate(new Date(selectedBooking.checkinDate));
      setCheckoutDate(new Date(selectedBooking.checkoutDate));
    }
  }, [selectedBooking, setValue]);

  const onFormSubmit = async (data: BookingFormData) => {
    if (!checkinDate || !checkoutDate) {
      return;
    }

    if (checkoutDate <= checkinDate) {
      return;
    }

    // Check for date overlap before submitting
    if (hasDateRangeOverlap(checkinDate, checkoutDate)) {
      alert('The selected dates overlap with an existing booking. Please choose different dates.');
      return;
    }

    setIsLoading(true);
    
    const formData = {
      ...data,
      checkinDate: format(checkinDate, "yyyy-MM-dd"),
      checkoutDate: format(checkoutDate, "yyyy-MM-dd"),
      bookingAmount: Number(data.bookingAmount),
      advanceAmount: Number(data.advanceAmount),
      numberOfGuests: Number(data.numberOfGuests),
    };

    await onSubmit(formData);
    
    // Reset form after submission
    reset();
    setCheckinDate(undefined);
    setCheckoutDate(undefined);
    setIsLoading(false);
  };

  const handleClear = () => {
    reset();
    setCheckinDate(undefined);
    setCheckoutDate(undefined);
    onClearSelection();
  };

  const calculateDays = () => {
    if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
      const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const days = calculateDays();

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Check-in Date */}
      <div className="space-y-2">
        <Label htmlFor="checkinDate">Check-in Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !checkinDate && "text-muted-foreground"
              )}
            >
              {checkinDate ? format(checkinDate, "PPP") : "Pick check-in date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkinDate}
              onSelect={setCheckinDate}
              initialFocus
              disabled={(date) => {
                // Disable past dates
                if (date < new Date()) return true;
                // Disable booked dates
                return isDateBooked(date);
              }}
              modifiers={{
                booked: (date) => isDateBooked(date)
              }}
              modifiersStyles={{
                booked: { 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626',
                  textDecoration: 'line-through'
                }
              }}
            />
          </PopoverContent>
        </Popover>
        {!checkinDate && (
          <p className="text-sm text-destructive">Check-in date is required</p>
        )}
        <p className="text-xs text-muted-foreground">
          Red crossed-out dates are already booked
        </p>
      </div>

      {/* Check-out Date */}
      <div className="space-y-2">
        <Label htmlFor="checkoutDate">Check-out Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !checkoutDate && "text-muted-foreground"
              )}
            >
              {checkoutDate ? format(checkoutDate, "PPP") : "Pick check-out date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkoutDate}
              onSelect={setCheckoutDate}
              initialFocus
              disabled={(date) => {
                // Disable if no check-in date selected
                if (!checkinDate) return true;
                // Disable dates before or equal to check-in
                if (date <= checkinDate) return true;
                // Disable booked dates
                return isDateBooked(date);
              }}
              modifiers={{
                booked: (date) => isDateBooked(date)
              }}
              modifiersStyles={{
                booked: { 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626',
                  textDecoration: 'line-through'
                }
              }}
            />
          </PopoverContent>
        </Popover>
        {!checkoutDate && (
          <p className="text-sm text-destructive">Check-out date is required</p>
        )}
        {checkoutDate && checkinDate && checkoutDate <= checkinDate && (
          <p className="text-sm text-destructive">Check-out date must be after check-in date</p>
        )}
        {days > 0 && (
          <p className="text-sm text-green-600">Duration: {days} day{days !== 1 ? 's' : ''}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Red crossed-out dates are already booked
        </p>
      </div>

      {/* Customer Name */}
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          type="text"
          placeholder="Enter customer name"
          {...register("customerName", {
            required: "Customer name is required",
            minLength: {
              value: 2,
              message: "Customer name must be at least 2 characters",
            },
          })}
        />
        {errors.customerName && (
          <p className="text-sm text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      {/* Customer Phone */}
      <div className="space-y-2">
        <Label htmlFor="customerPhone">Customer Phone *</Label>
        <Input
          id="customerPhone"
          type="tel"
          placeholder="Enter customer phone number"
          {...register("customerPhone", {
            required: "Customer phone is required",
            pattern: {
              value: /^[\+]?[0-9\-\(\)\s]{10,}$/,
              message: "Please enter a valid phone number",
            },
          })}
        />
        {errors.customerPhone && (
          <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
        )}
      </div>

      {/* Booking Amount */}
      <div className="space-y-2">
        <Label htmlFor="bookingAmount">Booking Amount *</Label>
        <Input
          id="bookingAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter booking amount"
          {...register("bookingAmount", {
            required: "Booking amount is required",
            min: {
              value: 0,
              message: "Booking amount must be positive",
            },
          })}
        />
        {errors.bookingAmount && (
          <p className="text-sm text-destructive">{errors.bookingAmount.message}</p>
        )}
      </div>

      {/* Advance Amount */}
      <div className="space-y-2">
        <Label htmlFor="advanceAmount">Advance Amount *</Label>
        <Input
          id="advanceAmount"
          type="number"
          step="0.01"
          min="0"
          placeholder="Enter advance amount"
          {...register("advanceAmount", {
            required: "Advance amount is required",
            min: {
              value: 0,
              message: "Advance amount must be positive",
            },
          })}
        />
        {errors.advanceAmount && (
          <p className="text-sm text-destructive">{errors.advanceAmount.message}</p>
        )}
      </div>

      {/* Number of Guests */}
      <div className="space-y-2">
        <Label htmlFor="numberOfGuests">Number of Guests *</Label>
        <Input
          id="numberOfGuests"
          type="number"
          min="1"
          placeholder="Enter number of guests"
          {...register("numberOfGuests", {
            required: "Number of guests is required",
            min: {
              value: 1,
              message: "At least 1 guest is required",
            },
          })}
        />
        {errors.numberOfGuests && (
          <p className="text-sm text-destructive">{errors.numberOfGuests.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={isLoading || !checkinDate || !checkoutDate || (checkoutDate <= checkinDate)}
          className="flex-1"
        >
          {isLoading ? "Saving..." : selectedBooking ? "Update Booking" : "Add Booking"}
        </Button>
        
        {selectedBooking && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Clear Selection
          </Button>
        )}
      </div>
    </form>
  );
}
