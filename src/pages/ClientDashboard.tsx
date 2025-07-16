import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Euro, 
  MessageSquare, 
  FileText,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getBookingsByUser } = useBooking();
  
  const userBookings = user ? getBookingsByUser(user.id) : [];
  const pendingBookings = userBookings.filter(b => b.status === 'pending');
  const confirmedBookings = userBookings.filter(b => b.status === 'confirmed');
  const pastBookings = userBookings.filter(b => b.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'confirmed': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">CourseBook</h1>
              <p className="text-sm text-muted-foreground">Client Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.firstName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.firstName}!</h1>
          <p className="text-muted-foreground">Manage your course bookings and account</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/book')}>
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">New Booking</h3>
              <p className="text-sm text-muted-foreground">Book a new course</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="font-semibold">{pendingBookings.length}</h3>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold">{confirmedBookings.length}</h3>
              <p className="text-sm text-muted-foreground">Confirmed Bookings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-info mx-auto mb-2" />
              <h3 className="font-semibold">0</h3>
              <p className="text-sm text-muted-foreground">Invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Bookings</h2>
              <Button onClick={() => navigate('/book')}>
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </div>

            {userBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">Start by booking your first course</p>
                  <Button onClick={() => navigate('/book')}>Book a Course</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userBookings.map(booking => (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{booking.service}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {booking.city}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {booking.duration} weeks
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {booking.numberOfStudents} students
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Start Date:</span>
                          <p className="font-medium">{format(new Date(booking.startDate), 'PPP')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">End Date:</span>
                          <p className="font-medium">{format(new Date(booking.endDate), 'PPP')}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Price:</span>
                          <p className="font-medium flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                          <p className="text-sm text-warning-foreground">
                            Waiting for provider confirmation. We'll notify you as soon as a provider accepts your request.
                          </p>
                        </div>
                      )}

                      {booking.status === 'confirmed' && (
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Contact Provider
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <p className="text-lg">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <p className="text-lg">{user.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <p className="text-lg capitalize">{user.role}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground">Messages with providers will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
                <p className="text-muted-foreground">Invoices will be generated after course completion</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;