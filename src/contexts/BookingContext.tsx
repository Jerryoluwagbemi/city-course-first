import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Booking {
  id: string;
  clientId: string;
  providerId?: string;
  city: string;
  service: string;
  duration: number; // weeks
  startDate: string;
  endDate: string;
  numberOfStudents: number;
  pricePerStudent: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  baseRate: number; // per week per student
  description: string;
}

export interface City {
  id: string;
  name: string;
  providers: string[]; // provider IDs
}

interface BookingContextType {
  bookings: Booking[];
  services: Service[];
  cities: City[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status'], providerId?: string) => void;
  getBookingsByUser: (userId: string) => Booking[];
  getBookingsByProvider: (providerId: string) => Booking[];
  getPendingBookingsForProvider: (providerId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Demo data
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Intensive German Course',
    baseRate: 75,
    description: 'Comprehensive German language course for all levels'
  },
  {
    id: '2',
    name: 'Business English Course',
    baseRate: 85,
    description: 'Professional English for business environments'
  },
  {
    id: '3',
    name: 'Spanish Conversation Course',
    baseRate: 65,
    description: 'Focus on speaking and conversation skills'
  }
];

const initialCities: City[] = [
  {
    id: '1',
    name: 'Berlin',
    providers: ['provider1', 'provider2']
  },
  {
    id: '2',
    name: 'Munich',
    providers: ['provider3', 'provider4']
  },
  {
    id: '3',
    name: 'Hamburg',
    providers: ['provider5']
  },
  {
    id: '4',
    name: 'Frankfurt',
    providers: ['provider6', 'provider7']
  }
];

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services] = useState<Service[]>(initialServices);
  const [cities] = useState<City[]>(initialCities);

  useEffect(() => {
    // Load bookings from localStorage
    const storedBookings = localStorage.getItem('booking_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('booking_bookings', JSON.stringify(newBookings));
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [...bookings, newBooking];
    saveBookings(updatedBookings);

    // Simulate sending notifications to providers
    console.log(`Booking created! Notifications sent to providers in ${bookingData.city}`);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status'], providerId?: string) => {
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status,
          providerId: providerId || booking.providerId,
          confirmedAt: status === 'confirmed' ? new Date().toISOString() : booking.confirmedAt
        };
      }
      return booking;
    });

    saveBookings(updatedBookings);
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter(booking => booking.clientId === userId);
  };

  const getBookingsByProvider = (providerId: string) => {
    return bookings.filter(booking => booking.providerId === providerId);
  };

  const getPendingBookingsForProvider = (providerId: string) => {
    // Get pending bookings in cities where this provider operates
    const providerCities = cities.filter(city => city.providers.includes(providerId));
    const cityNames = providerCities.map(city => city.name);
    
    return bookings.filter(booking => 
      booking.status === 'pending' && 
      cityNames.includes(booking.city)
    );
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      services,
      cities,
      createBooking,
      updateBookingStatus,
      getBookingsByUser,
      getBookingsByProvider,
      getPendingBookingsForProvider
    }}>
      {children}
    </BookingContext.Provider>
  );
};