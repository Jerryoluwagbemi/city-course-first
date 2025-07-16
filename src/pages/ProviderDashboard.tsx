import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, MapPin, Users, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { getPendingBookingsForProvider, updateBookingStatus } = useBooking();
  const { toast } = useToast();
  
  const pendingBookings = user ? getPendingBookingsForProvider(user.id) : [];

  const handleAcceptBooking = (bookingId: string) => {
    if (!user) return;
    
    updateBookingStatus(bookingId, 'confirmed', user.id);
    toast({
      title: "Booking Accepted!",
      description: "You've successfully accepted this booking request.",
    });
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-lg font-semibold">Provider Dashboard</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Pending Booking Requests</h1>
        
        {pendingBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
              <p className="text-muted-foreground">New booking requests will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingBookings.map(booking => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{booking.service}</CardTitle>
                    <Badge className="bg-warning text-warning-foreground">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.city}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {booking.numberOfStudents} students
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p>Start: {format(new Date(booking.startDate), 'PPP')}</p>
                      <p>Duration: {booking.duration} weeks</p>
                      <div className="flex items-center">
                        <Euro className="w-4 h-4 mr-2" />
                        {booking.totalPrice} total
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleAcceptBooking(booking.id)} className="w-full">
                    <Check className="w-4 h-4 mr-2" />
                    Accept Booking
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;