import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Users, FileText, Ticket, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* User management table/list goes here */}
                <p>Manage clients, view/edit details, assign roles.</p>
                <Button className="mt-4">Add New User</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Provider Management</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Provider management table/list goes here */}
                <p>Manage service providers, assign cities, view/edit details.</p>
                <Button className="mt-4">Add New Provider</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Oversight</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Booking management table/list goes here */}
                <p>View all bookings, force-assign providers, update statuses.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Center</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Ticket/message management goes here */}
                <p>View and respond to support tickets and messages.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings & GDPR</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Settings and GDPR controls go here */}
                <p>Manage privacy, cookie consent, data export/erasure.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
